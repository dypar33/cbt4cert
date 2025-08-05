import { loadStorage, updatePreferences, toggleDarkMode } from '../../../utils/storage.js'
import { images } from '../../../assets/images.js'

export class Home {
  constructor(container) {
    this.container = container
    this.catalog = null
    this.onStartQuiz = null
  }

  /**
   * 홈 화면 렌더링
   */
  render(catalog, onStartQuiz) {
    this.catalog = catalog
    this.onStartQuiz = onStartQuiz

    const storage = loadStorage()
    const prefs = storage.preferences

    this.container.innerHTML = `
      <div class="container">
        <header style="text-align: center; margin-bottom: var(--space-8);">
          <h1 class="cat-logo" style="color: var(--color-primary); margin: var(--space-8) 0 var(--space-4) 0; font-size: var(--font-size-3xl);">
            CBT4Cert <span class="cute-cat-icon"></span>
          </h1>
          <p style="color: var(--color-text-secondary); margin: 0;">
            자격증 CBT 연습 사이트 <span class="cat-paw"></span>
          </p>
          <button class="btn btn-secondary" id="theme-toggle" style="margin-top: var(--space-4);">
            ${prefs.darkMode ? '☀️ 라이트 모드' : '🌙 다크 모드'}
          </button>
        </header>

        <form id="quiz-form" style="max-width: 500px; margin: 0 auto;">
          <div style="margin-bottom: var(--space-6);">
            <label for="certification" style="display: block; margin-bottom: var(--space-2); font-weight: 500;">
              자격증 선택
            </label>
            <select id="certification" class="input" required>
              <option value="">자격증을 선택하세요</option>
              ${catalog.certifications.map(cert => 
                `<option value="${cert.name}" ${prefs.lastCertification === cert.name ? 'selected' : ''}>
                  ${cert.name}
                </option>`
              ).join('')}
            </select>
          </div>

          <div style="margin-bottom: var(--space-6);">
            <label for="subject" style="display: block; margin-bottom: var(--space-2); font-weight: 500;">
              과목 선택
            </label>
            <select id="subject" class="input" required disabled>
              <option value="">먼저 자격증을 선택하세요</option>
            </select>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); margin-bottom: var(--space-6);">
            <div>
              <label for="order" style="display: block; margin-bottom: var(--space-2); font-weight: 500;">
                출제 순서
              </label>
              <select id="order" class="input">
                <option value="sequential" ${prefs.lastOrder === 'sequential' ? 'selected' : ''}>순차</option>
                <option value="random" ${prefs.lastOrder === 'random' ? 'selected' : ''}>랜덤</option>
                <option value="randomRepeat" ${prefs.lastOrder === 'randomRepeat' ? 'selected' : ''}>랜덤 반복</option>
              </select>
            </div>
            <div>
              <label for="mode" style="display: block; margin-bottom: var(--space-2); font-weight: 500;">
                학습 모드
              </label>
              <select id="mode" class="input">
                <option value="practice" ${prefs.lastMode === 'practice' ? 'selected' : ''}>연습 (즉시 피드백)</option>
                <option value="exam" ${prefs.lastMode === 'exam' ? 'selected' : ''}>시험 (결과는 마지막에)</option>
              </select>
            </div>
          </div>

          <div style="margin-bottom: var(--space-8);">
            <div style="
              padding: var(--space-4);
              background: var(--color-surface);
              border-radius: var(--radius-lg);
              border: 1px solid var(--color-border);
            ">
              <div style="font-weight: 500; margin-bottom: var(--space-2);">
                문제 개수
              </div>
              <div id="question-count-info" style="color: var(--color-text-secondary);">
                자격증과 과목을 선택하면 문제 개수가 표시됩니다.
              </div>
              <div id="count-input-container" style="margin-top: var(--space-3); display: none;">
                <input 
                  type="number" 
                  id="count" 
                  class="input" 
                  min="1" 
                  max="100" 
                  value="${prefs.lastCount || 20}" 
                  placeholder="출제할 문제 수를 입력하세요"
                  style="width: 100%;"
                />
              </div>
            </div>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%;">
            퀴즈 시작
          </button>
        </form>
      </div>
    `

    this.attachEventListeners()
    this.setupImages()
  }

  /**
   * 이미지 설정
   */
  setupImages() {
    // 고양이 아이콘 이미지 설정
    const cuteCatIcon = this.container.querySelector('.cute-cat-icon')
    if (cuteCatIcon) {
      cuteCatIcon.style.backgroundImage = `url(${images.cuteCat})`
    }
  }

  /**
   * 이벤트 리스너 연결
   */
  attachEventListeners() {
    // 다크 모드 토글
    const themeToggle = this.container.querySelector('#theme-toggle')
    themeToggle.addEventListener('click', () => {
      const isDark = toggleDarkMode()
      themeToggle.textContent = isDark ? '☀️ 라이트 모드' : '🌙 다크 모드'
    })

    // 자격증 선택 시 과목 목록 업데이트
    const certSelect = this.container.querySelector('#certification')
    const subjectSelect = this.container.querySelector('#subject')
    const orderSelect = this.container.querySelector('#order')
    const countInput = this.container.querySelector('#count')
    
    const updateQuestionCount = async () => {
      const certification = certSelect.value
      const subject = subjectSelect.value
      const order = orderSelect.value
      const questionCountInfo = this.container.querySelector('#question-count-info')
      const countInputContainer = this.container.querySelector('#count-input-container')
      const countInput = this.container.querySelector('#count')
      
      if (certification && subject) {
        try {
          // 실제 문제 파일에서 문제 수 확인
          const { loadQuestionBank } = await import('../data/loader.js')
          const questions = await loadQuestionBank(certification, subject)
          const availableQuestions = questions.length
          
          if (availableQuestions > 0) {
            if (order === 'randomRepeat') {
              questionCountInfo.innerHTML = `
                <strong style="color: var(--color-primary);">${availableQuestions}개</strong> 문제 중에서 랜덤 반복 출제
                <div style="font-size: var(--font-size-sm); margin-top: var(--space-1); opacity: 0.8;">
                  출제할 문제 수를 아래에 입력하세요 (같은 문제가 반복될 수 있습니다)
                </div>
              `
              countInputContainer.style.display = 'block'
              countInput.max = Math.max(100, availableQuestions)
              countInput.placeholder = `1-${Math.max(100, availableQuestions)}개`
            } else {
              questionCountInfo.innerHTML = `
                <strong style="color: var(--color-primary);">${availableQuestions}개</strong> 문제 ${order === 'sequential' ? '순차' : '랜덤'} 출제
                <div style="font-size: var(--font-size-sm); margin-top: var(--space-1); opacity: 0.8;">
                  모든 문제가 한 번씩 출제됩니다
                </div>
              `
              countInputContainer.style.display = 'none'
            }
          } else {
            questionCountInfo.innerHTML = `
              <span style="color: var(--color-error);">문제를 불러올 수 없습니다</span>
            `
            countInputContainer.style.display = 'none'
          }
        } catch (error) {
          console.error('문제 수 확인 중 오류:', error)
          questionCountInfo.innerHTML = `
            <span style="color: var(--color-error);">문제를 불러올 수 없습니다</span>
          `
          countInputContainer.style.display = 'none'
        }
      } else {
        questionCountInfo.textContent = '자격증과 과목을 선택하면 문제 개수가 표시됩니다.'
        countInputContainer.style.display = 'none'
      }
    }
    
    certSelect.addEventListener('change', () => {
      const selectedCert = this.catalog?.certifications.find(cert => cert.name === certSelect.value)
      
      if (selectedCert) {
        subjectSelect.disabled = false
        subjectSelect.innerHTML = `
          <option value="">과목을 선택하세요</option>
          ${selectedCert.subjects.map(subject => 
            `<option value="${subject}">${subject}</option>`
          ).join('')}
        `
        
        // 이전 선택 복원
        const storage = loadStorage()
        if (storage.preferences.lastSubject && selectedCert.subjects.includes(storage.preferences.lastSubject)) {
          subjectSelect.value = storage.preferences.lastSubject
          updateQuestionCount()
        }
      } else {
        subjectSelect.disabled = true
        subjectSelect.innerHTML = '<option value="">먼저 자격증을 선택하세요</option>'
        updateQuestionCount()
      }
    })
    
    // 과목 선택 시 문제 개수 업데이트
    subjectSelect.addEventListener('change', updateQuestionCount)
    
    // 출제 순서 변경 시 문제 개수 업데이트
    orderSelect.addEventListener('change', updateQuestionCount)

    // 초기 자격증이 선택되어 있으면 과목 목록 로드
    if (certSelect.value) {
      certSelect.dispatchEvent(new Event('change'))
    }

    // 폼 제출
    const form = this.container.querySelector('#quiz-form')
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      this.handleFormSubmit()
    })
  }

  /**
   * 폼 제출 처리
   */
  async handleFormSubmit() {
    const certification = this.container.querySelector('#certification').value
    const subject = this.container.querySelector('#subject').value
    const order = this.container.querySelector('#order').value
    const mode = this.container.querySelector('#mode').value
    const countInput = this.container.querySelector('#count')

    if (!certification || !subject) {
      alert('자격증과 과목을 모두 선택해주세요.')
      return
    }

    // 실제 문제 파일에서 문제 수 확인
    let availableQuestions
    try {
      const { loadQuestionBank } = await import('../data/loader.js')
      const questions = await loadQuestionBank(certification, subject)
      availableQuestions = questions.length
    } catch (error) {
      alert('선택한 과목의 문제를 불러올 수 없습니다.')
      return
    }

    if (availableQuestions === 0) {
      alert('선택한 과목에 문제가 없습니다.')
      return
    }

    // 문제 개수 설정
    let count
    if (order === 'randomRepeat') {
      // 랜덤 반복 모드: 사용자 입력값 사용
      count = parseInt(countInput.value)
      if (!count || count < 1) {
        alert('출제할 문제 수를 1개 이상 입력해주세요.')
        return
      }
      if (count > Math.max(100, availableQuestions)) {
        alert(`최대 ${Math.max(100, availableQuestions)}개까지 설정할 수 있습니다.`)
        return
      }
    } else {
      // 순차/랜덤 모드: 사용 가능한 모든 문제 출제
      count = availableQuestions
    }

    // 설정 저장
    updatePreferences({
      lastCertification: certification,
      lastSubject: subject,
      lastOrder: order,
      lastMode: mode,
      lastCount: count
    })

    // 퀴즈 시작
    const config = {
      certification,
      subject,
      order,
      mode,
      count
    }

    this.onStartQuiz?.(config)
  }
}
