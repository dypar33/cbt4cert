import './styles/tokens.css'
import { App } from './app/App.js'
import { applySavedTheme } from './utils/storage.js'

// 앱 초기화
console.log('CBT4Cert 앱이 시작되었습니다.')

// 저장된 테마 적용
applySavedTheme()

// 앱 컨테이너
const appContainer = document.querySelector('#app')

// 앱 인스턴스 생성 및 초기화
const app = new App(appContainer)
app.initialize()
