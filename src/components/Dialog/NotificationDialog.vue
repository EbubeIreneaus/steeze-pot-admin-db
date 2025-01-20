<script lang="ts" setup>
defineProps<{ active: boolean }>();
const emit = defineEmits(['close']);
import { useNotificationStore } from 'src/stores/notification';
import moment from 'moment';
import { useQuasar } from 'quasar';
import { inject, onMounted } from 'vue';

const api = inject('api');

const $q = useQuasar();


onMounted(() => {
  fetch(`${api}/notification/viewed`, {
    method: 'post',

    headers: {
      Authorization: `Bearer ${$q.cookies.get('adminAuthKey')}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status) {
      }
    })
    .catch((err) => {
      console.error(err.message);
    });
});
</script>

<template>
  <div
    class="tw-fixed tw-h-screen tw-w-full bg-dark tw-top-0 tw-right-0 tw-z-[9999999999] main tw-ring tw-ring-slate-900 tw-overflow-y-auto"
    :class="active ? 'open' : 'close'"
  >
    <div class="mb-2">
      <div>
        <q-btn icon="close" flat color="accent" @click="emit('close')" />
      </div>
      <h2 class="tw-text-center text-h5 tw-uppercase">Notifications</h2>
    </div>
    <div>
      <q-list padding>
        <q-item
          v-for="nt in useNotificationStore().Notification"
          :key="nt.id"
          class="tw-bg-slate-900/30 tw-mb-1 tw-py-3.5"
        >
          <q-item-section>
            <q-item-label class="tw-capitalize">{{ nt.desc }}</q-item-label>
            <q-item-label caption>{{
              moment(nt.createdAt).fromNow()
            }}</q-item-label>
          </q-item-section>
          <!-- <q-item-section side v-if="!nt.viewers.includes(authKey as string)">
            <q-chip color="green-14" dense size="sm">unread</q-chip>
          </q-item-section> -->
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<style scoped>
.main {
  transition: all 0.2s linear;
}
.open {
  max-width: 350px !important;
  opacity: 1;
}
.close {
  max-width: 0;
  opacity: 0;
}
</style>
