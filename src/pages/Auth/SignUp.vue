<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { inject, reactive, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { NotifyError } from 'src/utils/notify';

const router = useRouter();
const $q = useQuasar();
const api = inject('api');
let inProgress = ref(false);

const user = reactive({
  email: '',
  password: '',
});

const signinUser = async () => {
  try {
    inProgress.value = true;

    let res = await (
      await fetch(`${api}/admin/user/login`, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ).json();

    if (res.statusCode === 200) {
      $q.cookies.set('adminAuthKey', res.token, {
        path: '/',
        expires: '12h',
        secure: true,
      });

      return router.push('/');
    }
    NotifyError(res.message || res.statusMessage);
  } catch (error: any) {
    NotifyError(error.message || error.statusMessage);
  } finally {
    inProgress.value = false;
  }
};

</script>
<template>
  <div class="fullscreen row items-center justify-center">
    <q-card id="main" square flat>
      <q-card-section>
        <div class="text-h4 text-center text-uppercase">Signin here</div>
      </q-card-section>
      <q-card-section>
        <q-form class="q-gutter-md" autocomplete="off" @submit="signinUser()">
          <q-input
            label="Username"
            standout
            v-model="user.email"
            class="tw-px-2"
            :rules="[(val) => val !== '' || 'field cannot be blank']"
          />

          <q-input
            type="password"
            label="Password"
            required
            standout
            v-model="user.password"
            class="tw-px-2"
            :rules="[
              (val) =>
                val.length > 6 || 'password must be 6 or more characters long',
            ]"
          />
          <q-btn class="" color="accent" :loading="inProgress" type="submit"
            >Login</q-btn
          >
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<style scoped lang="scss">
#main {
  max-width: 400px;
  width: 100%;
}
</style>
