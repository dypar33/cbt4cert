import type { Catalog, QuizRun, Question } from '../features/cbt/data/types.ts'
import { loadCatalog, loadQuestionBank } from '../features/cbt/data/loader.ts'
import { planQuestions, startRun, finishRun } from '../features/cbt/engine/quiz-engine.ts'
import { Home } from '../features/cbt/ui/Home.ts'
import { Results } from '../features/cbt/ui/Results.ts'
import { Runner } from '../features/cbt/ui/Runner.ts'
import { router, type Route } from './router.ts'
import { loadStorage, saveStorage } from '../utils/storage.ts'

export class App {
  private container: HTMLElement
  private catalog: Catalog | null = null
  private currentRun: QuizRun | null = null
  private currentQuestions: Question[] = []
  
  // UI 컴포넌트들
  private home: Home
  private results: Results
  private runner: Runner

  constructor(container: HTMLElement) {
    this.container = container
    this.home = new Home(container)
    this.results = new Results(container)
    this.runner = new Runner(container)
    
    // 라우터 설정
    router.onRouteChange((route) => this.handleRouteChange(route))
  }

  /**
   * 앱 초기화
   */
  async initialize(): Promise<void> {
    try {
      console.log('앱 초기화 중...')
      
      // 카탈로그 로드
      this.catalog = await loadCatalog()
      console.log('카탈로그 로드 완료')
      
      // 저장된 실행 상태 복원
      this.restoreState()
      
      // 초기 라우트 처리
      this.handleRouteChange(router.getCurrentRoute())
      
    } catch (error) {
      console.error('앱 초기화 실패:', error)
      this.showError('앱을 시작할 수 없습니다', error)
    }
  }

  /**
   * 라우트 변경 처리
   */
  private async handleRouteChange(route: Route): Promise<void> {
    console.log('라우트 변경:', route)

    try {
      switch (route.path) {
        case '/':
          this.showHome()
          break
          
        case '/quiz':
          await this.showQuiz(route.params)
          break
          
        case '/results':
          this.showResults()
          break
          
        default:
          console.warn('알 수 없는 라우트:', route.path)
          router.navigateToHome()
      }
    } catch (error) {
      console.error('라우트 처리 실패:', error)
      this.showError('페이지를 로드할 수 없습니다', error)
    }
  }

  /**
   * 홈 화면 표시
   */
  private showHome(): void {
    if (!this.catalog) {
      this.showError('카탈로그가 로드되지 않았습니다')
      return
    }

    this.home.render(this.catalog, (config) => {
      router.navigateToQuiz(config)
    })
  }

  /**
   * 퀴즈 화면 표시
   */
  private async showQuiz(params: Record<string, string>): Promise<void> {
    // URL에서 퀴즈 설정 파싱
    const config = router.parseQuizConfig(params)
    if (!config) {
      console.error('잘못된 퀴즈 설정:', params)
      router.navigateToHome()
      return
    }

    try {
      // 문제 은행 로드
      console.log('문제 은행 로딩 중...', config.certification, config.subject)
      const questions = await loadQuestionBank(config.certification, config.subject)
      
      if (questions.length === 0) {
        throw new Error('문제가 없습니다')
      }

      // 문제 계획 및 퀴즈 시작
      const questionIds = planQuestions(questions, config.order, config.count)
      this.currentRun = startRun(config, questionIds)
      this.currentQuestions = questions
      
      // 상태 저장
      this.saveState()
      
      console.log(`퀴즈 시작: ${questionIds.length}개 문제`)
      
      // 퀴즈 실행 화면 표시
      this.runner.render(
        this.currentQuestions,
        this.currentRun,
        () => {
          // 퀴즈 완료 시 최신 상태 복원 후 결과 화면으로 이동
          this.restoreState()
          router.navigateToResults()
        }
      )
      
    } catch (error) {
      console.error('퀴즈 시작 실패:', error)
      this.showError('퀴즈를 시작할 수 없습니다', error)
    }
  }

  /**
   * 결과 화면 표시
   */
  private showResults(): void {
    if (!this.currentRun || !this.currentQuestions.length) {
      console.warn('표시할 결과가 없습니다')
      router.navigateToHome()
      return
    }

    const result = finishRun(this.currentRun, this.currentQuestions)
    this.showResultsWithData(result)
  }

  /**
   * 결과 데이터와 함께 결과 화면 표시
   */
  private showResultsWithData(result: any): void {
    if (!this.currentRun) return
    
    this.results.render(
      result,
      this.currentQuestions,
      this.currentRun,
      () => {
        // 다시 풀기
        if (this.currentRun) {
          router.navigateToQuiz(this.currentRun.config)
        }
      },
      () => {
        // 홈으로
        this.clearState()
        router.navigateToHome()
      }
    )
  }

  /**
   * 오류 화면 표시
   */
  private showError(message: string, error?: any): void {
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류'
    
    this.container.innerHTML = `
      <div class="container" style="text-align: center; padding: var(--space-8);">
        <h1 style="color: var(--color-error); margin-bottom: var(--space-4);">
          오류 발생
        </h1>
        <p style="color: var(--color-text-secondary); margin-bottom: var(--space-2);">
          ${message}
        </p>
        <p style="color: var(--color-text-secondary); font-size: var(--font-size-sm); margin-bottom: var(--space-6);">
          ${errorMessage}
        </p>
        <div style="display: flex; gap: var(--space-4); justify-content: center;">
          <button class="btn btn-secondary" onclick="location.reload()">
            새로고침
          </button>
          <button class="btn btn-primary" id="home-btn">
            홈으로
          </button>
        </div>
      </div>
    `

    const homeBtn = this.container.querySelector('#home-btn')
    homeBtn?.addEventListener('click', () => {
      this.clearState()
      router.navigateToHome()
    })
  }

  /**
   * 상태 저장
   */
  private saveState(): void {
    const storage = loadStorage()
    storage.currentRun = this.currentRun || undefined
    saveStorage(storage)
  }

  /**
   * 상태 복원
   */
  private restoreState(): void {
    const storage = loadStorage()
    if (storage.currentRun) {
      this.currentRun = storage.currentRun
      console.log('저장된 퀴즈 상태 복원됨')
    }
  }

  /**
   * 상태 초기화
   */
  private clearState(): void {
    this.currentRun = null
    this.currentQuestions = []
    
    const storage = loadStorage()
    delete storage.currentRun
    saveStorage(storage)
  }
}
