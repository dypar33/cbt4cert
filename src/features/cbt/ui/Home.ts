import type { Catalog, QuizConfig } from '../data/types.ts'
import { loadStorage, updatePreferences, toggleDarkMode } from '../../../utils/storage.ts'
import { images } from '../../../assets/images.ts'

export class Home {
  private container: HTMLElement
  private catalog: Catalog | null = null
  private onStartQuiz?: (config: QuizConfig) => void

  constructor(container: HTMLElement) {
    this.container = container
  }

  /**
   * 홈 화면 렌더링
   */
  render(catalog: Catalog, onStartQuiz: (config: QuizConfig) => void): void {
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
            <label for="count" style="display: block; margin-bottom: var(--space-2); font-weight: 500;">
              문제 개수
            </label>
            <input 
              type="number" 
              id="count" 
              class="input" 
              min="1" 
              max="100" 
              value="${prefs.lastCount || 10}" 
              required
            />
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
  private setupImages(): void {
    // 고양이 아이콘 이미지 설정
    const cuteCatIcon = this.container.querySelector('.cute-cat-icon') as HTMLElement
    if (cuteCatIcon) {
      cuteCatIcon.style.backgroundImage = `url(${images.cuteCat})`
    }
  }

  /**
   * 이벤트 리스너 연결
   */
  private attachEventListeners(): void {
    // 다크 모드 토글
    const themeToggle = this.container.querySelector('#theme-toggle') as HTMLButtonElement
    themeToggle.addEventListener('click', () => {
      const isDark = toggleDarkMode()
      themeToggle.textContent = isDark ? '☀️ 라이트 모드' : '🌙 다크 모드'
    })

    // 자격증 선택 시 과목 목록 업데이트
    const certSelect = this.container.querySelector('#certification') as HTMLSelectElement
    const subjectSelect = this.container.querySelector('#subject') as HTMLSelectElement
    
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
        }
      } else {
        subjectSelect.disabled = true
        subjectSelect.innerHTML = '<option value="">먼저 자격증을 선택하세요</option>'
      }
    })

    // 초기 자격증이 선택되어 있으면 과목 목록 로드
    if (certSelect.value) {
      certSelect.dispatchEvent(new Event('change'))
    }

    // 폼 제출
    const form = this.container.querySelector('#quiz-form') as HTMLFormElement
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      this.handleFormSubmit()
    })
  }

  /**
   * 폼 제출 처리
   */
  private handleFormSubmit(): void {
    const certification = (this.container.querySelector('#certification') as HTMLSelectElement).value
    const subject = (this.container.querySelector('#subject') as HTMLSelectElement).value
    const order = (this.container.querySelector('#order') as HTMLSelectElement).value as QuizConfig['order']
    const mode = (this.container.querySelector('#mode') as HTMLSelectElement).value as QuizConfig['mode']
    const count = parseInt((this.container.querySelector('#count') as HTMLInputElement).value)

    if (!certification || !subject) {
      alert('자격증과 과목을 모두 선택해주세요.')
      return
    }

    if (count < 1 || count > 100) {
      alert('문제 개수는 1~100개 사이로 설정해주세요.')
      return
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
    const config: QuizConfig = {
      certification,
      subject,
      order,
      mode,
      count
    }

    this.onStartQuiz?.(config)
  }
}
