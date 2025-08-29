<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-40 w-60 flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700',
        'transition-transform duration-300 ease-in-out',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0', // Ensure sidebar is always visible on large screens
      ]"
    >
      <div class="py-2 justify-center items-center text-center">
        <ULink class="text-4xl" to="/wishboard" active>Wishboard</ULink>
      </div>

      <!-- Close button visible only when sidebar is open on small screens -->
      <div class="absolute top-2 right-2 lg:hidden">
        <UButton
          icon="i-heroicons-x-mark"
          variant="ghost"
          @click="toggleSidebar"
          class="text-gray-500 dark:text-gray-400"
        />
      </div>

      <div class="flex-grow">
        <UNavigationMenu
          variant="pill"
          orientation="vertical"
          :items="sideLinks"
          class="p-5 w-60"
        />
        <ColorSwitcher class="sticky top-0"></ColorSwitcher>
      </div>

      <div class="">
        <UNavigationMenu
          variant="pill"
          orientation="vertical"
          :items="bottomLinks"
          class="p-5 w-full border-t-1"
        />
      </div>
    </aside>

    <!-- Main content area -->
    <div
      :class="[
        'flex-grow flex flex-col transition-all duration-300 ease-in-out',
        'lg:ml-60',
      ]"
    >
      <div
        class="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 lg:hidden flex items-center gap-4"
      >
        <UButton
          v-if="!isSidebarOpen"
          icon="i-heroicons-bars-3"
          variant="ghost"
          @click="toggleSidebar"
          class="text-gray-500 dark:text-gray-400"
        />
        <UBreadcrumb class="flex-grow" divider="/" :items="userLinks" />
      </div>

      <div
        class="hidden lg:flex py-5 pl-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 items-center"
      >
        <UBreadcrumb class="flex-grow" divider="/" :items="userLinks" />
      </div>

      <div class="flex-grow p-5 mt-2 overflow-y-auto">
        <slot />
      </div>
    </div>
  </div>
  <UModal v-model:open="open" title="Confirm Logout">
    <template #body>
      <div class="p-4">
        <div class="text-center">
          <UIcon
            name="i-lucide-triangle-alert"
            class="size-30 text-error-500 dark:text-error-400"
          />
          <p class="text-center text-xl mb-7">
            Are you sure you want to log out?
          </p>
        </div>
        <div class="mt-10 flex justify-end gap-2">
          <UButton color="neutral" variant="soft" @click="open = false">
            Cancel
          </UButton>
          <UButton color="error" variant="solid" @click="handleLogout">
            Logout
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const { data: sessionData, signOut, data: getSession } = useAuth();

import type { BreadcrumbItem, NavigationMenuItem } from "@nuxt/ui";
import { capitalize } from "vue";
import colors from 'tailwindcss/colors';

const route = useRoute();
const toast = useToast();

const open = ref(false);

function confirmLogout() {
  open.value = true;
}

const isSidebarOpen = ref(true);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const sideLinks = computed<NavigationMenuItem[]>(() => [
  {
    label: "Home",
    icon: "i-lucide-layout-dashboard",
    to: "/wishboard",
    active: route.path === "/wishboard" ? true : false,
  },
  {
    label: "History",
    icon: "i-lucide-history",
    to: "/history",
    active: route.path === "/history" ? true : false,
  },
]);

const headerLinks = computed<NavigationMenuItem[]>(() => [
  {
    label: "Wishboard",
    class: "text-4xl",
    // icon: "i-lucide-layout-dashboard",
    to: "/wishboard",
    active: route.path === "/wishboard" ? true : false,
  },
]);

const profileImagePreview = ref<string | null>(null);

const profileImageUrl = computed(() => {
  if (profileImagePreview.value) return profileImagePreview.value;
  if (getSession.value?.user?.profileImage) {
    return `http://localhost:5000/${getSession.value.user.profileImage.replace(/^\/+/, "")}`;
  }
  return "https://avatar.iran.liara.run/public/30";
});

const bottomLinks = computed<NavigationMenuItem[]>(() => {
  // Check if session data and user data exist
  const userName = sessionData.value?.user?.firstName || "Guest";

  return [
    {
      label: userName,
      type: "trigger",
      avatar: {
        src: profileImageUrl.value,
      },
      active: route.path === "/profile" ? true : false,
      children: [
        {
          label: "Profile",
          to: "/profile",
          icon: "i-lucide-circle-user",
          active: route.path === "/profile" ? true : false,
        },
        {
          label: "Logout",
          onClick: () => confirmLogout(),
          icon: "i-lucide-log-out",
          active: false,
          // class:
        },
      ],
    },
    {
      label: "Settings",
      icon: "i-lucide-settings",
      to: "/settings",
      active: route.path === "/settings" ? true : false,
    },
  ];
});

const userLinks = computed<BreadcrumbItem[]>(() => [
  {
    label: "Home",
    to: "/wishboard",
  },
  {
    label: capitalize(route.name!.toString()),
    to: route.path,
  },
]);

function handleLogout() {
  open.value = false;
  logoutButton();
}

function logoutButton() {
  try {
    signOut({ redirect: false });

    toast.add({
      title: "Logout Successful!",
      icon: "i-heroicons-check-circle",
      color: "success",
    });

    navigateTo("/auth/login");
  } catch (error) {
    console.error("Unexpected Error", error);
    toast.add({
      title: "Logout Failed",
      description: "An unexpected error occurred. Please try again.",
      icon: "i-heroicons-exclamation-circle",
      color: "error",
    });
  }
}
</script>

<style scoped></style>
