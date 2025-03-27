<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts" setup>
import { defineAsyncComponent, inject, onMounted, ref } from 'vue';
import { date, useQuasar } from 'quasar';
import { Person } from 'src/types/UserTypes';
import { Cookies } from 'quasar';
const NewUserDialog = defineAsyncComponent(
  () => import('src/components/Dialog/NewUserDialog.vue')
);

interface UsersType extends Person {
  admin: boolean;
  active: boolean;
}

const add_new_user = ref(false);
const api = inject('api');
const $q = useQuasar();
let authKey = $q.cookies.get('adminAuthKey');
const users = ref<UsersType[]>([]);
const me = ref<UsersType>(null as unknown as UsersType);
const isGettingUser = ref(true);

function getAllUser() {
  fetch(`${api}/admin/user/all`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('adminAuthKey')}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.statusCode === 200) {
        users.value = data.data;
        me.value = data.me;
      }
    })
    .catch((err) => {
      console.log(err.message);
    })
    .finally(() => (isGettingUser.value = false));
}

function makeAdmin(event: any, userId: string) {
  fetch(`${api}/auth/makeAdmin`, {
    method: 'post',
    body: JSON.stringify({ staffId: userId }),
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authKey}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status) {
        $q.notify({
          message: 'successful',
          icon: 'check_circle',
          color: 'green-10',
          textColor: 'white',
          iconColor: 'white',
        });
        return getAllUser();
      }
      $q.notify({
        message: data.msg,
        icon: 'cancel',
        color: 'red-3',
        textColor: 'red-14',
        iconColor: 'red-14',
      });
    })
    .catch((err) => {
      $q.notify({
        message: err.message,
        icon: 'cancel',
        color: 'red-3',
        textColor: 'red-14',
        iconColor: 'red-14',
      });
    });
}

function removeAdmin(event: any, userId: string) {
  event.target.disabled = true;
  fetch(`${api}/auth/removeAdmin`, {
    method: 'post',
    body: JSON.stringify({ staffId: userId }),
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authKey}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      event.target.disabled = false;
      if (data.status) {
        $q.notify({
          message: 'successful',
          icon: 'check_circle',
          color: 'green-10',
          textColor: 'white',
          iconColor: 'white',
        });
        return getAllUser();
      }
      $q.notify({
        message: data.msg,
        icon: 'cancel',
        color: 'red-3',
        textColor: 'red-14',
        iconColor: 'red-14',
      });
    })
    .catch((err) => {
      event.target.disabled = false;
      $q.notify({
        message: err.message,
        icon: 'cancel',
        color: 'red-3',
        textColor: 'red-14',
        iconColor: 'red-14',
      });
    });
}

function deactivateUser(event: any, userId: string) {
  event.target.disabled = true;
  fetch(`${api}/auth/deactivate`, {
    method: 'post',
    body: JSON.stringify({ userId: userId }),
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authKey}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      event.target.disabled = false;
      if (data.status) {
        $q.notify({
          message: 'successful',
          icon: 'check_circle',
          color: 'green-10',
          textColor: 'white',
          iconColor: 'white',
        });
        return getAllUser();
      }
      $q.notify({
        message: data.msg,
        icon: 'cancel',
        color: 'red-3',
        textColor: 'red-14',
        iconColor: 'red-14',
      });
    })
    .catch((err) => {
      event.target.disabled = false;
      $q.notify({
        message: err.message,
        icon: 'cancel',
        color: 'red-3',
        textColor: 'red-14',
        iconColor: 'red-14',
      });
    });
}

function activateUser(event: any, userId: string) {
  event.target.disabled = true;
  fetch(`${api}/auth/activate`, {
    method: 'post',
    body: JSON.stringify({ userId: userId }),
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authKey}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      event.target.disabled = false;
      if (data.status) {
        $q.notify({
          message: 'successful',
          icon: 'check_circle',
          color: 'green-10',
          textColor: 'white',
          iconColor: 'white',
        });
        return getAllUser();
      }
      $q.notify({
        message: data.msg,
        icon: 'cancel',
        color: 'red-3',
        textColor: 'red-14',
        iconColor: 'red-14',
      });
    })
    .catch((err) => {
      event.target.disabled = false;
      $q.notify({
        message: err.message,
        icon: 'cancel',
        color: 'red-3',
        textColor: 'red-14',
        iconColor: 'red-14',
      });
    });
}

onMounted(() => {
  getAllUser();
});
</script>

<template>
  <div class="tw-min-h-dvh">
    <div class="tw-px-3">
      <div v-if="isGettingUser">
        <div class="tw-border tw-grid tw-place-content-center tw-h-dvh">
          <div>
            <q-icon
              name="hourglass_bottom"
              size="xl"
              class="tw-animate-spin"
              color="accent"
            />
          </div>
        </div>
      </div>

      <div
        class="tw-grid lg:tw-grid-cols-3 sm:tw-grid-cols-2 tw-grid-cols-1 tw-gap-5"
        v-else
      >
        <div
          class="tw-bg-white tw-shadow-lg tw-rounded-lg tw-overflow-hidden tw-border tw-border-gray-200"
        >
          <!-- Profile Picture -->
          <div
            class="tw-bg-gray-100 tw-h-32 tw-flex tw-justify-center tw-items-center"
          >
            <img
              :src="
                me?.profile_pics
                  ? `${api}/assets/images/users/${me.profile_pics}`
                  : '/images/placeholder-1.png'
              "
              alt="Profile Picture"
              class="tw-h-24 tw-w-24 tw-rounded-full tw-border-4 tw-border-white"
            />
          </div>

          <!-- User Info -->
          <div class="tw-p-4 tw-text-center">
            <h2
              class="tw-text-lg tw-font-semibold tw-capitalize tw-underline tw-underline-offset-2 tw-text-purple-700"
            >
              {{ me?.firstname }} {{ me?.lastname }}
            </h2>
            <p class="tw-text-sm tw-text-gray-600">{{ me?.email }}</p>
            <p class="tw-text-sm tw-text-gray-600">
              <strong>{{ me?._count.order }}</strong> ORDER'S
            </p>
            <div class="tw-mt-2">
              <div
                class="tw-text-xs tw-uppercase tw-font-bold tw-px-2 tw-py-1 tw-rounded-full tw-text-slate-700"
              >
                {{ date.formatDate(me?.createdAt, 'MMM DD, YYYY') }}
              </div>
              <span
                class="tw-text-xs tw-uppercase tw-font-bold tw-px-2 tw-py-1 tw-rounded-full"
                :class="
                  me?.admin
                    ? 'tw-bg-blue-100 tw-text-blue-600'
                    : 'tw-bg-gray-100 tw-text-gray-600'
                "
              >
                {{ me?.admin ? 'Admin' : 'User' }}
              </span>
            </div>
          </div>
        </div>

        <div
          class="tw-bg-white tw-shadow-lg tw-rounded-lg tw-overflow-hidden tw-border tw-border-gray-200"
          v-for="user in users"
          :key="user.email"
        >
          <!-- Profile Picture -->
          <div
            class="tw-bg-gray-100 tw-h-32 tw-flex tw-justify-center tw-items-center"
          >
            <q-img
              :src="
                user?.profile_pics
                  ? `${api}/assets/images/users/${user.profile_pics}`
                  : `/images/placeholder-1.png`
              "
              alt="Profile Picture"
              class="tw-h-24 tw-w-24 tw-rounded-full tw-border-4 tw-border-white"
            />
          </div>

          <!-- User Info -->
          <div class="tw-p-4 tw-text-center">
            <router-link :to="`/user/${user?.id}`">
              <h2
                class="tw-text-lg tw-font-semibold tw-capitalize tw-underline tw-underline-offset-2 tw-text-purple-700"
              >
                {{ user?.firstname }} {{ user?.lastname }}
              </h2>
            </router-link>
            <p class="tw-text-sm tw-text-gray-600">{{ user?.email }}</p>

            <div class="tw-mt-2">
              <div
                class="tw-text-xs tw-uppercase tw-font-bold tw-px-2 tw-py-1 tw-rounded-full tw-text-slate-700"
              >
                {{ date.formatDate(me?.createdAt, 'MMM DD, YYYY') }}
              </div>
              <span
                class="tw-text-xs tw-uppercase tw-font-bold tw-px-2 tw-py-1 tw-rounded-full"
                :class="
                  user?.admin
                    ? 'tw-bg-blue-100 tw-text-blue-600'
                    : 'tw-bg-gray-100 tw-text-gray-600'
                "
              >
                {{ user?.admin ? 'Admin' : 'User' }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="tw-p-4 tw-flex tw-justify-between" v-if="me?.admin">
            <div>
              <div v-if="user.admin">
                <q-btn
                  class="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg hover:tw-bg-blue-600 focus:tw-outline-none"
                  v-if="user.admin"
                  no-caps
                  @click="removeAdmin($event, user.id)"
                >
                  Remove Admin
                </q-btn>
                <q-btn
                  class="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg hover:tw-bg-blue-600 focus:tw-outline-none"
                  v-else
                  @click="makeAdmin($event, user.id)"
                >
                  Make Admin
                </q-btn>
              </div>
            </div>

            <!-- <q-btn
              class="tw-bg-red-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg hover:tw-bg-red-600 focus:tw-outline-none"
              v-if="user.active"
              @click="deactivateUser($event, user.id)"
            >
              Deactivate
            </q-btn>

            <q-btn
              class="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg hover:tw-bg-red-600 focus:tw-outline-none"
              v-else
              @click="activateUser($event, user.id)"
            >
              Activate
            </q-btn> -->
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="tw-fixed tw-right-6 tw-bottom-6">
    <q-btn
      icon="add"
      color="accent"
      class="tw-p-5 tw-rounded-full tw-shadow-sm hover:tw-rotate-180 tw-transition-all tw-duration-300"
      @click="() => (add_new_user = true)"
      v-if="me?.admin"
    />
  </div>
  <new-user-dialog v-if="add_new_user" @close="() => (add_new_user = false)" />
</template>
