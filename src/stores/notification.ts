/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia';
import { computed, inject, ref, watch } from 'vue';
import type { Notification } from 'src/types/Notificationtypes';
import { SessionStorage } from 'quasar';
import { Cookies } from 'quasar';

export const useNotificationStore = defineStore('notification', () => {
  const api = inject('api');

  const authKey = SessionStorage.getItem('authorisation-key')?.toString();

  const Notification = ref<Notification[]>([]);

  const unreadNotfication = computed(() => {
    let count = 0;

    Notification.value.forEach((nt) => {
      if (!nt.viewers.includes(authKey as string)) {
        count++;
      }
    });

    return count;
  });

  function add(notification: Notification) {
    const nt = { ...notification };

    Notification.value.unshift(nt);
  }

  function initialize() {
    fetch(`${api}/notification/all`, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${Cookies.get('adminAuthKey')}`,
      },
    })
      .then((res) => res.json())

      .then((data) => {
        if (data.status) {
          return (Notification.value = data.data);
        }
      })
      .catch((err) => console.error(err.message));
  }

  initialize();

  watch(
    () => Notification.value,
    () => {
      Notification.value.forEach((notification) => {
        const fmt_viewers = notification.viewers.map((v: any) => v.auth_key);

        notification.viewers = fmt_viewers;
      });
    }
  );

  return {
    Notification,
    add,
    unreadNotfication,
    initialize,
  };
});
