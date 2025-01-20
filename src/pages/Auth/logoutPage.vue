<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const router = useRouter();

if ($q.cookies.has('adminAuthKey')) {
  $q.cookies.remove('adminAuthKey');
}
router.push('/auth/');
</script>

<template>
  <div></div>
</template>
