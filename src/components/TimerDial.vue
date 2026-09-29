<script setup lang="ts">
import { computed } from 'vue'
import type { TimerPhase, TimerStatus } from '@/types/timer'

const props = defineProps<{
  phase: TimerPhase
  phaseLabel: string
  status: TimerStatus
  time: string
  progress: number
}>()

const circumference = 2 * Math.PI * 118
const dashOffset = computed(() => circumference * (1 - props.progress))
const phaseClass = computed(() => `timer-dial--${props.phase}`)
</script>

<template>
  <div class="timer-dial" :class="phaseClass" role="timer" :aria-label="`${phaseLabel}、残り ${time}`">
    <svg class="timer-dial__svg" viewBox="0 0 280 280" aria-hidden="true">
      <circle class="timer-dial__track" cx="140" cy="140" r="118" />
      <circle
        class="timer-dial__progress"
        cx="140"
        cy="140"
        r="118"
        :style="{ strokeDasharray: circumference, strokeDashoffset: dashOffset }"
      />
    </svg>

    <div class="timer-dial__content">
      <span class="timer-dial__phase">{{ phaseLabel }}</span>
      <span class="timer-dial__time" aria-live="off">{{ time }}</span>
      <span class="timer-dial__status">
        <span class="timer-dial__status-dot" />
        {{ status === 'running' ? '計測中' : status === 'paused' ? '一時停止中' : status === 'complete' ? '時間です' : 'スタンバイ' }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.timer-dial {
  --phase-color: var(--color-focus);
  position: relative;
  width: min(74vw, 326px);
  aspect-ratio: 1;
  flex: 0 0 auto;
  color: var(--phase-color);
  filter: drop-shadow(0 0 35px color-mix(in srgb, var(--phase-color) 13%, transparent));
}

.timer-dial--shortBreak,
.timer-dial--longBreak {
  --phase-color: var(--color-break);
}

.timer-dial__svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
  overflow: visible;
}

.timer-dial__track,
.timer-dial__progress {
  fill: none;
  stroke-width: 5;
}

.timer-dial__track {
  stroke: #252a33;
}

.timer-dial__progress {
  stroke: var(--phase-color);
  stroke-linecap: round;
  transition: stroke-dashoffset 250ms linear, stroke 200ms ease;
}

.timer-dial__content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--color-text);
}

.timer-dial__phase {
  margin-bottom: 5px;
  color: var(--phase-color);
  font-size: 0.77rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.timer-dial__time {
  font-size: clamp(3.65rem, 17vw, 5.35rem);
  font-weight: 550;
  letter-spacing: -0.075em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.timer-dial__status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  color: var(--color-muted);
  font-size: 0.8rem;
  letter-spacing: 0.04em;
}

.timer-dial__status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.timer-dial--focus .timer-dial__status-dot {
  color: var(--color-focus);
}

.timer-dial--shortBreak .timer-dial__status-dot,
.timer-dial--longBreak .timer-dial__status-dot {
  color: var(--color-break);
}

@media (orientation: landscape) and (max-height: 600px) {
  .timer-dial {
    width: min(62vh, 286px);
  }
}
</style>
