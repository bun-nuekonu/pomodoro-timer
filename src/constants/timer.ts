import type { TimerPhase } from '@/types/timer'

export interface PhaseDetails {
  label: string
  shortLabel: string
  durationSeconds: number
}

export const PHASES: Record<TimerPhase, PhaseDetails> = {
  focus: {
    label: '作業時間',
    shortLabel: '作業',
    durationSeconds: 25 * 60,
  },
  shortBreak: {
    label: '短い休憩',
    shortLabel: '休憩',
    durationSeconds: 5 * 60,
  },
  longBreak: {
    label: '長い休憩',
    shortLabel: '長い休憩',
    durationSeconds: 15 * 60,
  },
}

export const FOCUS_SESSIONS_PER_CYCLE = 4
