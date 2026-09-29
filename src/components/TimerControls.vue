<script setup lang="ts">
import type { TimerStatus } from '@/types/timer'

defineProps<{ status: TimerStatus }>()

const emit = defineEmits<{
  start: []
  pause: []
  restart: []
}>()
</script>

<template>
  <div class="timer-controls" aria-label="タイマー操作">
    <button class="control-button control-button--restart" type="button" aria-label="現在の区間を最初からやり直す" @click="emit('restart')">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4.5 11a7.5 7.5 0 1 1 2.2 5.3M4.5 5.5V11H10" />
      </svg>
    </button>

    <button
      v-if="status === 'running'"
      class="control-button control-button--primary"
      type="button"
      aria-label="一時停止"
      @click="emit('pause')"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 5.5v13M15 5.5v13" />
      </svg>
      <span>一時停止</span>
    </button>
    <button v-else class="control-button control-button--primary" type="button" @click="emit('start')">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m8 5.5 11 6.5-11 6.5z" />
      </svg>
      <span>{{ status === 'complete' ? '次の区間を開始' : status === 'paused' ? '再開' : '開始' }}</span>
    </button>
  </div>
</template>

<style scoped>
.timer-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
}

.control-button {
  display: inline-flex;
  min-height: 58px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px solid transparent;
  border-radius: 999px;
  color: var(--color-text);
  font: inherit;
  font-size: 0.98rem;
  font-weight: 650;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: transform 120ms ease, background 160ms ease, border-color 160ms ease;
}

.control-button:active {
  transform: scale(0.97);
}

.control-button:focus-visible {
  outline: 2px solid var(--color-text);
  outline-offset: 4px;
}

.control-button svg {
  width: 21px;
  height: 21px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.control-button--restart {
  width: 58px;
  flex: 0 0 auto;
  border-color: #2b3039;
  background: #151920;
  color: #e9edf5;
}

.control-button--restart svg {
  width: 20px;
  height: 20px;
}

.control-button--primary {
  min-width: 190px;
  padding: 0 27px;
  background: var(--phase-color, var(--color-focus));
  color: #0b0d11;
}

.control-button--primary:hover {
  filter: brightness(1.08);
}

@media (max-width: 360px) {
  .control-button--primary {
    min-width: 166px;
  }
}
</style>
