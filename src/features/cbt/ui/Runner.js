import { submitAnswer } from '../engine/quiz-engine.js'
import { loadStorage, saveStorage } from '../../../utils/storage.js'
import { images } from '../../../assets/images.js'

/**
 * 텍스트를 안전하게 HTML로 변환하는 함수
 */
function escapeHtml(text) {
  if (!text) return ''
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}


export class Runner {
  constructor(container) {
    this.container = container
    this.questions = []
    this.run = null
    this.currentIndex = 0
    this.onComplete = null
    this.feedbackShown = new Set() // 피드백이 표시된 문제 인덱스 추적
    this.boundHandleKeydown = this.handleKeydown.bind(this) // 바인딩된 함수 참조 저장
    this.randomQuestionHistory = [] // 랜덤 반복 모드에서 선택된 문제 기록
    this.totalQuestionsAnswered = 0 // 랜덤 반복 모드에서 답변한 총 문제 수
  }

  /**
   * 텍스트 포맷팅 함수 - 줄바꿈, 공백, 이미지를 올바르게 처리
   */
  formatText(text, questionId = null) {
    if (!text) return ''
    
    // HTML 이스케이프 후 줄바꿈 처리
    let formatted = escapeHtml(text)
      .replace(/\n/g, '<br>')
      .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
      .replace(/  /g, '&nbsp;&nbsp;') // 연속된 공백 처리
    
    // 이미지 태그 처리: [img:index] 형식을 <img> 태그로 변환
    formatted = formatted.replace(/\[img:(\d+)\]/g, (match, index) => {
      // 현재 실행 중인 퀴즈의 자격증과 과목 정보를 동적으로 가져오기
      const certName = this.run?.config?.certification
      const subjectConfig = this.run?.config?.subject
      
      // subject가 객체인 경우 name 속성 사용, 문자열인 경우 그대로 사용
      const subjectName = typeof subjectConfig === 'object' ? subjectConfig?.name : subjectConfig
      
      // 문제 ID가 제공되지 않으면 현재 문제 ID 사용
      const currentQuestionId = questionId || this.getCurrentQuestion()?.id || 'unknown'
      
      // 이미지 파일명: {문제id}-{index}.png
      const filename = `${currentQuestionId}-${index}.png`
      
      // 동적 이미지 경로 구성
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      
      let imagePath
      if (certName && subjectName) {
        // 자격증과 과목 정보가 있는 경우 해당 경로 사용
        if (isLocalhost) {
          imagePath = `docs/data/${certName}/${subjectName}/images/${filename}`
        } else {
          imagePath = `data/${certName}/${subjectName}/images/${filename}`
        }
      } else {
        // 기본 이미지 경로 사용 (하위 호환성)
        if (isLocalhost) {
          imagePath = `docs/data/images/${filename}`
        } else {
          imagePath = `data/images/${filename}`
        }
      }

      return `
        <img 
          src="${imagePath}" 
          alt="문제 이미지" 
          style="
            max-width: 100%;
            height: auto;
            margin: var(--space-4) 0;
            border-radius: var(--radius-md);
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          "
          onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
        />
        <div style="
          display: none;
          padding: var(--space-3);
          background: var(--color-error-bg);
          color: var(--color-error);
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          margin: var(--space-4) 0;
        ">
          ⚠️ 이미지를 불러올 수 없습니다: ${filename}
        </div>
      `
    })
    
    return formatted
  }

  /**
   * 퀴즈 실행 화면 렌더링
   */
  render(questions, run, onComplete) {
    this.questions = questions
    this.run = run
    this.onComplete = onComplete
    this.currentIndex = 0
    this.feedbackShown.clear() // 피드백 상태 초기화
    this.randomQuestionHistory = [] // 랜덤 문제 기록 초기화
    this.totalQuestionsAnswered = 0 // 답변한 문제 수 초기화

    // 랜덤 반복 모드인 경우 첫 번째 문제를 랜덤으로 선택
    if (this.run.config.order === 'randomRepeat') {
      this.selectRandomQuestion()
    }

    // 저장된 진행 상태 복원
    this.restoreProgress()

    this.renderQuestion()
    this.attachEventListeners()
  }


  /**
   * 이미지 설정
   */
  setupImages() {
    // 검은 고양이 아이콘 이미지 설정
    const blackCatIcon = this.container.querySelector('.black-cat-icon')
    if (blackCatIcon) {
      blackCatIcon.style.backgroundImage = `url(${images.blackCat})`
    }
  }

  /**
   * 답안 입력 UI 렌더링
   */
  renderAnswerInput(question, userAnswer) {
    if (question.type === 'short' || !question.choices) {
      // 단답형
      return `
        <input 
          type="text" 
          class="input" 
          id="short-answer"
          placeholder="답을 입력하세요"
          value="${userAnswer[0] || ''}"
          style="width: 100%; font-size: var(--font-size-lg);"
        />
      `
    } else {
      // 객관식
      const isMultiple = question.answer.length > 1
      const inputType = isMultiple ? 'checkbox' : 'radio'
      const inputName = isMultiple ? '' : 'mcq-answer'

      return `
        <div style="display: flex; flex-direction: column; gap: var(--space-3);">
          ${question.choices.map((choice, index) => {
            const isChecked = userAnswer.includes(choice)
            const choiceId = `choice-${index}`
            
            return `
              <label 
                for="${choiceId}"
                style="
                  display: flex; 
                  align-items: center; 
                  gap: var(--space-3);
                  padding: var(--space-4);
                  border: 2px solid ${isChecked ? 'var(--color-primary)' : 'var(--color-border)'};
                  border-radius: var(--radius-lg);
                  cursor: pointer;
                  transition: all 0.2s ease;
                  background: ${isChecked ? 'var(--color-primary-bg)' : 'var(--color-surface)'};
                "
                onmouseover="this.style.borderColor = 'var(--color-primary)'"
                onmouseout="this.style.borderColor = '${isChecked ? 'var(--color-primary)' : 'var(--color-border)'}'"
              >
                <input 
                  type="${inputType}"
                  id="${choiceId}"
                  name="${inputName}"
                  value="${choice}"
                  ${isChecked ? 'checked' : ''}
                  style="
                    width: 20px; 
                    height: 20px; 
                    margin: 0;
                    accent-color: var(--color-primary);
                  "
                />
                <span style="flex: 1; font-size: var(--font-size-base);">
                  ${this.formatText(choice, this.getCurrentQuestion()?.id)}
                </span>
              </label>
            `
          }).join('')}
        </div>
      `
    }
  }

  /**
   * 이벤트 리스너 연결
   */
  attachEventListeners() {
    // 네비게이션 이벤트는 renderQuestion()에서 연결됨
    
    // 기존 키보드 이벤트 리스너 제거
    document.removeEventListener('keydown', this.boundHandleKeydown)
    
    // 키보드 단축키 새로 등록
    document.addEventListener('keydown', this.boundHandleKeydown)
  }

  /**
   * 네비게이션 버튼 이벤트 연결
   */
  attachNavigationEvents() {
    // 이전 버튼
    const prevBtn = this.container.querySelector('#prev-btn')
    prevBtn?.addEventListener('click', () => this.goToPrevious())

    // 다음 버튼
    const nextBtn = this.container.querySelector('#next-btn')
    nextBtn?.addEventListener('click', () => this.goToNext())

    // 완료 버튼
    const finishBtn = this.container.querySelector('#finish-btn')
    finishBtn?.addEventListener('click', () => this.finish())

    // 종료 버튼
    const exitBtn = this.container.querySelector('#exit-btn')
    exitBtn?.addEventListener('click', () => this.exit())
  }

  /**
   * 답안 입력 이벤트 연결
   */
  attachAnswerEvents() {
    const currentQuestion = this.getCurrentQuestion()
    if (!currentQuestion) return

    if (currentQuestion.type === 'short' || !currentQuestion.choices) {
      // 단답형
      const input = this.container.querySelector('#short-answer')
      input?.addEventListener('input', () => {
        this.saveAnswer([input.value.trim()])
      })
      
      // Enter 키로 다음 문제로 이동
      input?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          this.goToNext()
        }
      })
    } else {
      // 객관식
      const inputs = this.container.querySelectorAll('input[type="radio"], input[type="checkbox"]')
      inputs.forEach(input => {
        input.addEventListener('change', () => {
          this.updateMCQAnswer()
        })
      })
    }
  }

  /**
   * 객관식 답안 업데이트
   */
  updateMCQAnswer() {
    const currentQuestion = this.getCurrentQuestion()
    if (!currentQuestion) return

    const isMultiple = currentQuestion.answer.length > 1
    
    if (isMultiple) {
      // 체크박스 (복수 선택)
      const checked = Array.from(
        this.container.querySelectorAll('input[type="checkbox"]:checked')
      )
      const answers = checked.map(input => input.value)
      this.saveAnswer(answers)
    } else {
      // 라디오 (단일 선택)
      const checked = this.container.querySelector('input[type="radio"]:checked')
      const answers = checked ? [checked.value] : []
      this.saveAnswer(answers)
    }
  }

  /**
   * 답안 저장
   */
  saveAnswer(answer) {
    if (!this.run) return

    const currentQuestion = this.getCurrentQuestion()
    if (!currentQuestion) return

    // 랜덤 반복 모드에서는 고유 ID를 사용하여 답안 저장
    const questionId = this.run.config.order === 'randomRepeat' 
      ? this.run.questionIds[this.currentIndex]  // 고유 ID 사용
      : currentQuestion.id  // 원본 ID 사용

    // 퀴즈 엔진에 답안 제출 (question 파라미터 추가)
    const result = submitAnswer(this.run, questionId, answer, currentQuestion)
    
    // 업데이트된 run 상태 적용
    this.run = result.run
    
    // 상태 저장
    this.saveProgress()

    // Practice 모드에서는 즉시 피드백 제거 (다음 버튼 클릭 시에만 표시)
  }

  /**
   * 이전 문제로 이동
   */
  goToPrevious() {
    if (this.currentIndex > 0) {
      this.currentIndex--
      this.renderQuestion()
      this.saveProgress()
    }
  }

  /**
   * 다음 문제로 이동
   */
  goToNext() {
    if (!this.run) return
    
    console.log('goToNext 호출됨')
    console.log('현재 모드:', this.run.config.mode)
    console.log('현재 인덱스:', this.currentIndex)
    
    // 연습 모드에서 피드백 처리
    if (this.run.config.mode === 'practice') {
      const currentQuestion = this.getCurrentQuestion()
      if (currentQuestion) {
        // 랜덤 반복 모드에서는 고유 ID를 사용하여 답안 확인
        const questionId = this.run.config.order === 'randomRepeat' 
          ? this.run.questionIds[this.currentIndex]  // 고유 ID 사용
          : currentQuestion.id  // 원본 ID 사용
        const userAnswer = this.run.answers[questionId] || []
        
        console.log('사용자 답안:', userAnswer)
        console.log('피드백 표시 여부:', this.feedbackShown.has(this.currentIndex))
        
        // 아직 피드백을 보지 않았다면 피드백 표시 (답안이 없어도 표시)
        if (!this.feedbackShown.has(this.currentIndex)) {
          console.log('피드백 표시 중...')
          this.feedbackShown.add(this.currentIndex)
          this.renderQuestion() // 피드백이 포함된 화면 다시 렌더링
          return // 다음 문제로 넘어가지 않음
        }
        
        // 피드백이 이미 표시된 경우, 다음 문제로 이동
        if (this.feedbackShown.has(this.currentIndex)) {
          console.log('피드백이 이미 표시됨, 다음 문제로 이동')
          // 일반적인 다음 문제로 이동 로직 실행
        }
      }
    }
    
    // 랜덤 반복 모드 처리
    if (this.run.config.order === 'randomRepeat') {
      this.totalQuestionsAnswered++
      
      // 설정된 문제 수에 도달했는지 확인
      if (this.totalQuestionsAnswered >= this.run.config.count) {
        // 완료 버튼으로 변경하기 위해 currentIndex를 마지막으로 설정
        this.currentIndex = this.run.questionIds.length - 1
        this.renderQuestion()
        return
      }
      
      // 다음 랜덤 문제 선택
      this.selectRandomQuestion()
      this.renderQuestion()
      this.saveProgress()
      return
    }
    
    // 일반적인 다음 문제로 이동 (sequential, random 모드)
    console.log('다음 문제로 이동 중...')
    if (this.currentIndex < this.run.questionIds.length - 1) {
      this.currentIndex++
      this.renderQuestion()
      this.saveProgress()
    }
  }

  /**
   * 퀴즈 완료
   */
  finish() {
    // 연습 모드에서 마지막 문제의 피드백을 아직 보지 않았다면 먼저 피드백 표시
    if (this.run.config.mode === 'practice' && !this.feedbackShown.has(this.currentIndex)) {
      console.log('마지막 문제 피드백 표시 중...')
      this.feedbackShown.add(this.currentIndex)
      this.renderQuestion() // 피드백이 포함된 화면 다시 렌더링
      return // 완료하지 않고 피드백만 표시
    }
    
    // 피드백을 이미 봤거나 시험 모드인 경우 완료 진행
    if (confirm('퀴즈를 완료하시겠습니까?')) {
      this.onComplete?.()
    }
  }

  /**
   * 퀴즈 중간 종료
   */
  exit() {
    const answeredCount = Object.keys(this.run.answers).length
    
    // 랜덤 반복 모드에서는 설정된 전체 문제 수를 기준으로 표시
    const totalCount = this.run.config.order === 'randomRepeat' 
      ? this.run.config.count 
      : this.run.questionIds.length
    
    const message = answeredCount > 0 
      ? `현재까지 ${answeredCount}/${totalCount}개 문제를 풀었습니다.\n정말로 종료하시겠습니까?`
      : '정말로 퀴즈를 종료하시겠습니까?'
    
    if (confirm(message)) {
      // 진행 상태 저장 후 완료 처리
      this.saveProgress()
      this.onComplete?.()
    }
  }

  /**
   * 키보드 이벤트 처리
   */
  handleKeydown(e) {
    // 키 반복 이벤트 무시 (키를 꾹 누르고 있을 때 발생하는 연속 이벤트 방지)
    if (e.repeat) {
      return
    }
    
    // 숫자키로 선택지 선택 (1-9)
    if (e.key >= '1' && e.key <= '9') {
      const index = parseInt(e.key) - 1
      const choice = this.container.querySelector(`#choice-${index}`)
      if (choice) {
        choice.click()
      }
    }
    
    // Enter 키로 '다음' 버튼 클릭 (텍스트 입력 필드가 포커스되지 않은 경우)
    if (e.key === 'Enter' && !(document.activeElement.tagName === 'INPUT' && document.activeElement.type === 'text')) {
      e.preventDefault()
      const nextBtn = this.container.querySelector('#next-btn')
      const finishBtn = this.container.querySelector('#finish-btn')
      if (nextBtn && !nextBtn.disabled) {
        nextBtn.click()
      } else if (finishBtn) {
        finishBtn.click()
      }
    }
    
    // 화살표 키로 네비게이션
    if (e.key === 'ArrowLeft') {
      this.goToPrevious()
    } else if (e.key === 'ArrowRight') {
      this.goToNext()
    }
  }

  /**
   * 현재 문제 가져오기
   */
  getCurrentQuestion() {
    if (!this.run) return undefined
    const questionId = this.run.questionIds[this.currentIndex]
    
    // 랜덤 반복 모드에서는 고유 ID에서 원본 ID를 추출
    const originalQuestionId = this.run.config.order === 'randomRepeat' 
      ? questionId.split('_')[0] 
      : questionId
    
    return this.questions.find(q => q.id === originalQuestionId)
  }

  /**
   * 답안 정답 여부 확인
   */
  checkAnswer(question, userAnswer) {
    const normalizeAnswer = (answer) => 
      answer.toLowerCase().trim().replace(/\s+/g, ' ')
    
    const correctAnswers = question.answer.map(normalizeAnswer)
    const userAnswers = userAnswer.map(normalizeAnswer)
    
    return correctAnswers.length === userAnswers.length &&
           correctAnswers.every(answer => userAnswers.includes(answer))
  }

  /**
   * 진행 상태 저장
   */
  saveProgress() {
    if (!this.run) return
    
    const storage = loadStorage()
    storage.currentRun = this.run
    storage.currentIndex = this.currentIndex
    saveStorage(storage)
  }

  /**
   * 진행 상태 복원
   */
  restoreProgress() {
    const storage = loadStorage()
    if (storage.currentIndex !== undefined) {
      this.currentIndex = Math.max(0, Math.min(
        storage.currentIndex, 
        this.run.questionIds.length - 1
      ))
    }
  }

  /**
   * 자동 포커스 설정
   */
  setAutoFocus() {
    const currentQuestion = this.getCurrentQuestion()
    if (!currentQuestion) return

    // 단답형 문제일 때 입력 필드에 자동 포커스
    if (currentQuestion.type === 'short' || !currentQuestion.choices) {
      setTimeout(() => {
        const shortAnswer = this.container.querySelector('#short-answer')
        if (shortAnswer) {
          shortAnswer.focus()
          // 커서를 텍스트 끝으로 이동
          shortAnswer.setSelectionRange(shortAnswer.value.length, shortAnswer.value.length)
        }
      }, 100)
    }
  }

  /**
   * 랜덤 문제 선택 (랜덤 반복 모드용)
   */
  selectRandomQuestion() {
    if (!this.run || this.run.config.order !== 'randomRepeat') return
    
    // 원본 문제 ID 목록 (엔진에서 반환된 전체 문제 목록)
    const originalQuestionIds = this.questions.map(q => q.id)
    
    let selectedQuestionId
    let attempts = 0
    const maxAttempts = 50 // 무한 루프 방지
    
    // 연속으로 같은 문제가 나오지 않도록 처리
    do {
      const randomIndex = Math.floor(Math.random() * originalQuestionIds.length)
      selectedQuestionId = originalQuestionIds[randomIndex]
      attempts++
    } while (
      attempts < maxAttempts && 
      this.randomQuestionHistory.length > 0 && 
      selectedQuestionId === this.randomQuestionHistory[this.randomQuestionHistory.length - 1].split('_')[0]
    )
    
    // 랜덤 반복 모드에서는 각 문제 인스턴스를 고유하게 식별하기 위해 인덱스를 추가
    const uniqueQuestionId = `${selectedQuestionId}_${this.randomQuestionHistory.length}`
    
    // 선택된 문제를 기록에 추가 (고유 ID로)
    this.randomQuestionHistory.push(uniqueQuestionId)
    
    // run.questionIds를 현재 선택된 문제들로 업데이트
    this.run.questionIds = [...this.randomQuestionHistory]
    
    // 현재 인덱스를 마지막 문제로 설정
    this.currentIndex = this.randomQuestionHistory.length - 1
  }

  /**
   * 현재 문제 렌더링 (진행률 수정)
   */
  renderQuestion() {
    if (!this.run || !this.questions.length) return

    const currentQuestion = this.getCurrentQuestion()
    if (!currentQuestion) return

    // 랜덤 반복 모드에서는 답변한 문제 수 기준으로 진행률 계산
    let progress, progressText
    if (this.run.config.order === 'randomRepeat') {
      const currentQuestionNumber = Math.min(this.totalQuestionsAnswered + 1, this.run.config.count)
      progress = (this.totalQuestionsAnswered / this.run.config.count) * 100
      progressText = `${currentQuestionNumber} / ${this.run.config.count}`
    } else {
      progress = ((this.currentIndex + 1) / this.run.questionIds.length) * 100
      progressText = `${this.currentIndex + 1} / ${this.run.questionIds.length}`
    }

    // 랜덤 반복 모드에서 새 문제일 때 이전 답안 초기화
    const questionId = this.run.config.order === 'randomRepeat' 
      ? this.run.questionIds[this.currentIndex]  // 고유 ID 사용
      : currentQuestion.id  // 원본 ID 사용
    const userAnswer = this.shouldClearAnswer(currentQuestion) ? [] : (this.run.answers[questionId] || [])
    const isAnswered = userAnswer.length > 0

    // Practice 모드에서 피드백이 표시된 문제인 경우에만 피드백 표시 (답안이 없어도 표시)
    const showFeedback = this.run.config.mode === 'practice' && this.feedbackShown.has(this.currentIndex)
    const isCorrect = showFeedback && isAnswered ? this.checkAnswer(currentQuestion, userAnswer) : false

    this.container.innerHTML = `
      <div class="container">
        <!-- 헤더 -->
        <header style="
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          margin-bottom: var(--space-6);
          padding: var(--space-4) 0;
          border-bottom: 1px solid var(--color-border);
        ">
          <div style="font-weight: 500; color: var(--color-text-secondary);">
            ${progressText}
          </div>
          <div style="display: flex; align-items: center; gap: var(--space-3);">
            <div style="
              background: var(--color-surface); 
              padding: var(--space-2) var(--space-4); 
              border-radius: var(--radius-lg);
              font-size: var(--font-size-sm);
              color: var(--color-text-secondary);
            ">
              ${this.run.config.mode === 'practice' ? '연습 모드' : '시험 모드'}
            </div>
            <button 
              class="btn btn-secondary" 
              id="exit-btn"
              style="
                font-size: var(--font-size-sm);
                padding: var(--space-2) var(--space-3);
                background: var(--color-error);
                color: white;
                border: none;
              "
            >
              종료
            </button>
          </div>
        </header>

        <!-- 진행률 바 -->
        <div class="progress-bar" style="
          height: 8px; 
          margin-bottom: var(--space-8);
        ">
          <div class="progress-fill" style="
            height: 100%; 
            width: ${progress}%;
            transition: width 0.3s ease;
          "></div>
          <div class="progress-cat black-cat-icon"></div>
        </div>

        <!-- 문제 영역 -->
        <div style="max-width: 600px; margin: 0 auto;">
          <!-- 문제 정보 -->
          ${currentQuestion.description ? `
            <div style="
              color: var(--color-text-secondary); 
              font-size: var(--font-size-sm); 
              margin-bottom: var(--space-2);
            ">
              ${currentQuestion.description}
            </div>
          ` : ''}

          <!-- 문제 내용 -->
          <div style="
            font-size: var(--font-size-lg); 
            font-weight: 500; 
            margin-bottom: var(--space-6);
            line-height: 1.6;
          ">
            ${this.formatText(currentQuestion.question, currentQuestion.id)}
          </div>

          <!-- 답안 입력 영역 -->
          <div id="answer-area" style="margin-bottom: var(--space-8);">
            ${this.renderAnswerInput(currentQuestion, userAnswer)}
          </div>

          <!-- 피드백 영역 (Practice 모드) -->
          ${showFeedback ? `
            <div class="${isCorrect ? 'feedback-success' : 'feedback-error'}" style="
              padding: var(--space-4);
              margin-bottom: var(--space-6);
              color: white;
            ">
              <div style="
                display: flex; 
                align-items: center; 
                gap: var(--space-2); 
                margin-bottom: var(--space-2);
                font-weight: 500;
              ">
                ${isCorrect ? '✅ 정답입니다!' : '❌ 틀렸습니다.'}
              </div>
              <div style="opacity: 0.9; font-size: var(--font-size-sm);">
                정답: ${currentQuestion.answer.map(ans => this.formatText(ans, currentQuestion.id)).join(', ')}
              </div>
              ${currentQuestion.explanation ? `
                <div style="
                  opacity: 0.9; 
                  font-size: var(--font-size-sm); 
                  margin-top: var(--space-2);
                  padding-top: var(--space-2);
                  border-top: 1px solid rgba(255,255,255,0.2);
                ">
                  ${this.formatText(currentQuestion.explanation, currentQuestion.id)}
                </div>
              ` : ''}
            </div>
          ` : ''}

          <!-- 네비게이션 버튼 -->
          <div style="
            display: flex; 
            gap: var(--space-4); 
            justify-content: space-between;
            align-items: center;
          ">
            <button 
              class="btn btn-secondary" 
              id="prev-btn"
              ${this.shouldDisablePrevButton() ? 'disabled' : ''}
            >
              ← 이전
            </button>

            <div style="display: flex; gap: var(--space-2);">
              ${this.shouldShowFinishButton() ? `
                <button class="btn btn-primary" id="finish-btn">
                  완료
                </button>
              ` : `
                <button class="btn btn-primary" id="next-btn">
                  다음 →
                </button>
              `}
            </div>
          </div>
        </div>
      </div>
    `
    
    // HTML이 새로 생성되었으므로 모든 이벤트 리스너 다시 연결
    this.attachNavigationEvents()
    this.attachAnswerEvents()
    this.setupImages()
    
    // 단답형 문제일 때 자동 포커스
    this.setAutoFocus()
  }

  /**
   * 답안을 초기화해야 하는지 확인 (랜덤 반복 모드용)
   */
  shouldClearAnswer(currentQuestion) {
    if (this.run.config.order !== 'randomRepeat') return false
    
    // 랜덤 반복 모드에서는 답안을 초기화하지 않음 (고유 ID로 관리하므로)
    return false
  }

  /**
   * 이전 버튼을 비활성화해야 하는지 확인
   */
  shouldDisablePrevButton() {
    if (this.run.config.order === 'randomRepeat') {
      return this.randomQuestionHistory.length <= 1
    }
    return this.currentIndex === 0
  }

  /**
   * 완료 버튼을 표시해야 하는지 확인
   */
  shouldShowFinishButton() {
    if (this.run.config.order === 'randomRepeat') {
      return this.totalQuestionsAnswered >= this.run.config.count
    }
    return this.currentIndex === this.run.questionIds.length - 1
  }

  /**
   * 정리
   */
  destroy() {
    document.removeEventListener('keydown', this.boundHandleKeydown)
  }
}
