<!-- layouts/default.vue -->
<template>
  <div class="flex border-1">
    <ColorSwitcher class="sticky top-[50%]" />
    <div class="">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
// No script needed unless you want logic
</script>
