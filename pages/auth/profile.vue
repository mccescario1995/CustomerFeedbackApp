<script setup lang="ts">
import type { FormErrorEvent, FormSubmitEvent } from "@nuxt/ui";
import { z } from "zod";

const { data: getSession, token: authToken } = useAuth<SessionUser>();
const toast = useToast();

const BASE_URL = "http://localhost:5243/api/Profile";

definePageMeta({
  // layout: "wishlist",
    auth: {
    unauthenticatedOnly: false,
    navigateUnauthenticatedTo: '/auth/login'
  }
});

const reloadCountdown = ref(5);

const show = ref(false);
const show2 = ref(false);
const show3 = ref(false);
const isSubmitting = ref(false);
const isImageSubmitting = ref(false);

// Constants
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

// Schemas
const imageSchema = z.object({
  profileImage: z
    .instanceof(File)
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      `The image is too large. Please choose an image smaller than ${formatBytes(
        MAX_FILE_SIZE
      )}.`
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Please upload a valid image file (JPEG, PNG)."
    ),
});

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
});

const passwordSchema = z
  .object({
    currentPassword: z.string(),
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long.")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter.")
      .regex(/[a-z]/, "Must contain at least one lowercase letter.")
      .regex(/[0-9]/, "Must contain at least one number."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type ImageSchema = z.infer<typeof imageSchema>;
type ProfileSchema = z.infer<typeof profileSchema>;
type PasswordSchema = z.infer<typeof passwordSchema>;

// State
const imageState = reactive<Partial<ImageSchema>>({
  profileImage: undefined,
});

const profileState = reactive<Partial<ProfileSchema>>({
  firstName: "",
  lastName: "",
  email: "",
});

const passwordState = reactive<Partial<PasswordSchema>>({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

// Image preview
const profileImagePreview = ref<string | null>(null);
const originalImagePreview = ref<string | null>(null);

const profileImageUrl = computed(() => {
  if (profileImagePreview.value) return profileImagePreview.value;
  if (getSession.value?.user?.profileImage) {
    return `http://localhost:5243${getSession.value?.user?.profileImage}`;
  }
  return "https://avatar.iran.liara.run/public/30";
});

const fileInput = ref<HTMLInputElement | null>(null);

function openFilePicker() {
  fileInput.value?.click();
}

function handleImageChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0] || undefined;

  if (file) {
    if (!originalImagePreview.value && !profileImagePreview.value) {
      originalImagePreview.value = "https://avatar.iran.liara.run/public/30";
    } else if (!originalImagePreview.value) {
      originalImagePreview.value = profileImagePreview.value;
    }

    imageState.profileImage = file;
    profileImagePreview.value = URL.createObjectURL(file);
  }
}

function cancelImageChange() {
  imageState.profileImage = undefined;

  // Restore original image
  if (originalImagePreview.value) {
    profileImagePreview.value = originalImagePreview.value;
    originalImagePreview.value = null;
  } else {
    profileImagePreview.value = null;
  }

  // Clear file input
  const fileInput = document.querySelector(
    'input[type="file"]'
  ) as HTMLInputElement;
  if (fileInput) {
    fileInput.value = "";
  }
}

onMounted(() => {
  if (getSession.value?.user) {
    profileState.firstName = getSession.value.user.firstName || "";
    profileState.lastName = getSession.value.user.lastName || "";
    profileState.email = getSession.value.user.email || "";
  }
});

// Form handlers
async function onImageSubmit() {
  try {
    if (!imageState.profileImage) {
      toast.add({
        title: "No Image Selected",
        description: "Please select an image to upload.",
        icon: "i-heroicons-exclamation-circle",
        color: "warning",
      });
      return;
    }

    isImageSubmitting.value = true;
    const validatedData = imageSchema.parse(imageState);

    console.log("Image Data:", validatedData);

    const formData = new FormData();
    formData.append("ProfileImage", validatedData.profileImage);

    const res = await $fetch(
      `${BASE_URL}/update-image/${getSession.value?.user.id}`,
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `${authToken.value}`,
        },
      }
    );

    const countdownToastId = toast.add({
      title: "Profile Image Updated Successfully!",
      description: `Page will reload in ${reloadCountdown.value} seconds...`,
      icon: "i-heroicons-check-circle",
      color: "success",
    });

    setTimeout(() => {
      window.location.reload();
    }, reloadCountdown.value * 1000);

    imageState.profileImage = undefined;
    originalImagePreview.value = null;
  } catch (error) {
    handleZodError(error);
  } finally {
    isImageSubmitting.value = false;
  }
}

async function onProfileSubmit(event: FormSubmitEvent<ProfileSchema>) {
  try {
    isSubmitting.value = true;
    const validatedData = profileSchema.parse(event.data);

    console.log("Profile Data:", validatedData);

    const payload = {
      FirstName: validatedData.firstName,
      LastName: validatedData.lastName,
      Email: validatedData.email,
    };

    const res = await $fetch(
      `${BASE_URL}/update-details/${getSession.value?.user.id}`,
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          Authorization: `${authToken.value}`,
          "Content-Type": "application/json",
        },
      }
    );

    toast.add({
      title: "Profile Updated Successfully!",
      icon: "i-heroicons-check-circle",
      color: "success",
    });
  } catch (error) {
    handleZodError(error);
  } finally {
    isSubmitting.value = false;
  }
}

const showDeleteModal = ref(false);

function showModalDelete() {
  showDeleteModal.value = true;
}

async function confirmDeleteAccount() {
  try {
    const res = await $fetch(
      `${BASE_URL}/delete/${getSession.value?.user.id}`,
      {
        method: "POST",
        body: getSession.value?.user.id,
        headers: {
          Authorization: `${authToken.value}`,
          "Content-Type": "application/json",
        },
      }
    );

    showDeleteModal.value = false;

    toast.add({
      title: "Account Deleted",
      description: "Your account has been deleted successfully.",
      icon: "i-heroicons-check-circle",
      color: "error",
    });

    // logout after deleting
    await useAuth().signOut({ callbackUrl: "/auth/login" });
  } catch (error) {
    toast.add({
      title: "Delete Failed",
      description: "Something went wrong. Please try again.",
      icon: "i-heroicons-exclamation-circle",
      color: "error",
    });
  } finally {
    showDeleteModal.value = false;
  }
}

async function onPasswordSubmit(event: FormSubmitEvent<PasswordSchema>) {
  try {
    isSubmitting.value = true;
    const validatedData = passwordSchema.parse(event.data);

    console.log("Password Data:", validatedData);

    const payload = {
      CurrentPassword: validatedData.currentPassword,
      NewPassword: validatedData.newPassword,
    };

    const res = await $fetch(
      `${BASE_URL}/update-password/${getSession.value?.user.id}`,
      {
        method: "POST",
        body: payload,
        headers: {
          Authorization: `${authToken.value}`,
          "Content-Type": "application/json",
        },
      }
    );

    toast.add({
      title: "Password Updated Successfully!",
      icon: "i-heroicons-check-circle",
      color: "success",
    });
  } catch (error) {
    handleZodError(error);
  } finally {
    isSubmitting.value = false;
  }
}

function handleZodError(error: unknown) {
  if (error instanceof z.ZodError) {
    error.errors.forEach((err) => {
      toast.add({
        title: "Validation Error",
        description: err.message,
        icon: "i-heroicons-exclamation-circle",
        color: "error",
      });
    });
  } else {
    toast.add({
      title: "Update Failed",
      description: "Unexpected error occurred.",
      icon: "i-heroicons-exclamation-circle",
      color: "error",
    });
  }
}
</script>

<template>
  <div class="min-h-[90%] flex place-items-center">
    <UContainer>
      <div class="flex flex-col md:flex-row justify-center gap-4">
        <!-- Sidebar - Profile Image Section -->
        <div class="min-w-[30%] p-10 border rounded">
          <div class="relative">
            <img
              class="rounded-full w-full object-cover"
              :src="profileImageUrl"
              alt="Profile"
            />

            <UButton
              icon="i-lucide-camera"
              size="sm"
              color="success"
              variant="solid"
              class="absolute bottom-2 right-2 rounded-full border-2"
              @click="openFilePicker"
            />
          </div>

          <input
            ref="fileInput"
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            class="hidden"
            @change="handleImageChange"
          />

          <UButton
            v-if="imageState.profileImage"
            label="Save Profile Image"
            color="primary"
            size="lg"
            block
            class="mt-4"
            :loading="isImageSubmitting"
            icon="i-lucide-save"
            @click="onImageSubmit"
          />

          <UButton
            v-if="imageState.profileImage"
            label="Cancel"
            color="secondary"
            variant="outline"
            size="lg"
            block
            class="mt-2"
            @click="cancelImageChange"
          />

          <hr class="my-10 border-green-500" />
          <UButton
            label="Delete Account"
            color="error"
            size="xl"
            block
            @click="showModalDelete"
          />
        </div>

        <!-- Main content -->
        <div class="min-w-[70%] p-10 border rounded">
          <!-- Profile Details Form -->
          <UForm
            :schema="profileSchema"
            :state="profileState"
            class="space-y-4"
            @submit="onProfileSubmit"
          >
            <h1 class="font-bold text-3xl">User Details</h1>
            <hr class="border-green-500" />

            <UFormField label="First Name" name="firstName" required>
              <UInput
                v-model="profileState.firstName"
                placeholder="First Name"
                icon="i-heroicons-user"
                size="lg"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Last Name" name="lastName" required>
              <UInput
                v-model="profileState.lastName"
                placeholder="Last Name"
                icon="i-heroicons-user"
                size="lg"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Email" name="email" required>
              <UInput
                v-model="profileState.email"
                placeholder="Email"
                icon="i-heroicons-envelope"
                size="lg"
                class="w-full"
              />
            </UFormField>

            <UButton
              type="submit"
              block
              size="lg"
              :loading="isSubmitting"
              label="Update Details"
              icon="i-lucide-save"
            />
          </UForm>

          <!-- Password Form -->
          <UForm
            :schema="passwordSchema"
            :state="passwordState"
            class="space-y-4 mt-7"
            @submit="onPasswordSubmit"
          >
            <h1 class="font-bold text-3xl">Change Password</h1>
            <hr class="border-green-500" />

            <UFormField
              label="Current Password"
              name="currentPassword"
              required
            >
              <UInput
                v-model="passwordState.currentPassword"
                :type="show3 ? 'text' : 'password'"
                placeholder="••••••••"
                icon="i-heroicons-lock-closed"
                size="lg"
                class="w-full"
              >
                <template #trailing>
                  <UButton
                    color="neutral"
                    variant="link"
                    size="sm"
                    :icon="show3 ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                    @click="show3 = !show3"
                  />
                </template>
              </UInput>
            </UFormField>

            <UFormField label="New Password" name="newPassword" required>
              <UInput
                v-model="passwordState.newPassword"
                :type="show ? 'text' : 'password'"
                placeholder="••••••••"
                icon="i-heroicons-lock-closed"
                size="lg"
                class="w-full"
              >
                <template #trailing>
                  <UButton
                    color="neutral"
                    variant="link"
                    size="sm"
                    :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                    @click="show = !show"
                  />
                </template>
              </UInput>
            </UFormField>

            <UFormField
              label="Confirm Password"
              name="confirmPassword"
              required
            >
              <UInput
                v-model="passwordState.confirmPassword"
                :type="show2 ? 'text' : 'password'"
                placeholder="••••••••"
                icon="i-heroicons-lock-closed"
                size="lg"
                class="w-full"
              >
                <template #trailing>
                  <UButton
                    color="neutral"
                    variant="link"
                    size="sm"
                    :icon="show2 ? 'i-lucide-eye-off' : 'i-lucide-eye'"
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
              label="Change Password"
              icon="i-lucide-save"
            />
          </UForm>
        </div>
      </div>
      <!-- {{ getSession }} -->
    </UContainer>
  </div>
  <UModal v-model:open="showDeleteModal" title="Delete Account?">
    <template #body>
      <div class="p-6 space-y-4">
        <div class="flex items-center justify-center">
          <UIcon
            name="i-lucide-triangle-alert"
            class="size-30 text-error-500 dark:text-error-400"
          />
        </div>
        <h2 class="text-xl font-bold text-red-600">Confirm Account Deletion</h2>

        <p class="text-gray-600">
          Are you sure you want to delete your account? This action cannot be
          undone.
        </p>

        <div class="flex justify-end gap-2">
          <UButton
            label="Cancel"
            color="neutral"
            @click="showDeleteModal = false"
          />
          <UButton
            label="Yes, Delete"
            color="error"
            @click="confirmDeleteAccount"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>
