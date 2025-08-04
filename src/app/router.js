export class HashRouter {
  constructor() {
    this.listeners = []

    // 해시 변경 감지
    window.addEventListener('hashchange', () => {
      this.notifyListeners()
    })

    // 페이지 로드 시 초기 라우트 처리
    window.addEventListener('load', () => {
      this.notifyListeners()
    })
  }

  /**
   * 현재 라우트 파싱
   */
  getCurrentRoute() {
    const hash = window.location.hash.slice(1) // # 제거
    if (!hash) {
      return { path: '/', params: {} }
    }

    const [path, queryString] = hash.split('?')
    const params = {}

    if (queryString) {
      const urlParams = new URLSearchParams(queryString)
      for (const [key, value] of urlParams) {
        params[key] = decodeURIComponent(value)
      }
    }

    return { path: path || '/', params }
  }

  /**
   * 라우트 변경 리스너 등록
   */
  onRouteChange(listener) {
    this.listeners.push(listener)
  }

  /**
   * 프로그래밍 방식으로 라우트 변경
   */
  navigate(path, params) {
    let url = `#${path}`
    
    if (params && Object.keys(params).length > 0) {
      const queryString = new URLSearchParams()
      for (const [key, value] of Object.entries(params)) {
        queryString.set(key, encodeURIComponent(value))
      }
      url += `?${queryString.toString()}`
    }

    window.location.hash = url
  }

  /**
   * 퀴즈 페이지로 이동
   */
  navigateToQuiz(config) {
    const params = new URLSearchParams({
      cert: config.certification,
      subject: config.subject,
      order: config.order,
      mode: config.mode,
      count: config.count.toString()
    })
    
    this.navigate(`/quiz?${params.toString()}`)
  }

  /**
   * 결과 페이지로 이동
   */
  navigateToResults() {
    this.navigate('/results')
  }

  /**
   * 홈으로 이동
   */
  navigateToHome() {
    this.navigate('/')
  }

  /**
   * URL 파라미터에서 퀴즈 설정 파싱
   */
  parseQuizConfig(params) {
    const { cert, subject, order, mode, count } = params

    if (!cert || !subject || !order || !mode || !count) {
      return null
    }

    const parsedCount = parseInt(count)
    if (isNaN(parsedCount) || parsedCount < 1 || parsedCount > 100) {
      return null
    }

    if (!['sequential', 'random', 'randomRepeat'].includes(order)) {
      return null
    }

    if (!['practice', 'exam'].includes(mode)) {
      return null
    }

    return {
      certification: cert,
      subject: subject,
      order: order,
      mode: mode,
      count: parsedCount
    }
  }

  /**
   * 리스너들에게 라우트 변경 알림
   */
  notifyListeners() {
    const route = this.getCurrentRoute()
    console.log('라우트 변경:', route)
    this.listeners.forEach(listener => listener(route))
  }
}

/**
 * 전역 라우터 인스턴스
 */
export const router = new HashRouter()
