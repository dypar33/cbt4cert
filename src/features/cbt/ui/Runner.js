import { submitAnswer } from '../engine/quiz-engine.js'
import { loadStorage, saveStorage } from '../../../utils/storage.js'
import { images } from '../../../assets/images.js'

export class Runner {
  constructor(container) {
    this.container = container
    this.questions = []
    this.run = null
    this.currentIndex = 0
    this.onComplete = null
    this.feedbackShown = new Set() // 피드백이 표시된 문제 인덱스 추적
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

    // 저장된 진행 상태 복원
    this.restoreProgress()

    this.renderQuestion()
    this.attachEventListeners()
  }

  /**
   * 현재 문제 렌더링
   */
  renderQuestion() {
    if (!this.run || !this.questions.length) return

    const currentQuestion = this.getCurrentQuestion()
    if (!currentQuestion) return

    const progress = ((this.currentIndex + 1) / this.run.questionIds.length) * 100
    const userAnswer = this.run.answers[currentQuestion.id] || []
    const isAnswered = userAnswer.length > 0

    // Practice 모드에서 피드백이 표시된 문제인 경우에만 피드백 표시
    const showFeedback = this.run.config.mode === 'practice' && isAnswered && this.feedbackShown.has(this.currentIndex)
    const isCorrect = showFeedback ? this.checkAnswer(currentQuestion, userAnswer) : false

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
            ${this.currentIndex + 1} / ${this.run.questionIds.length}
          </div>
          <div style="
            background: var(--color-surface); 
            padding: var(--space-2) var(--space-4); 
            border-radius: var(--radius-lg);
            font-size: var(--font-size-sm);
            color: var(--color-text-secondary);
          ">
            ${this.run.config.mode === 'practice' ? '연습 모드' : '시험 모드'}
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
            ${currentQuestion.question}
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
                정답: ${currentQuestion.answer.join(', ')}
              </div>
              ${currentQuestion.explanation ? `
                <div style="
                  opacity: 0.9; 
                  font-size: var(--font-size-sm); 
                  margin-top: var(--space-2);
                  padding-top: var(--space-2);
                  border-top: 1px solid rgba(255,255,255,0.2);
                ">
                  ${currentQuestion.explanation}
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
              ${this.currentIndex === 0 ? 'disabled' : ''}
            >
              ← 이전
            </button>

            <div style="display: flex; gap: var(--space-2);">
              ${this.currentIndex === this.run.questionIds.length - 1 ? `
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
                  ${choice}
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
    
    // 키보드 단축키
    document.addEventListener('keydown', this.handleKeydown.bind(this))
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

    // 퀴즈 엔진에 답안 제출 (question 파라미터 추가)
    const result = submitAnswer(this.run, currentQuestion.id, answer, currentQuestion)
    
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
        const userAnswer = this.run.answers[currentQuestion.id] || []
        const isAnswered = userAnswer.length > 0
        
        console.log('답안 여부:', isAnswered)
        console.log('사용자 답안:', userAnswer)
        console.log('피드백 표시 여부:', this.feedbackShown.has(this.currentIndex))
        
        // 답안이 있고 아직 피드백을 보지 않았다면 피드백 표시
        if (isAnswered && !this.feedbackShown.has(this.currentIndex)) {
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
    
    // 일반적인 다음 문제로 이동
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
    if (confirm('퀴즈를 완료하시겠습니까?')) {
      this.onComplete?.()
    }
  }

  /**
   * 키보드 이벤트 처리
   */
  handleKeydown(e) {
    // 숫자키로 선택지 선택 (1-9)
    if (e.key >= '1' && e.key <= '9') {
      const index = parseInt(e.key) - 1
      const choice = this.container.querySelector(`#choice-${index}`)
      if (choice) {
        choice.click()
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
    return this.questions.find(q => q.id === questionId)
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
   * 정리
   */
  destroy() {
    document.removeEventListener('keydown', this.handleKeydown.bind(this))
  }
}
