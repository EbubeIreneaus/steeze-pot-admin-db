<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { inject, ref } from 'vue';
import { useRoute } from 'vue-router';
import { Cookies, date } from 'quasar';

const api = inject('api');
const route = useRoute();
const loading = ref(true);
const order = ref<any>({});

fetch(`${api}/admin/sales/${parseInt(route.params.id as string)}`, {
  headers: {
    Authorization: `Bearer ${Cookies.get('adminAuthKey')}`,
  },
})
  .then((res) => res.json())
  .then((data) => {
    order.value = data;
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => (loading.value = false));
</script>

<template>
  <div>
    <div v-if="loading">

    </div>
    <div v-else>
      <div class="tw-max-w-md tw-mx-auto tw-rounded-lg tw-overflow-hidden tw-p-6" :class="$q.dark.isActive? 'tw-bg-slate-900': 'tw-bg-slate-100'">
        <h2 class="tw-text-xl tw-font-bold tw-mb-4">
          Order ID: {{ order.id }}
        </h2>
        <p class="tw-text-gray-600">
          Amount:
          <span class="tw-font-semibold" v-naira="order.totalAmount"></span>
        </p>
        <p class="tw-text-gray-600">
          Paid:
          <span
            class="tw-font-semibold"
            :class="order.paid ? 'tw-text-green-500' : 'tw-text-red-500'"
            >{{ order.paid ? 'Yes' : 'No' }}</span
          >
        </p>
        <p class="tw-text-gray-600">
          Delivered:
          <span
            class="tw-font-semibold"
            :class="order.delivered ? 'tw-text-green-500' : 'tw-text-red-500'"
            >{{ order.delivered ? 'Yes' : 'No' }}</span
          >
        </p>

        <p class="tw-text-gray-600" v-if="order.deliveredAt">
          Delivered Date:
          <span class="tw-font-semibold">{{
            date.formatDate(order.deliveredAt, 'MMMM DD, YYYY')
          }}</span>
        </p>

        <p class="tw-text-gray-600">
          Date:
          <span class="tw-font-semibold">{{
            date.formatDate(order.createdAt, 'MMMM DD, YYYY')
          }}</span>
        </p>

        <div class="tw-border-t tw-my-4"></div>
        <h3 class="tw-text-lg tw-font-semibold tw-mb-2">Products</h3>
        <div
          class="tw-p-4 tw-bg-gray-50 tw-rounded-lg"
          v-for="p in order.products"
          :key="p.id"
        >
          <p class="tw-text-gray-700 tw-font-medium">{{ p.name }}</p>
          <p class="tw-text-gray-500 tw-text-sm">
            Price: <span v-money="p.price"></span> | Quantity: {{ p.quantity }}
          </p>
        </div>

        <div class="tw-border-t tw-my-4"></div>
        <h3 class="tw-text-lg tw-font-semibold tw-mb-2">Delivery Address</h3>
        <p class="tw-text-gray-600">
          State:
          <span class="tw-font-semibold">{{ order.deliveryAddress.state }}</span>
        </p>
        <p class="tw-text-gray-600">
          Area:
          <span class="tw-font-semibold">{{ order.deliveryAddress.area }}</span>
        </p>
        <p class="tw-text-gray-600">
          Street:
          <span class="tw-font-semibold">{{ order.deliveryAddress.street }}</span>
        </p>
        <p class="tw-text-gray-600">
          Bus Stop:
          <span class="tw-font-semibold">{{ order.deliveryAddress.bustop }}</span>
        </p>
        <p class="tw-text-gray-600">
          Address:
          <span class="tw-font-semibold">{{ order.deliveryAddress.address }}</span>
        </p>

        <div class="tw-flex tw-gap-3 tw-mt-6">
          <q-btn
            class=""
            :disabled="(order.paid && order.delivered) || !order.paid"
            color="green-10"
          >
            Mark as Delivered
          </q-btn>
          <button class="btn btn-info flex-1" v-if="!order.paid">
            Make Payment
          </button>
          <q-btn
            class=""
            :disabled="order.paid && order.delivered"
            color="red-10"
          >
            Delete Order
          </q-btn>
        </div>
      </div>
    </div>
  </div>
</template>



<style scoped></style>
