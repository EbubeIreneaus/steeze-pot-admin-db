<script lang="ts" setup>
import { inject, reactive, ref } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const api = inject('api');
const emit = defineEmits(['close']);
const categories = ['Business Expense', 'New Stock', 'Staff Payment', 'Other'];
const show = true;
const is_processing = ref(false);
const form = reactive({
  category: null,
  amount: null,
  desc: null,
});

function recordExpense() {
  is_processing.value = true;
  fetch(`${api}/expenses`, {
    method: 'put',
    body: JSON.stringify(form),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${$q.cookies.get('adminAuthKey')}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status) {
        $q.notify({
          message: 'Expense recorded successfully',
          color: 'green-10',
          textColor: 'white',
          iconColor: 'white',
          icon: 'check_circle',
        });
        emit('close');
      } else {
        $q.notify({
          message: data.msg,
          textColor: 'red-14',
          color: 'red-3',
          iconColor: 'red-14',
          icon: 'error',
        });
      }
    })
    .catch((err) => {
      $q.notify({
        message: err.msg,
        textColor: 'red-14',
        color: 'red-3',
        iconColor: 'red-14',
        icon: 'error',
      });
    })
    .finally(() => (is_processing.value = false));
}
</script>

<template>
  <q-dialog position="bottom" v-model="show" persistent>
    <q-card class="tw-max-w-xl tw-w-full tw-py-5" flat>
      <q-card-section>
        <div class="tw-flex tw-justify-between tw-items-center">
          <h5 class="md:text-h6 text-subtitle1 tw-uppercase">
            Record Expenses
          </h5>
        </div>
      </q-card-section>
      <q-form @submit.prevent="recordExpense">
        <q-card-section>
          <div class="tw-mb-5">
            <div class="tw-mb-3">
              <div class="tw-grid tw-grid-cols-2 tw-gap-3">
                <q-select
                  v-model="form.category"
                  dense
                  label="category"
                  borderless
                  filled
                  class="tw-col-span-1 tw-px-2"
                  :options="categories"
                  :rules="[
                    (val) =>
                      (val && categories.includes(val)) ||
                      'please select a valid option',
                  ]"
                  required
                />

                <q-input
                  v-model="form.amount"
                  dense
                  borderless
                  filled
                  label="Amount Spent"
                  class="tw-col-span-1 tw-px-2"
                  required
                  :rules="[
                    (val) =>
                      (val && parseInt(val)) || 'please enter a correct value',
                  ]"
                />

                <q-input
                  v-model="form.desc"
                  dense
                  borderless
                  filled
                  label="Description"
                  class="tw-col-span-2 tw-px-2"
                  autogrow
                  required
                />
              </div>
            </div>
            <q-btn
              label="Record"
              color="accent"
              class="tw-inline-block tw-float-right tw-mx-3"
              type="submit"
              :loading="is_processing"
            />
            <q-btn
              label="Close"
              color="red-12"
              class="tw-inline-block tw-float-right tw-mx-auto"
              @click="emit('close')"
            />
          </div>
        </q-card-section>
        <q-card-actions> </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>
