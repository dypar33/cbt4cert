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
      certification: config.certification,
      subject: typeof config.subject === 'string' ? config.subject : JSON.stringify(config.subject),
      order: config.order,
      mode: config.mode,
      count: config.count.toString()
    })
    
    // 선택된 챕터가 있는 경우 추가
    if (config.selectedChapters && config.selectedChapters.length > 0) {
      params.set('chapters', JSON.stringify(config.selectedChapters))
    }
    
    // 보기 순서 랜덤 설정 추가
    if (config.shuffleChoices) {
      params.set('shuffleChoices', 'true')
    }
    
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
    const { certification, subject, order, mode, count, chapters, shuffleChoices } = params

    if (!certification || !subject || !order || !mode || !count) {
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

    // 과목 데이터 파싱 (문자열 또는 JSON 객체)
    let parsedSubject
    try {
      parsedSubject = JSON.parse(subject)
    } catch (error) {
      // JSON 파싱 실패 시 문자열로 처리 (이전 버전 호환성)
      parsedSubject = subject
    }

    // 선택된 챕터 파싱
    let selectedChapters = null
    if (chapters) {
      try {
        selectedChapters = JSON.parse(chapters)
        if (!Array.isArray(selectedChapters)) {
          selectedChapters = null
        }
      } catch (error) {
        console.warn('챕터 파라미터 파싱 실패:', error)
        selectedChapters = null
      }
    }

    // 보기 순서 랜덤 설정 파싱
    const parsedShuffleChoices = shuffleChoices === 'true'

    return {
      certification,
      subject: parsedSubject,
      selectedChapters,
      order,
      mode,
      count: parsedCount,
      shuffleChoices: parsedShuffleChoices
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
