// CBT 시스템의 핵심 타입 정의

export interface Question {
  id: string
  question: string
  description?: string
  type?: 'mcq' | 'short'
  choices?: string[]
  answer: string[]
  explanation?: string
  tags?: string[]
}

export interface Certification {
  name: string
  subjects: string[]
}

export interface Catalog {
  certifications: Certification[]
}

export interface QuizConfig {
  certification: string
  subject: string
  order: 'sequential' | 'random' | 'randomRepeat'
  mode: 'exam' | 'practice'
  count: number
}

export interface QuizRun {
  id: string
  config: QuizConfig
  questionIds: string[]
  currentIndex: number
  answers: Record<string, string[]>
  startTime: number
  endTime?: number
}

export interface QuizResult {
  score: number
  total: number
  correct: number
  wrong: string[]
  timeSpent: number
}

export interface ImmediateFeedback {
  correct: boolean
  expected: string[]
  explanation?: string
}

// 저장소 타입
export interface AppPreferences {
  darkMode: boolean
  lastCertification?: string
  lastSubject?: string
  lastOrder?: QuizConfig['order']
  lastMode?: QuizConfig['mode']
  lastCount?: number
}

export interface AppStorage {
  preferences: AppPreferences
  currentRun?: QuizRun
  currentIndex?: number
}
