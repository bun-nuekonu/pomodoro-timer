<script setup lang="ts">
defineProps<{
  currentSession: number
  totalSessions: number
}>()
</script>

<template>
  <div class="session-progress" :aria-label="`4回の作業セッションのうち${currentSession}回目`">
    <div class="session-progress__dots" aria-hidden="true">
      <span
        v-for="session in totalSessions"
        :key="session"
        class="session-progress__dot"
        :class="{ 'session-progress__dot--active': session <= currentSession }"
      />
    </div>
    <span class="session-progress__label">サイクル <strong>{{ String(currentSession).padStart(2, '0') }}</strong> / {{ String(totalSessions).padStart(2, '0') }}</span>
  </div>
</template>

<style scoped>
.session-progress {
  display: flex;
  align-items: center;
  gap: 13px;
  color: var(--color-muted);
  font-size: 0.76rem;
  letter-spacing: 0.08em;
}

.session-progress__dots {
  display: flex;
  gap: 6px;
}

.session-progress__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #353a44;
  transition: background 200ms ease, box-shadow 200ms ease;
}

.session-progress__dot--active {
  background: var(--phase-color, var(--color-focus));
  box-shadow: 0 0 9px color-mix(in srgb, var(--phase-color, var(--color-focus)) 55%, transparent);
}

.session-progress__label strong {
  color: #f4f6fa;
  font-weight: 650;
}
</style>
