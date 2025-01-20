<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useProductStore } from 'src/stores/Products';
import { QTableColumn } from 'quasar';

const { product } = storeToRefs(useProductStore());

const productDetailsColumn: QTableColumn[] = [
  {
    name: 'name',
    label: 'Product Name',
    field: 'name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'price',
    label: 'Unit Price',
    field: 'unit_price',
    align: 'left',
    sortable: true,
  },
  {
    name: 'stock',
    label: 'In Stock',
    field: 'quantity',
    align: 'left',
    sortable: true,
  },
  { name: 'revenue', label: 'Revenue', field: 'quantity_sold', align: 'left' },
];
</script>

<template>
  <div class="tw-grid tw-grid-cols-3 tw-gap-x-4">
    <q-card flat class="tw-col-span-1">
      <q-card-section class="tw-px-0">
        <q-list class="tw-px-2">
          <q-item :class="$q.dark.isActive ? 'tw-bg-black/40' : ''">
            <q-item-section class="tw-uppercase text-accent"
              >Product Name</q-item-section
            >
            <q-item-section side class="tw-uppercase text-accent"
              >Unit Price</q-item-section
            >
          </q-item>
          <q-scroll-area style="height: 350px">
            <q-item
              v-for="pd in product"
              :key="pd.id"
              class="tw-border-b !tw-py-0 tw-px-2"
              dense
            >
              <q-item-section avatar>
                <q-img
                  src="https://d2v5dzhdg4zhx3.cloudfront.net/web-assets/images/storypages/primary/ProductShowcasesampleimages/JPEG/Product+Showcase-1.jpg"
                  class="tw-rounded"
                />
              </q-item-section>
              <q-item-section>
                <h2
                  class="text-caption tw-capitalize tw-line-clamp-1 tw-text-ellipsis"
                >
                  {{ pd.name }}
                </h2>
                
              </q-item-section>

              <q-item-section side>
                <h2 v-money="pd.unit_price"></h2>
              </q-item-section>
            </q-item>
          </q-scroll-area>
        </q-list>
      </q-card-section>
    </q-card>

    <q-card class="tw-col-span-2" flat>
      <q-card-section>
        <q-scroll-area style="height: 350px">
          <q-table
          :columns="productDetailsColumn"
          :rows="product"
          :bordered="false"
          separator="none"
          flat
          :rows-per-page-options="[20, 50, 100]"
          title="Top Selling Product"
          title-class="tw-text-sm text-accent"
        >
          <template v-slot:body="props">
            <q-tr>
              <q-td class="tw-uppercase">{{ props.row.name }}</q-td>
              <q-td><span v-money="props.row.unit_price"></span></q-td>
              <q-td
                :class="
                  props.row.quantity < 5000
                    ? 'tw-text-red-600 '
                    : 'tw-text-green-600'
                "
                >{{ props.row.quantity }}</q-td
              >
              <q-td
                ><span
                class="tw-px-3 tw-py-0.5 tw-rounded"
                :class="props.row.quantity_sold < 10 ?'!tw-bg-red-500/50 tw-text-red-500': 'tw-bg-green-500/50 tw-text-green-500'"
                  v-money="props.row.quantity_sold * props.row.unit_price"
                ></span
              ></q-td>
            </q-tr>
          </template>
        </q-table>
        </q-scroll-area>
      </q-card-section>
    </q-card>
  </div>
</template>
