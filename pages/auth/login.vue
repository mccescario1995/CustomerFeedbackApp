<!-- index.vue -->
<script setup lang="ts">
import type { FormErrorEvent, FormSubmitEvent } from "@nuxt/ui";
import { z } from "zod";
import { useRouter } from "vue-router";

definePageMeta({
  layout: "blank",
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/",
  },
});

const show = ref(false);
const password = ref("");

// Schema for login using Zod
const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .min(1, "Email is required")
    .refine(
      async (email) => {
        try {
          const res = await $fetch<{ exists: boolean }>(
            `http://localhost:5243/api/Auth/check-email?email=${email}`
          );
          return res.exists;
        } catch (err) {
          return false;
        }
      },
      {
        message: "Email is not registered",
      }
    ),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters long")
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
});

// Type for the login schema
type LoginSchema = z.output<typeof loginSchema>;

const loginState = reactive<Partial<LoginSchema>>({
  email: "",
  password: "",
});

const isSubmitting = ref(false);
const { signIn } = useAuth();
const router = useRouter();
const toast = useToast();

// Handle form submission
async function onSubmit(event: FormSubmitEvent<LoginSchema>) {
  isSubmitting.value = true;
  try {
    // Use async parsing because of async refine
    const validatedData = await loginSchema.parseAsync(event.data);
    console.log("Validated data:", validatedData);

    const credentials = {
      username: validatedData.email,
      password: validatedData.password,
    };

    const status = await signIn(credentials, {
      redirect: false,
    });

    if (status?.ok) {
      toast.add({
        title: "Login Successful!",
        description: "You have been logged in.",
        icon: "i-heroicons-check-circle",
        color: "success",
      });
    }

    // await navigateTo("/");
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation errors:", error.errors);
      error.errors.forEach((err) => {
        toast.add({
          title: "Validation Error",
          description: err.message,
          icon: "i-heroicons-exclamation-circle",
          color: "error",
        });
      });
    } else {
      console.error("Unexpected error:", error);
      toast.add({
        title: "Login Failed",
        description: "An unexpected error occurred. Please try again.",
        icon: "i-heroicons-exclamation-circle",
        color: "error",
      });
    }
  } finally {
    isSubmitting.value = false;
  }
}

async function onError(event: FormErrorEvent) {
  try {
    if (event?.errors?.[0]?.id) {
      const element = document.getElementById(event.errors[0].id);
      element?.focus();
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    console.error("Login submission error:", event.errors);

    toast.add({
      title: "Login Submission Error",
      description: "Please check the Login for errors.",
      icon: "i-heroicons-exclamation-circle",
      color: "error",
    });
  } catch (error) {
    console.error("Error handling form submission error:", error);
  }

  console.error("Form submission error:", event.errors);
}
</script>

<template>
  <div>
    <UContainer class="flex items-center justify-center min-h-screen">
      <UCard
        class="w-full max-w-md p-2 space-y-4 px-2 bg-gray-100 dark:bg-gray-900"
        :shadow="true"
        :rounded="true"
      >
        <div class="w-full max-w-md p-6 space-y-4 border-0 px-10">
          <div class="text-center mb-4">
            <UIcon
              name="i-heroicons-user-circle"
              size="5em"
              class="text-gray-900 dark:text-white hidden md:block mx-auto mb-3"
            />
          </div>
          <div class="text-center mb-7">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
              Sign In
            </h2>
          </div>
          <hr class="border-green-400 dark:border-green-400 mb-6" />
          <UForm
            :schema="loginSchema"
            :state="loginState"
            class="space-y-4"
            @submit="onSubmit"
            @error="onError"
          >
            <UFormField label="Email" name="email" required>
              <UInput
                v-model="loginState.email"
                type="email"
                placeholder="sample@email.com"
                icon="i-heroicons-envelope"
                size="lg"
                v-bind:class="{ 'min-w-full': true }"
              />
            </UFormField>

            <UTooltip
              text="Password must contain at least one uppercase letter, one lowercase letter, one number, and be at least 6 characters long."
            >
              <UFormField label="Password" name="password" required>
                <UInput
                  aria-label="Password"
                  v-model="loginState.password"
                  :type="show ? 'text' : 'password'"
                  placeholder="••••••••"
                  icon="i-heroicons-lock-closed"
                  size="lg"
                  :ui="{ trailing: 'pe-1' }"
                  v-bind:class="{ 'min-w-full': true }"
                >
                  <template #trailing>
                    <UButton
                      color="neutral"
                      variant="link"
                      size="sm"
                      :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                      :aria-label="show ? 'Hide password' : 'Show password'"
                      :aria-pressed="show"
                      aria-controls="password"
                      @click="show = !show"
                    />
                  </template>
                </UInput>
              </UFormField>
            </UTooltip>

            <div class="flex items-center justify-end">
              
              <NuxtLink
                to="/auth/login"
                class="text-sm font-medium text-primary-500 hover:text-primary-600 underline"
              >
                Forgot password?
              </NuxtLink>
            </div>

            <UButton
              type="submit"
              block
              size="lg"
              :loading="isSubmitting"
              :disabled="isSubmitting"
              label="Sign in"
              icon="i-heroicons-arrow-right-on-rectangle"
            />

            <div class="flex items-center justify-center">
              <p class="text-sm font-medium text-nuetral-500">
                Don't have an account? &nbsp;
              </p>
              <NuxtLink
                to="/auth/register"
                class="text-sm font-medium text-primary-500 hover:text-primary-600 underline"
              >
                Click here
              </NuxtLink>
            </div>
            <!-- <ColorSwitcher class="flex justify-center"></ColorSwitcher> -->
          </UForm>
        </div>
      </UCard>
    </UContainer>
  </div>
</template>

<style scoped></style>
