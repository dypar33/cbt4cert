/**
 * 카탈로그 로드 - /data/index.json에서 자격증 목록을 가져옴
 */
export async function loadCatalog() {
  try {
    // 개발 환경과 배포 환경 모두 docs/data 폴더 사용
    // GitHub Pages에서는 /cbt4cert/data/ 경로 사용, 로컬에서는 docs/data/ 경로 사용
    const isGitHubPages = window.location.hostname === 'dypar33.github.io'
    const basePath = isGitHubPages ? '/cbt4cert' : '/docs'
    const response = await fetch(`${basePath}/data/index.json`)
    if (!response.ok) {
      throw new Error(`카탈로그 로드 실패: ${response.status}`)
    }
    const catalog = await response.json()
    validateCatalog(catalog)
    return catalog
  } catch (error) {
    console.error('카탈로그 로드 중 오류:', error)
    throw new Error('카탈로그를 불러올 수 없습니다.')
  }
}

/**
 * 문제 은행 로드 - 특정 자격증/과목의 문제들을 가져옴
 * @param {string} certification - 자격증명
 * @param {string} subject - 과목명 (문자열) 또는 과목 객체
 * @param {Array<string>} selectedChapters - 선택된 챕터 파일명 배열 (선택사항)
 */
export async function loadQuestionBank(certification, subject, selectedChapters = null) {
  try {
    const isGitHubPages = window.location.hostname === 'dypar33.github.io'
    const basePath = isGitHubPages ? '/cbt4cert' : '/docs'
    
    // 이전 버전 호환성: subject가 문자열인 경우 기존 방식 사용
    if (typeof subject === 'string') {
      const path = `${basePath}/data/${encodeURIComponent(certification)}/${encodeURIComponent(subject)}/questions.json`
      const response = await fetch(path)
      if (!response.ok) {
        throw new Error(`문제 은행 로드 실패: ${response.status}`)
      }
      const questions = await response.json()
      
      if (!Array.isArray(questions)) {
        throw new Error('문제 데이터가 배열 형태가 아닙니다.')
      }
      
      return questions.map(normalizeQuestion)
    }
    
    // 새로운 챕터 방식: subject가 객체이고 chapters가 있는 경우
    if (subject && subject.chapters) {
      const subjectName = subject.name
      let chaptersToLoad = selectedChapters || subject.chapters.map(ch => ch.file)
      
      const allQuestions = []
      
      for (const chapterFile of chaptersToLoad) {
        try {
          const path = `${basePath}/data/${encodeURIComponent(certification)}/${encodeURIComponent(subjectName)}/${encodeURIComponent(chapterFile)}`
          const response = await fetch(path)
          if (!response.ok) {
            console.warn(`챕터 파일 로드 실패: ${chapterFile} (${response.status})`)
            continue
          }
          const chapterQuestions = await response.json()
          
          if (Array.isArray(chapterQuestions)) {
            allQuestions.push(...chapterQuestions)
          }
        } catch (error) {
          console.warn(`챕터 파일 로드 중 오류: ${chapterFile}`, error)
        }
      }
      
      if (allQuestions.length === 0) {
        throw new Error('선택된 챕터에서 문제를 불러올 수 없습니다.')
      }
      
      return allQuestions.map(normalizeQuestion)
    }
    
    throw new Error('올바르지 않은 과목 데이터입니다.')
  } catch (error) {
    console.error('문제 은행 로드 중 오류:', error)
    throw new Error(`${certification} - ${typeof subject === 'string' ? subject : subject.name} 문제를 불러올 수 없습니다.`)
  }
}

/**
 * 카탈로그 유효성 검사
 */
function validateCatalog(catalog) {
  if (!catalog || typeof catalog !== 'object') {
    throw new Error('카탈로그 형식이 올바르지 않습니다.')
  }
  
  if (!Array.isArray(catalog.certifications)) {
    throw new Error('자격증 목록이 배열 형태가 아닙니다.')
  }
  
  for (const cert of catalog.certifications) {
    if (!cert.name || typeof cert.name !== 'string') {
      throw new Error('자격증 이름이 올바르지 않습니다.')
    }
    if (!Array.isArray(cert.subjects)) {
      throw new Error('과목 목록이 배열 형태가 아닙니다.')
    }
  }
}

/**
 * 문제 객체 정규화 - 기본값 적용 및 타입 추론
 */
function normalizeQuestion(raw) {
  if (!raw || typeof raw !== 'object') {
    throw new Error('문제 데이터가 객체 형태가 아닙니다.')
  }
  
  if (!raw.id || typeof raw.id !== 'string') {
    throw new Error('문제 ID가 올바르지 않습니다.')
  }
  
  if (!raw.question || typeof raw.question !== 'string') {
    throw new Error('문제 내용이 올바르지 않습니다.')
  }
  
  if (!Array.isArray(raw.answer)) {
    throw new Error('정답이 배열 형태가 아닙니다.')
  }
  
  // 타입 추론: choices가 있으면 mcq, 없으면 short
  const inferredType = raw.choices && Array.isArray(raw.choices) ? 'mcq' : 'short'
  
  return {
    id: raw.id,
    question: raw.question,
    description: raw.description || undefined,
    type: raw.type || inferredType,
    choices: raw.choices || undefined,
    answer: raw.answer,
    explanation: raw.explanation || undefined,
    tags: raw.tags || undefined
  }
}
