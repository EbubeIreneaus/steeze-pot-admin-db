<script setup lang="ts">
import { usesalesStore } from 'src/stores/sales';
import moment from 'moment';
import { QTableColumn } from 'quasar';
import { storeToRefs } from 'pinia';

const SalesStore = usesalesStore();

const { sales } = storeToRefs(SalesStore);

const salesTableColumn: QTableColumn[] = [
  { name: 'id', label: 'ORDER ID', field: 'id', align: 'left' },
  { name: 'user', label: 'Buyer', field: 'user', align: 'left' },
  {
    name: 'amount',
    label: 'Amount',
    field: 'totalAmount',
    align: 'left',
    sortable: true,
  },
  {
    name: 'paid',
    label: 'Paid',
    field: 'paid',
    align: 'left',
    sortable: true,
  },
  {
    name: 'delivered',
    label: 'Delivered',
    field: 'delivered',
    align: 'left',
    sortable: true,
  },
  {
    name: 'date',
    label: 'Date',
    field: 'createdAt',
    align: 'left',
    sortable: true,
  },
];
</script>

<template>
  <q-card flat square>
    <q-table
      :columns="salesTableColumn"
      :rows="sales"
      separator="none"
      title="sales record"
      title-class="text-capitalize"
    >
      <template v-slot:body="props">
        <tr :props="props">
          <td class="tw-underline">
            <router-link :to="`/sales/${props.row.id}`" class="tw-text-pink-400"
              >#{{ props.row.id }}</router-link
            >
          </td>

          <td>
            <p class="text-capitalize">
              {{
                props.row?.user?.email || props.row?.user?.firstname || 'Nill'
              }}
            </p>
          </td>

          <td><p v-money="props.row.totalAmount || 0"></p></td>

          <td v-if="props.row.paid">
            <q-icon name="check_circle" color="green-14" />
          </td>
          <td v-else><q-icon name="cancel" color="red-13" /></td>

          <td v-if="props.row.delivered">
            <q-icon name="check_circle" color="green-14" />
          </td>
          <td v-else><q-icon name="cancel" color="red-13" /></td>

          <td>
            <p class="tw-capitalize">
              {{ moment(props.row.createdAt).fromNow() }}
            </p>
          </td>
        </tr>
      </template>
    </q-table>
  </q-card>
</template>
