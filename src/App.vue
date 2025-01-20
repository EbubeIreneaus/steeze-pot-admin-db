<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted, provide } from 'vue';
import { configureTheme } from './composables/theme';

defineOptions({
  name: 'App'
});

const backend_url = process.env.DEV ? 'http://localhost:3000/api': 'https://sales-admin-server.financial-growths.com/api'
provide('api', backend_url)


onMounted(()=>{
  configureTheme()

})
</script>
