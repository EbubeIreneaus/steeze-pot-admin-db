<script lang="ts" setup>
import { inject, reactive, ref } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const isLoading = ref(false);
const api = inject('api');
const emit = defineEmits(['close']);

const user = reactive({
  firstname: '',
  lastname: '',
  username: '',
  email: '',
  staff: true,
  admin: false,
});

function submit() {
  isLoading.value = true;
  fetch(`${api}/auth`, {
    method: 'put',
    body: JSON.stringify(user),
    headers: {
      'Content-Type': 'application/json',
      authKey: $q.sessionStorage.getItem('authorisation-key') ?? '',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      isLoading.value = false;
      if (data.status) {
        $q.notify({
          message: 'new staff registered successfully',
          color: 'green-14',
          icon: 'check_circle',
        });
        return emit('close');
      }

      $q.notify({
        message: data.message,
        color: 'red-14',
        icon: 'error',
      });
    })
    .catch((err) => {
      isLoading.value = false;
      $q.notify({
        message: err.message,
        color: 'red-14',
        icon: 'error',
      });
    });
}
</script>

<template>
  <q-dialog :model-value="true" persistent>
    <q-card class="tw-max-w-lg tw-w-full" flat>
      <q-card-section>
        <div class="tw-flex tw-justify-between tw-items-center">
          <h2>Fill In User Details</h2>
          <q-btn icon="close" flat color="accent" @click="emit('close')" />
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="submit">
          <div class="tw-grid tw-grid-cols-2 tw-gap-3">
            <q-input
              v-model="user.firstname"
              filled
              class="tw-col-span-1"
              label="Firstname"
              required
            />
            <q-input
              v-model="user.lastname"
              filled
              class="tw-col-span-1"
              label="lastname"
              required
            />
            <q-input
              v-model="user.email"
              filled
              class="tw-col-span-2"
              label="Email"
              required
            />
            <q-input
              v-model="user.username"
              filled
              class="tw-col-span-1"
              label="Username"
              required
            />
            <q-select
              v-model="user.staff"
              filled
              class="tw-col-span-1"
              label="Staff"
              readonly
              :options="[true, false]"
            />
            <q-checkbox
              v-model="user.admin"
              label="Administrative Priviledge"
              color="accent"
            />
          </div>
          <q-btn
            label="submit"
            unelevated
            color="accent"
            class="tw-mt-4 tw-px-10"
            type="submit"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style lang="css" scoped></style>
