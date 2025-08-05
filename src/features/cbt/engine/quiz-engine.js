/**
 * 문제 계획 수립 - 출제 순서와 개수에 따라 문제 ID 목록을 생성
 */
export function planQuestions(bank, order, count) {
  if (bank.length === 0) {
    throw new Error('문제 은행이 비어있습니다.')
  }
  
  if (count <= 0) {
    throw new Error('문제 개수는 1개 이상이어야 합니다.')
  }
  
  const questionIds = bank.map(q => q.id)
  
  switch (order) {
    case 'sequential':
      return questionIds.slice(0, Math.min(count, questionIds.length))
      
    case 'random':
      return shuffle(questionIds).slice(0, Math.min(count, questionIds.length))
      
    case 'randomRepeat':
      const shuffled = shuffle(questionIds)
      const result = []
      for (let i = 0; i < count; i++) {
        result.push(shuffled[i % shuffled.length])
      }
      return result
      
    default:
      throw new Error(`지원하지 않는 출제 순서: ${order}`)
  }
}

/**
 * 퀴즈 실행 시작 - 새로운 QuizRun 객체를 생성
 */
export function startRun(config, questionIds) {
  return {
    id: generateRunId(),
    config,
    questionIds,
    currentIndex: 0,
    answers: {},
    startTime: Date.now()
  }
}

/**
 * 답안 제출 - practice 모드에서는 즉시 피드백, exam 모드에서는 기록만
 */
export function submitAnswer(run, questionId, userAnswer, question) {
  // 답안 기록
  const updatedRun = {
    ...run,
    answers: {
      ...run.answers,
      [questionId]: userAnswer
    }
  }
  
  // practice 모드에서는 즉시 피드백 제공
  if (run.config.mode === 'practice' && question) {
    const feedback = checkAnswer(userAnswer, question)
    return { run: updatedRun, feedback }
  }
  
  return { run: updatedRun }
}

/**
 * 퀴즈 완료 - 최종 결과 계산
 */
export function finishRun(run, questions) {
  const endTime = Date.now()
  const questionMap = new Map(questions.map(q => [q.id, q]))
  
  let correct = 0
  const wrong = []
  
  for (const questionId of run.questionIds) {
    // 랜덤 반복 모드에서는 고유 ID에서 원본 ID를 추출
    const originalQuestionId = run.config.order === 'randomRepeat' 
      ? questionId.split('_')[0] 
      : questionId
    
    const question = questionMap.get(originalQuestionId)
    const userAnswer = run.answers[questionId] || []
    
    if (question && isCorrectAnswer(userAnswer, question)) {
      correct++
    } else {
      wrong.push(questionId)
    }
  }
  
  // 랜덤 반복 모드에서는 설정된 전체 문제 수를 기준으로 점수 계산
  const total = run.config.order === 'randomRepeat' ? run.config.count : run.questionIds.length
  const score = total > 0 ? Math.round((correct / total) * 100) : 0
  const timeSpent = endTime - run.startTime
  
  return {
    score,
    total,
    correct,
    wrong,
    timeSpent
  }
}

/**
 * 답안 정확성 확인 - 즉시 피드백용
 */
function checkAnswer(userAnswer, question) {
  const correct = isCorrectAnswer(userAnswer, question)
  
  return {
    correct,
    expected: question.answer,
    explanation: question.explanation
  }
}

/**
 * 답안이 정답인지 확인 - 대소문자 무시, 공백 제거
 */
function isCorrectAnswer(userAnswer, question) {
  const normalizeAnswer = (answer) => 
    answer.trim().toLowerCase().replace(/\s+/g, '')
  
  const normalizedUser = userAnswer.map(normalizeAnswer).sort()
  const normalizedCorrect = question.answer.map(normalizeAnswer).sort()
  
  if (normalizedUser.length !== normalizedCorrect.length) {
    return false
  }
  
  return normalizedUser.every((answer, index) => 
    answer === normalizedCorrect[index]
  )
}

/**
 * 배열 셔플 - Fisher-Yates 알고리즘
 */
export function shuffle(array) {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * 실행 ID 생성 - 타임스탬프 + 랜덤
 */
function generateRunId() {
  return `run_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 시드 기반 랜덤 생성기 (테스트용)
 */
export function seededRandom(seed) {
  let state = seed
  return function() {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}
