<!-- index.vue -->
<script setup lang="ts">
import type { FormError, FormErrorEvent, FormSubmitEvent } from "@nuxt/ui";
import { z } from "zod";

definePageMeta({
  layout: "blank",
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/wishboard",
  },
});

const show = ref(false);
const show2 = ref(false);
const password = ref("");
const confirmPassword = ref("");

// Schema for registration using Zod
const registerSchema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email("Invalid email address format"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long.")
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number." })
      .min(6, "Password must be at least 6 characters long."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

// Type for the registration schema
type RegisterSchema = z.output<typeof registerSchema>;

// Reactive state for the registration form
const registerState = reactive<Partial<RegisterSchema>>({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const isSubmitting = ref(false);
const { signUp } = useAuth();
const router = useRouter();
const toast = useToast();

async function onSubmit(event: FormSubmitEvent<RegisterSchema>) {
  try {
    const validatedData = registerSchema.parse(event.data);
    console.log("Validated data:", validatedData);

    const credentials = {
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      password: validatedData.password,
    };

    const status = await signUp(credentials, {
      redirect: false,
    });

    if (status?.ok) {
      toast.add({
        title: "Registration Successful!",
        icon: "i-heroicons-check-circle",
        color: "success",
      });
    }
    await navigateTo("/wishboard");
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
        title: "Registration Failed",
        description: "An unexpected error occurred. Please try again.",
        icon: "i-heroicons-exclamation-circle",
        color: "error",
      });
    }
  }
}

async function onError(event: FormErrorEvent) {
  try {
    // Handle form errors

    if (event?.errors?.[0]?.id) {
      const element = document.getElementById(event.errors[0].id);
      element?.focus();
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    console.error("Form submission error:", event.errors);

    toast.add({
      title: "Form Submission Error",
      description: "Please check the form for errors.",
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
        class="w-full max-w-md p-1 space-y-4 border-1 bg-gray-100 border-success-300 dark:border-success-400 dark:bg-gray-900"
        :shadow="true"
        :rounded="true"
      >
        <div class="w-full max-w-md p-6 space-y-4 border-0 px-10">
          <div class="text-center mb-4">
            <UIcon
              name="i-heroicons-pencil-square"
              size="5em"
              class="text-gray-900 dark:text-white hidden md:block mx-auto mb-3"
            />
          </div>
          <div class="text-center mb-7">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
              Create Account
            </h2>
          </div>
          <hr class="border-green-400 dark:border-green-400 mb-6" />

          <UForm
            :schema="registerSchema"
            :state="registerState"
            class="space-y-4"
            @submit="onSubmit"
            @error="onError"
          >
            <UFormField label="First Name" name="fname" required>
              <UInput
                v-model="registerState.firstName"
                type="text"
                placeholder="Enter your first name"
                icon="i-heroicons-user"
                size="lg"
                v-bind:class="{ 'min-w-full': true }"
              />
            </UFormField>

            <UFormField label="Last Name" name="lname" required>
              <UInput
                v-model="registerState.lastName"
                type="text"
                placeholder="Enter your last name"
                icon="i-heroicons-user"
                size="lg"
                v-bind:class="{ 'min-w-full': true }"
              />
            </UFormField>

            <UFormField label="Email" name="email" required>
              <UInput
                v-model="registerState.email"
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
                  v-model="registerState.password"
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

            <UFormField
              label="Confirm Password"
              name="confirmPassword"
              required
            >
              <UInput
                aria-label="confirmPassword"
                v-model="registerState.confirmPassword"
                :type="show2 ? 'text' : 'password'"
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
                    :icon="show2 ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                    :aria-label="show2 ? 'Hide password' : 'Show password'"
                    :aria-pressed="show2"
                    aria-controls="confirmPassword"
                    @click="show2 = !show2"
                  />
                </template>
              </UInput>
            </UFormField>

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
                Already have a Account? &nbsp;
              </p>
              <NuxtLink
                to="/auth/login"
                class="text-sm font-medium text-green-500 hover:text-green-800 underline"
              >
                Click Here.
              </NuxtLink>
            </div>
          </UForm>
        </div>
      </UCard>
    </UContainer>
  </div>
</template>

<style scoped></style>
