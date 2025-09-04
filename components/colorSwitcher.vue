<template>
  <UButton
    :icon="isDark ? 'i-lucide-sun' : 'i-lucide-moon'"
    color="neutral"
    variant="ghost"
    @click="toggleTheme"
    class="absolute border-1 dark:border-1 "
  >
  </UButton>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}

// initialize theme state when component mounts
onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark')
})
</script>
