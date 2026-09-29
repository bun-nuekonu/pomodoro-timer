import { computed, onMounted, onUnmounted, ref } from 'vue'
import { FOCUS_SESSIONS_PER_CYCLE, PHASES } from '@/constants/timer'
import type { TimerPhase, TimerStatus } from '@/types/timer'

const toMilliseconds = (seconds: number) => seconds * 1000

export function usePomodoroTimer() {
  const phase = ref<TimerPhase>('focus')
  const status = ref<TimerStatus>('idle')
  const completedFocusSessions = ref(0)
  const remainingMilliseconds = ref(toMilliseconds(PHASES.focus.durationSeconds))
  const deadline = ref<number | null>(null)

  let intervalId: number | undefined

  const durationMilliseconds = computed(() => toMilliseconds(PHASES[phase.value].durationSeconds))
  const remainingSeconds = computed(() => Math.ceil(remainingMilliseconds.value / 1000))
  const progress = computed(() => {
    if (durationMilliseconds.value === 0) return 0
    return Math.min(1, Math.max(0, remainingMilliseconds.value / durationMilliseconds.value))
  })

  const focusSessionNumber = computed(() => {
    if (phase.value === 'longBreak') return FOCUS_SESSIONS_PER_CYCLE

    const positionInCycle = completedFocusSessions.value % FOCUS_SESSIONS_PER_CYCLE
    if (phase.value === 'focus') {
      if (status.value === 'complete') {
        return positionInCycle === 0 ? FOCUS_SESSIONS_PER_CYCLE : positionInCycle
      }
      return positionInCycle + 1
    }

    return positionInCycle === 0 ? FOCUS_SESSIONS_PER_CYCLE : positionInCycle
  })

  const nextPhase = computed<TimerPhase>(() => {
    if (phase.value !== 'focus') return 'focus'

    const nextFocusCount = completedFocusSessions.value + (status.value === 'complete' ? 0 : 1)
    return nextFocusCount % FOCUS_SESSIONS_PER_CYCLE === 0 ? 'longBreak' : 'shortBreak'
  })

  const nextPhaseDetails = computed(() => PHASES[nextPhase.value])

  function clearIntervalIfNeeded() {
    if (intervalId !== undefined) {
      window.clearInterval(intervalId)
      intervalId = undefined
    }
  }

  function finishPhase() {
    clearIntervalIfNeeded()
    deadline.value = null
    remainingMilliseconds.value = 0
    status.value = 'complete'

    if (phase.value === 'focus') completedFocusSessions.value += 1
  }

  function updateRemainingTime() {
    if (status.value !== 'running' || deadline.value === null) return

    const millisecondsLeft = Math.max(0, deadline.value - Date.now())
    remainingMilliseconds.value = millisecondsLeft

    if (millisecondsLeft === 0) finishPhase()
  }

  function startInterval() {
    clearIntervalIfNeeded()
    intervalId = window.setInterval(updateRemainingTime, 250)
    updateRemainingTime()
  }

  function start() {
    if (status.value === 'complete') {
      phase.value = nextPhase.value
      remainingMilliseconds.value = durationMilliseconds.value
      status.value = 'idle'
    }

    deadline.value = Date.now() + remainingMilliseconds.value
    status.value = 'running'
    startInterval()
  }

  function pause() {
    updateRemainingTime()
    if (status.value !== 'running') return

    clearIntervalIfNeeded()
    deadline.value = null
    status.value = 'paused'
  }

  function restart() {
    clearIntervalIfNeeded()

    // A completed focus session is counted at the finish screen. Undo that count
    // when the user chooses to restart the same session.
    if (status.value === 'complete' && phase.value === 'focus') {
      completedFocusSessions.value = Math.max(0, completedFocusSessions.value - 1)
    }

    deadline.value = null
    remainingMilliseconds.value = durationMilliseconds.value
    status.value = 'idle'
  }

  function syncWhenVisible() {
    if (document.visibilityState === 'visible') updateRemainingTime()
  }

  onMounted(() => document.addEventListener('visibilitychange', syncWhenVisible))
  onUnmounted(() => {
    document.removeEventListener('visibilitychange', syncWhenVisible)
    clearIntervalIfNeeded()
  })

  return {
    phase,
    status,
    remainingSeconds,
    progress,
    focusSessionNumber,
    nextPhase,
    nextPhaseDetails,
    start,
    pause,
    restart,
  }
}
