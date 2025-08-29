<template>
  <div class="flex">
    
    <UNavigationMenu
      variant="pill"
      orientation="vertical"
      :items="links"
      class="w-60 flex-shrink-0"
    />

    <div class="flex-grow">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { UNavigationMenu } from '../.nuxt/components';

const route = useRoute();
const toast = useToast();

const open = ref(false);

const links = computed<NavigationMenuItem[]>(() =>[
  {
    label: "Navigation",
    type: "label",
  },
  {
    label: "Wishboard",
    icon: "i-lucide-layout-dashboard",
    to: "/wishboard",
    active: route.path === "/wishboard" ? true : false,
  },
  {
    label: "Settings",
    icon: "i-lucide-settings",
    to: "/settings",
    active: route.path === "/settings" ? true : false,
  },
]);
</script>

<style scoped></style>
