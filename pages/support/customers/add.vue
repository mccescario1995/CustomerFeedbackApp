<script setup lang="ts">
import { ref } from "vue";

const roles = [
  { label: "Customer", value: "customer" },
  { label: "Support", value: "support" },
];

const addressTypes = [
  { label: "Home", value: "home" },
  { label: "Work", value: "work" },
];

const cities = [
  { label: "Manila", value: "manila" },
  { label: "Cebu", value: "cebu" },
  { label: "Davao", value: "davao" },
];

const states = [
  { label: "Metro Manila", value: "ncr" },
  { label: "Cebu Province", value: "cebu" },
];

const countries = [
  { label: "Philippines", value: "ph" },
  { label: "USA", value: "us" },
];

const companies = [
  { label: "Google", value: "google" },
  { label: "Microsoft", value: "microsoft" },
];

const departments = [
  { label: "Engineering", value: "eng" },
  { label: "Sales", value: "sales" },
];

const form = ref({
  email: "",
  password: "",
  role: undefined,

  firstName: "",
  lastName: "",
  phone: "",
  profileImage: undefined,

  addressType: undefined,
  address: "",
  city: undefined,
  state: undefined,
  postalCode: "",
  country: undefined,

  company: undefined,
  department: undefined,
  jobTitle: "",
});

function handleSubmit() {
  console.log("Form submitted:", form.value);
}
</script>

<template>
  <UContainer>
    <div class="max-w-full mx-auto py-5">
      <UCard
        class="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden"
      >
        <!-- Header -->
        <div
          class="bg-gray-100 dark:bg-gray-700 p-6 border-b border-gray-200 dark:border-gray-600"
        >
          <h1
            class="text-2xl font-semibold text-gray-800 dark:text-gray-100 text-center"
          >
            Add New User
          </h1>
          <p class="text-gray-500 dark:text-gray-300 text-center mt-1">
            Please provide the following details to create a new user.
          </p>
        </div>

        <div class="p-8 space-y-10">
          <UForm :state="form" @submit="handleSubmit" class="space-y-12">
            <!-- User Section -->
            <section>
              <h2
                class="text-lg font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide border-b pb-2 border-gray-200 dark:border-gray-600"
              >
                User Information
              </h2>
              <div class="grid grid-cols-2 gap-6 mt-4 mb-3">
                <UFormField label="Email">
                  <UInput
                    v-model="form.email"
                    type="email"
                    placeholder="Email"
                    icon="i-heroicons-envelope"
                  />
                </UFormField>

                <UFormField label="Password">
                  <UInput
                    v-model="form.password"
                    type="password"
                    placeholder="Password"
                    icon="i-heroicons-lock-closed"
                  />
                </UFormField>
              </div>

              <UFormField label="Role" class="mt-4">
                <USelect
                  v-model="form.role"
                  :items="roles"
                  placeholder="Select a Role"
                  class="w-full mx-auto"
                />
              </UFormField>
            </section>

            <!-- User Profile -->
            <section>
              <h2
                class="text-lg font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide border-b pb-2 border-gray-200 dark:border-gray-600"
              >
                User Profile
              </h2>
              <div class="grid grid-cols-2 gap-6 mt-4 mb-3">
                <UFormField label="First Name">
                  <UInput
                    v-model="form.firstName"
                    placeholder="First name"
                    icon="i-heroicons-user"
                  />
                </UFormField>

                <UFormField label="Last Name">
                  <UInput
                    v-model="form.lastName"
                    placeholder="Last name"
                    icon="i-heroicons-user"
                  />
                </UFormField>
              </div>

              <UFormField label="Phone Number" class="mt-4">
                <UInput
                  v-model="form.phone"
                  placeholder="Phone number"
                  icon="i-heroicons-phone"
                  class="w-full mx-auto"
                />
              </UFormField>
            </section>

            <!-- Address -->
            <section>
              <h2
                class="text-lg font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide border-b pb-2 border-gray-200 dark:border-gray-600"
              >
                Address Information
              </h2>
              <UFormField label="Address" class="mt-4">
                <UInput
                  v-model="form.address"
                  placeholder="Street address"
                  icon="i-heroicons-home"
                  class="w-full mx-auto"
                />
              </UFormField>

              <div class="grid grid-cols-2 gap-6 mt-4">
                <UFormField label="Address Type">
                  <USelect
                    v-model="form.addressType"
                    :items="addressTypes"
                    placeholder="Select address type"
                  />
                </UFormField>
                <UFormField label="City">
                  <USelect
                    v-model="form.city"
                    :items="cities"
                    placeholder="Select city"
                  />
                </UFormField>
              </div>

              <UFormField label="State / Province" class="mt-4">
                <USelect
                  v-model="form.state"
                  :items="states"
                  placeholder="Select state"
                />
              </UFormField>

              <div class="grid grid-cols-2 gap-6 mt-4">
                <UFormField label="Postal Code">
                  <UInput
                    v-model="form.postalCode"
                    placeholder="Postal code"
                  />
                </UFormField>

                <UFormField label="Country">
                  <USelect
                    v-model="form.country"
                    :items="countries"
                    placeholder="Select country"
                  />
                </UFormField>
              </div>
            </section>

            <!-- Employment -->
            <section>
              <h2
                class="text-lg font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide border-b pb-2 border-gray-200 dark:border-gray-600"
              >
                Company Information
              </h2>
              <UFormField label="Company Name" class="mt-4">
                <USelect
                  v-model="form.company"
                  :items="companies"
                  placeholder="Select company"
                />
              </UFormField>

              <UFormField label="Department" class="mt-4">
                <USelect
                  v-model="form.department"
                  :items="departments"
                  placeholder="Select department"
                />
              </UFormField>

              <UFormField label="Job Title" class="mt-4">
                <UInput v-model="form.jobTitle" placeholder="Job title" />
              </UFormField>
            </section>

            <!-- Submit -->
            <div
              class="pt-6 border-t border-gray-200 dark:border-gray-600 flex justify-center"
            >
              <UButton
                type="submit"
                color="primary"
                size="lg"
                class="rounded-lg shadow hover:scale-[1.01] transition"
              >
                Add New User
              </UButton>
            </div>
          </UForm>
        </div>
      </UCard>
    </div>
  </UContainer>
</template>
