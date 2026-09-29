<script setup lang="ts">
import { computed } from 'vue'
import SessionProgress from '@/components/SessionProgress.vue'
import TimerControls from '@/components/TimerControls.vue'
import TimerDial from '@/components/TimerDial.vue'
import { usePomodoroTimer } from '@/composables/usePomodoroTimer'
import { FOCUS_SESSIONS_PER_CYCLE, PHASES } from '@/constants/timer'
import { formatTime } from '@/utils/formatTime'

const {
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
} = usePomodoroTimer()

const phaseDetails = computed(() => PHASES[phase.value])
const timerText = computed(() => formatTime(remainingSeconds.value))
const phaseClass = computed(() => (phase.value === 'focus' ? 'pomodoro-app--focus' : 'pomodoro-app--break'))
const heading = computed(() => {
  if (status.value === 'complete') return 'いい区切りです。'
  if (phase.value === 'focus') return '目の前のことに、集中しよう。'
  return '少し休んで、リフレッシュ。'
})
const supportingText = computed(() => {
  if (status.value === 'complete') return '準備ができたらボタンを押して、次の区間を始めましょう。'
  if (phase.value === 'focus') return 'ひとつのことに集中する時間です。'
  return '画面から目を離して、ひと息つきましょう。'
})
const nextPhaseName = computed(() => {
  if (status.value === 'complete') return nextPhaseDetails.value.label
  return PHASES[nextPhase.value].label
})
const nextPhaseDuration = computed(() => {
  if (status.value === 'complete') return nextPhaseDetails.value.durationSeconds
  return PHASES[nextPhase.value].durationSeconds
})
</script>

<template>
  <div class="pomodoro-app" :class="phaseClass">
    <div class="app-frame">
      <header class="topbar">
        <a class="brand" href="#top" aria-label="Tempo ホーム">
          <svg class="brand__mark" viewBox="0 0 36 36" aria-hidden="true">
            <circle cx="18" cy="18" r="14" />
            <path d="M18 9v9l6 4" />
            <path class="brand__accent" d="M18 4a14 14 0 0 1 14 14" />
          </svg>
          <span>tempo<span class="brand__period">.</span></span>
        </a>
        <span class="topbar__caption">POMODORO TIMER</span>
      </header>

      <main id="top" class="timer-layout">
        <section class="timer-stage" aria-label="現在のタイマー">
          <div class="timer-stage__heading">
            <span class="eyebrow">YOUR FOCUS SESSION</span>
            <h1>{{ phaseDetails.label }}</h1>
          </div>

          <TimerDial
            :phase="phase"
            :phase-label="phaseDetails.shortLabel"
            :status="status"
            :time="timerText"
            :progress="progress"
          />

          <SessionProgress
            :current-session="focusSessionNumber"
            :total-sessions="FOCUS_SESSIONS_PER_CYCLE"
          />
        </section>

        <section class="control-panel" aria-label="タイマー設定と操作">
          <div class="control-panel__intro">
            <div class="phase-indicator">
              <span class="phase-indicator__dot" />
              <span>{{ status === 'complete' ? '区間終了' : status === 'running' ? '進行中' : status === 'paused' ? '一時停止中' : '準備完了' }}</span>
            </div>
            <h2>{{ heading }}</h2>
            <p>{{ supportingText }}</p>
          </div>

          <TimerControls :status="status" @start="start" @pause="pause" @restart="restart" />

          <div class="up-next">
            <div class="up-next__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </div>
            <div class="up-next__text">
              <span class="up-next__label">次の区間</span>
              <strong>{{ nextPhaseName }}</strong>
            </div>
            <span class="up-next__duration">{{ Math.floor(nextPhaseDuration / 60) }}分</span>
          </div>

          <p class="control-panel__hint">
            <svg viewBox="0 0 18 18" aria-hidden="true">
              <path d="M9 2.5 15 5v4.2c0 3.4-2.1 5.3-6 6.8-3.9-1.5-6-3.4-6-6.8V5l6-2.5Z" />
              <path d="m6.5 8.8 1.7 1.7 3.4-3.4" />
            </svg>
            アプリを開いたままにすると、時間が正確に進みます
          </p>
        </section>
      </main>

      <footer class="app-footer">
        <span>ひと区切りずつ、いいリズムで。</span>
        <span class="app-footer__version">FOCUS · REST · REPEAT</span>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.pomodoro-app {
  --phase-color: var(--color-focus);
  min-height: 100vh;
  min-height: 100svh;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 18% 48%, rgb(36 78 137 / 10%), transparent 34%),
    radial-gradient(ellipse at 82% 55%, rgb(39 52 32 / 7%), transparent 31%),
    var(--color-background);
  transition: background-color 250ms ease;
}

.pomodoro-app--break {
  --phase-color: var(--color-break);
  background:
    radial-gradient(ellipse at 18% 48%, rgb(36 78 137 / 5%), transparent 34%),
    radial-gradient(ellipse at 82% 55%, rgb(100 139 39 / 10%), transparent 31%),
    var(--color-background);
}

.app-frame {
  display: flex;
  width: min(100%, 1180px);
  min-height: 100vh;
  min-height: 100svh;
  flex-direction: column;
  margin: 0 auto;
  padding: max(18px, env(safe-area-inset-top)) max(22px, env(safe-area-inset-right)) max(16px, env(safe-area-inset-bottom)) max(22px, env(safe-area-inset-left));
}

.topbar {
  display: flex;
  height: 54px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgb(255 255 255 / 6%);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: var(--color-text);
  font-size: 1.2rem;
  font-weight: 750;
  letter-spacing: -0.055em;
  text-decoration: none;
}

.brand__mark {
  width: 26px;
  height: 26px;
  fill: none;
  stroke: #d9e0ea;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.7;
}

.brand__mark .brand__accent {
  stroke: var(--phase-color);
  stroke-width: 2.6;
  transition: stroke 200ms ease;
}

.brand__period {
  color: var(--phase-color);
}

.topbar__caption,
.eyebrow {
  color: #626b79;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.19em;
}

.timer-layout {
  display: grid;
  flex: 1 0 auto;
  grid-template-columns: minmax(0, 1.1fr) minmax(300px, 0.9fr);
  align-items: center;
  gap: clamp(28px, 7vw, 92px);
  padding: 28px 6.4% 24px;
}

.timer-stage {
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 23px;
}

.timer-stage__heading {
  text-align: center;
}

.timer-stage__heading h1 {
  margin: 8px 0 0;
  color: #e9edf5;
  font-size: 1.2rem;
  font-weight: 550;
  letter-spacing: 0.02em;
}

.control-panel {
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: stretch;
  gap: 28px;
  padding: clamp(24px, 4vw, 42px);
  border: 1px solid rgb(255 255 255 / 6%);
  border-radius: 24px;
  background: linear-gradient(145deg, rgb(20 24 31 / 95%), rgb(15 18 24 / 94%));
  box-shadow: 0 26px 80px rgb(0 0 0 / 20%), inset 0 1px rgb(255 255 255 / 2%);
}

.control-panel__intro {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.phase-indicator {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--phase-color);
  font-size: 0.74rem;
  font-weight: 650;
  letter-spacing: 0.05em;
}

.phase-indicator__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 12px color-mix(in srgb, var(--phase-color) 55%, transparent);
}

.control-panel__intro h2 {
  margin: 19px 0 8px;
  color: var(--color-text);
  font-size: clamp(1.45rem, 3vw, 1.85rem);
  font-weight: 570;
  letter-spacing: -0.045em;
  line-height: 1.3;
}

.control-panel__intro p {
  max-width: 330px;
  margin: 0;
  color: var(--color-muted);
  font-size: 0.92rem;
  line-height: 1.8;
}

.up-next {
  display: flex;
  min-height: 64px;
  align-items: center;
  gap: 13px;
  padding: 0 14px;
  border: 1px solid rgb(255 255 255 / 5%);
  border-radius: 14px;
  background: rgb(255 255 255 / 2%);
}

.up-next__icon {
  display: grid;
  width: 34px;
  height: 34px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 10px;
  background: color-mix(in srgb, var(--phase-color) 11%, transparent);
  color: var(--phase-color);
}

.up-next__icon svg {
  width: 17px;
  height: 17px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.6;
}

.up-next__text {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 3px;
}

.up-next__label {
  color: #77808d;
  font-size: 0.67rem;
}

.up-next__text strong {
  overflow: hidden;
  color: #edf0f5;
  font-size: 0.84rem;
  font-weight: 570;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.up-next__duration {
  color: #a4acb9;
  font-size: 0.78rem;
  font-variant-numeric: tabular-nums;
}

.control-panel__hint {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: -10px 0 0;
  color: #68717f;
  font-size: 0.68rem;
  line-height: 1.6;
}

.control-panel__hint svg {
  width: 16px;
  height: 16px;
  flex: 0 0 auto;
  fill: none;
  stroke: var(--phase-color);
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.4;
  opacity: 0.75;
}

.app-footer {
  display: flex;
  min-height: 34px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgb(255 255 255 / 6%);
  color: #5f6875;
  font-size: 0.68rem;
}

.app-footer__version {
  font-size: 0.58rem;
  letter-spacing: 0.15em;
}

@media (orientation: portrait) {
  .timer-layout {
    grid-template-columns: minmax(0, 1fr);
    align-content: center;
    gap: clamp(24px, 4vh, 36px);
    padding: 26px 5% 34px;
  }

  .timer-stage {
    gap: 18px;
  }

  .control-panel {
    width: min(100%, 500px);
    justify-self: center;
    gap: 21px;
    padding: clamp(20px, 5vw, 29px);
  }

  .control-panel__intro h2 {
    margin-top: 12px;
  }
}

@media (max-width: 380px) and (orientation: portrait) {
  .app-frame {
    padding-right: max(16px, env(safe-area-inset-right));
    padding-left: max(16px, env(safe-area-inset-left));
  }

  .timer-layout {
    gap: 21px;
    padding-right: 0;
    padding-left: 0;
  }

  .timer-stage {
    gap: 12px;
  }

  .control-panel {
    gap: 17px;
    padding: 19px;
  }

  .control-panel__intro h2 {
    font-size: 1.42rem;
  }
}

@media (orientation: landscape) and (max-height: 600px) {
  .app-frame {
    padding-top: max(8px, env(safe-area-inset-top));
    padding-bottom: max(8px, env(safe-area-inset-bottom));
  }

  .topbar {
    height: 39px;
  }

  .brand {
    font-size: 1rem;
  }

  .brand__mark {
    width: 22px;
    height: 22px;
  }

  .timer-layout {
    grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr);
    gap: clamp(25px, 7vw, 76px);
    padding: 10px 7% 12px;
  }

  .timer-stage {
    gap: 10px;
  }

  .timer-stage__heading h1 {
    margin-top: 4px;
    font-size: 1rem;
  }

  .eyebrow {
    font-size: 0.56rem;
  }

  .control-panel {
    gap: 14px;
    padding: 18px 23px;
    border-radius: 18px;
  }

  .control-panel__intro h2 {
    margin: 9px 0 4px;
    font-size: 1.24rem;
  }

  .control-panel__intro p {
    font-size: 0.77rem;
  }

  .control-button {
    min-height: 48px;
  }

  .control-button--restart {
    width: 48px;
  }

  .control-button--primary {
    min-width: 160px;
  }

  .up-next {
    min-height: 52px;
  }

  .control-panel__hint {
    margin-top: -4px;
  }

  .app-footer {
    min-height: 23px;
    font-size: 0.6rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
