import type { AppStorage, AppPreferences } from '../features/cbt/data/types.ts'

const STORAGE_KEY = 'cbt4cert'

/**
 * 기본 설정값
 */
const defaultPreferences: AppPreferences = {
  darkMode: false
}

/**
 * localStorage에서 앱 데이터 로드
 */
export function loadStorage(): AppStorage {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return { preferences: defaultPreferences }
    }
    
    const parsed = JSON.parse(stored)
    return {
      preferences: { ...defaultPreferences, ...parsed.preferences },
      currentRun: parsed.currentRun
    }
  } catch (error) {
    console.warn('저장된 데이터 로드 실패, 기본값 사용:', error)
    return { preferences: defaultPreferences }
  }
}

/**
 * localStorage에 앱 데이터 저장
 */
export function saveStorage(storage: AppStorage): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage))
  } catch (error) {
    console.error('데이터 저장 실패:', error)
  }
}

/**
 * 설정만 업데이트
 */
export function updatePreferences(updates: Partial<AppPreferences>): void {
  const storage = loadStorage()
  storage.preferences = { ...storage.preferences, ...updates }
  saveStorage(storage)
}

/**
 * 다크 모드 토글
 */
export function toggleDarkMode(): boolean {
  const storage = loadStorage()
  const newDarkMode = !storage.preferences.darkMode
  
  updatePreferences({ darkMode: newDarkMode })
  
  // DOM 업데이트
  document.documentElement.setAttribute('data-theme', newDarkMode ? 'dark' : 'light')
  
  return newDarkMode
}

/**
 * 저장된 테마 적용
 */
export function applySavedTheme(): void {
  const storage = loadStorage()
  document.documentElement.setAttribute(
    'data-theme', 
    storage.preferences.darkMode ? 'dark' : 'light'
  )
}
