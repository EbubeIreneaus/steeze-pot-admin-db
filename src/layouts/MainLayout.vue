<template>
  <q-layout
    view="hHh Lpr lFf"
    :class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'"
  >
    <q-header
      :class="
        $q.dark.isActive
          ? 'bg-dark tw-text-white'
          : 'bg-primary tw-text-black/50'
      "
      class="q-py-sm"
    >
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />


        <q-space></q-space>
     

        <q-btn
          icon="notifications"
          flat
          @click="() => (openNotification = false)"
        >
          <q-badge
            :label="useNotificationStore().unreadNotfication"
            class="bg-accent"
            floating
            v-if="useNotificationStore().unreadNotfication > 0"
          ></q-badge>
        </q-btn>

        <q-btn round class="q-mx-lg">
          <q-avatar>
            <img src="../assets/admin-user.jpg" alt="" />
          </q-avatar>
          <q-menu>
            <div class="row no-wrap q-pa-md">
              <div class="column">
                <div class="text-h6 q-mb-md">Settings</div>
                <q-toggle v-model="darkMode" label="Enable Dark Mode" />
              </div>

              <q-separator vertical inset class="q-mx-lg" />

              <div class="column items-center">
                <q-avatar size="72px">
                  <img src="../assets/admin-user.jpg" />
                </q-avatar>

                <div class="text-subtitle1 q-mt-md q-mb-xs tw-line-clamp-1">Okigwe Ebube</div>

                <q-btn
                  label="Logout"
                  unelevated
                  color="accent"
                  size="sm"
                  v-close-popup
                  to="/auth/logout"
                />
              </div>
            </div>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :class="$q.dark.isActive ? 'bg-dark' : 'bg-primary'"
      :width="220"
    >
      <q-list>
        <!-- <q-item class="row items-center q-my-xs" style="gap: 10px">
          <q-avatar size="md">
            <img src="/icons/favicon-32x32.png" alt="" />
          </q-avatar>
          <span class="text-h6 text-accent">IRENEAUS</span>
        </q-item> -->

        <q-list class="q-mb-lg">
          <EssentialLink
            v-for="link in firstLinkList"
            :key="link.title"
            v-bind="link"
            class="q-my-md"
          />
        </q-list>

        <q-separator spaced />
        <q-list class=" ">
          <EssentialLink
            v-for="link in secondLinkList"
            :key="link.title"
            v-bind="link"
            class="q-my-md"
          />
        </q-list>

        <q-separator spaced />
        <q-list class=" ">
          <EssentialLink
            v-for="link in thirdLinkList"
            :key="link.title"
            v-bind="link"
            class="q-my-md"
          />
        </q-list>
      </q-list>
    </q-drawer>

    <q-page-container
      class="q-py-md"
      :class="$q.dark.isActive ? 'tw-bg-slate-950' : 'tw-bg-slate-200'"
    >
      <router-view class="tw-p-4" />
      <NotificationDialog
        v-if="openNotification"
        :active="openNotification"
        @close="() => (openNotification = false)"
      />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import {
  defineAsyncComponent,
  inject,
  onMounted,
  provide,
  ref,
  watch,
} from 'vue';
import EssentialLink from 'components/EssentialLink.vue';
import type { EssentialLinkProps } from 'components/EssentialLink.vue';
import useDarkMode from 'src/composables/theme';
import { useQuasar } from 'quasar';
import { useProductStore } from 'src/stores/Products';
import { usesalesStore } from 'src/stores/sales';
import { useExpenseStore } from 'src/stores/expenses';
import { useRouter } from 'vue-router';
import { useNotificationStore } from 'src/stores/notification';
import type { Notification } from 'src/types/Notificationtypes';

const NotificationDialog = defineAsyncComponent(
  () => import('src/components/Dialog/NotificationDialog.vue')
);

defineOptions({
  name: 'MainLayout',
});

const $q = useQuasar();

const router = useRouter();

const api = inject('api');

let authKey = $q.cookies.get('adminAuthKey') as string;


if (!authKey) {
  router.push('/auth');
}

provide('adminAuthKey', authKey)



const analysis_duration = ref('daily');

provide('analysis_duration', analysis_duration);

const notification = ref<Notification[]>([]);

watch(
  () => useNotificationStore().Notification,
  () => {
    notification.value = useNotificationStore().Notification;
  }
);
const openNotification = ref(false);

const firstLinkList: EssentialLinkProps[] = [
  { title: 'Dashboard', caption: 'dashboard', icon: 'dashboard', link: '/' },
  {
    title: 'Account Information',
    caption: 'Account',
    icon: 'info',
    link: '/account',
  },
];

const secondLinkList: EssentialLinkProps[] = [
  {
    title: 'Products',
    caption: 'products',
    icon: 'production_quantity_limits',
    link: '/product',
  },
  {
    title: 'Markek Analysis',
    caption: 'sales & expenses',
    icon: 'account_balance_wallet',
    link: '/analysis',
  },
];

const thirdLinkList: EssentialLinkProps[] = [
  {
    title: 'Users',
    caption: 'manage users',
    icon: 'admin_panel_settings',
    link: '/admin',
  },
  {
    title: 'Logout',
    caption: 'logout account',
    icon: 'logout',
    link: '/auth/logout',
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const darkMode = ref<boolean>(useQuasar().dark.isActive ? true : false);

watch(darkMode, (newMode) => {
  if (newMode) {
    useDarkMode(true);
  } else {
    useDarkMode(false);
  }
});

function startScoket() {
  const socket = new WebSocket(
    `${api}/ws?token=${encodeURIComponent(
      $q.cookies.get('adminAuthKey') ?? new Date().getTime()
    )}`
  );

  socket.onopen = () => console.log('Listening for connection');

  socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    console.log(data.msg);
    if (data.msg) {
      switch (data.msg) {
        case 'new_sales_record':
          usesalesStore().add(data.sale);
          break;
        case 'new_expense':
          useExpenseStore().add(data.data);
          break;
        case 'new_product_added':
          useProductStore().add(data.products);
          break;
        case 'product_deleted':
          useProductStore().del(data.productId);
          break;
        case 'image_updated':
          useProductStore().updateImg(data.productId, data.filename);
          break;
        case 'product_updated':
          useProductStore().update(data.product);
          break;
        case 'notification':
          useNotificationStore().add(data.data);
          break;
        default:
          break;
      }
    }
  });
}

onMounted(() => {
  startScoket();
});
</script>
