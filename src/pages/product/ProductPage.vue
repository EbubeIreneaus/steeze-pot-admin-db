<script lang="ts" setup>
// import { storeToRefs } from 'pinia';
// import { QTableColumn } from 'quasar';
import ProductTable from 'src/components/Table/ProductTable.vue';
import { useProductStore } from 'src/stores/Products';
import { usesalesStore } from 'src/stores/sales';
import { computed, defineAsyncComponent, ref } from 'vue';

const AddProductDialog = defineAsyncComponent(
  () => import('src/components/Dialog/AddProductDialog.vue')
);

const request_add_new_product = ref(false);
const totalProduct = computed(() => {
  return useProductStore().product.length;
});

const totalSales = computed(() => {
  const sales = usesalesStore().sales;
  const amount = sales.reduce((x, y) => x + parseInt(y.amount?.toString() || '0'), 0);
  return amount;
});
</script>

<template>
  <q-page>
    <div class="tw-grid sm:tw-grid-cols-2 tw-gap-5 tw-mb-5">
      <q-card flat bordered>
        <q-card-section>
          <div class="tw-grid tw-grid-cols-4 tw-gap-x-2 items-center">
            <div
              class="tw-col-span-1 tw-bg-slate-900/40 tw-rounded-lg tw-text-center tw-py-3"
            >
              <q-icon name="inventory_2" size="xx-large" :color="$q.dark.isActive? '': 'white'"  />
            </div>
            <div class="tw-col-span-2 text-center">
              <h2 class="md:tw-text-4xl tw-text-3xl text-weight-bolder">
                {{ totalProduct }}
              </h2>
              <div class="text-sm">Registered Product</div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card flat bordered>
        <q-card-section>
          <div class="tw-grid tw-grid-cols-4 tw-gap-x-2 items-center">
            <div
              class="tw-col-span-1 tw-bg-slate-900/40 tw-rounded-lg tw-text-center tw-py-3"
            >
              <q-icon name="money" size="xx-large" :color="$q.dark.isActive? '': 'white'"  />
            </div>
            <div class="tw-col-span-2 text-center">
              <h2 class="md:tw-text-3xl tw-text-2xl text-weight-bolder">
                <span v-money="totalSales"></span>
              </h2>
              <div class="text-sm">Total sales</div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div>
      <div class="">
        <q-btn
          :color="$q.dark.isActive ? 'dark' : 'accent'"
          label="add new product"
          icon="add"
          class="tw-py-3 tw-mb-3 tw-block"
          @click="request_add_new_product = !request_add_new_product"
        />
        <div>
          <product-table page="product" />
        </div>
      </div>
    </div>

    <AddProductDialog v-if="request_add_new_product" @close="request_add_new_product = !request_add_new_product" />
  </q-page>
</template>
