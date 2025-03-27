<!-- eslint-disable @typescript-eslint/no-explicit-any -->

<script setup lang="ts">
import { inject, ref } from 'vue';
import { useRoute } from 'vue-router';
import { Cookies } from 'quasar';

const route = useRoute()
const loading = ref(false)
const user = ref<any>({})
const api = inject('api')

fetch(`${api}/admin/user/${parseInt(route.params.id as string)}`, {
  headers: {
    Authorization: `Bearer ${Cookies.get('adminAuthKey')}`,
  }
})
.then((res) => res.json())
  .then((data) => {
    user.value = data;
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => (loading.value = false));

</script>

<template>
  <div>
    <pre>
      {{ user }}
    </pre>
  </div>
</template>


<style scoped>

</style>