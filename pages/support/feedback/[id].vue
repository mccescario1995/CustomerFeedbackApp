<template>
  <div>
    <h1>{{ title }} {{ id }}</h1>
    <p>Test 123</p>
  </div>
</template>

<script setup>
const title = 'Test Title'
const id = useRoute().params.id 
</script>