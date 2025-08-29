<template>
  <div v-if="!colorMode?.forced" class="relative">
    <UButton
      :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
      color="neutral"
      variant="ghost"
      @click="isDark = !isDark"
      class="absolute left-25 border-1 dark:border-1 mr-3"
    />
  </div>
</template>

<script setup lang="ts">
import { useColorMode } from '@nuxt/ui/runtime/vue/stubs.js';
import { computed } from 'vue';

const colorMode = useColorMode();

const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(_isDark) {
    colorMode.preference = _isDark ? "dark" : "light";
  },
});
</script>

<style scoped></style>
