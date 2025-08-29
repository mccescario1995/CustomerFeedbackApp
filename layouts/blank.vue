<script setup lang="ts">
import ColorSwitcher from "../components/colorSwitcher.vue";

// definePageMeta({
//   auth: {
//     unauthenticatedOnly: true,
//     navigateAuthenticatedTo: '/wishboard'
//   }
// })
</script>

<template>
  <div class="bg-gray-500/25">
    <UApp>
      <ColorSwitcher class="sticky top-[50%]"></ColorSwitcher>
      <UContainer>
        <div>
          <slot />
        </div>
      </UContainer>
    </UApp>
  </div>
</template>
