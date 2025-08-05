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
 */
export async function loadQuestionBank(certification, subject) {
  try {
    // 개발 환경과 배포 환경 모두 docs/data 폴더 사용
    // GitHub Pages에서는 /cbt4cert/data/ 경로 사용, 로컬에서는 docs/data/ 경로 사용
    const isGitHubPages = window.location.hostname === 'dypar33.github.io'
    const basePath = isGitHubPages ? '/cbt4cert' : '/docs'
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
  } catch (error) {
    console.error('문제 은행 로드 중 오류:', error)
    throw new Error(`${certification} - ${subject} 문제를 불러올 수 없습니다.`)
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
