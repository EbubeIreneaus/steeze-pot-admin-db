<script setup lang="ts">
import { usesalesStore } from 'src/stores/sales';
import moment from 'moment';
import { QTableColumn} from 'quasar';
import { useExpenseStore } from 'src/stores/expenses';
import { storeToRefs } from 'pinia';

const SalesStore = usesalesStore()
const ExpensStore = useExpenseStore()
// const props = defineProps<{ page: 'home' | 'analysis' }>();

const {sales} = storeToRefs(SalesStore)
const {Expenses: expenses} = storeToRefs(ExpensStore)


const salesTableColumn: QTableColumn[] = [
  { name: 'salesId', label: 'ORDER ID', field: 'salesId', align: 'left' },
  { name: 'user', label: 'Buyer/Seller', field: 'user', align: 'left' },
  { name: 'staff', label: 'Staff', field: '', align: 'left', sortable: true },
  {
    name: 'amount',
    label: 'Amount',
    field: 'amount',
    align: 'left',
    sortable: true,
  },
  // { name: 'salesId', label: 'ORDER ID', field: 'salesId', align: 'left' },
  {
    name: 'website',
    label: 'Website',
    field: 'website',
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
    name: 'cash',
    label: 'Cash',
    field: 'cash',
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

const expenseTableColumn: QTableColumn[] = [
  {name: 'category', field: 'category', label: 'Category', align: 'left', sortable: true},
  {name: 'user', label: 'Recorded By', field: 'user.username', align: 'left' },
  {name: 'admin', label: 'Admin', field: 'admin', align: 'left', sortable: true},
  {name: 'amount', label: 'Amount', field: 'amount', sortable: true, align: 'left'},
  {name: 'desc', label: 'Description', field: 'desc', align: 'left' },
  {name: 'date', label: 'Date', field: 'createdAt', sortable: true, align: 'left'},
]


</script>

<template>
  <q-card flat square>
    <q-table :columns="salesTableColumn" :rows="sales" separator="none" title="sales record" title-class="text-capitalize">
      <template v-slot:body="props">
        <tr :props="props">
          <td>{{ props.row.salesId }}</td>

          <td><p class="text-capitalize">{{ props.row?.user?.username || props.row?.user?.firstname || 'Nill' }}</p></td>

          <td v-if="props.row?.user?.staff"><q-icon name="check_circle" color="green-14" /></td>
          <td v-else><q-icon name="cancel" color="red-14" /></td>

          <td><p v-money="props.row.amount || 0"></p></td>

          <td v-if="props.row.website"><q-icon name="check_circle" color="green-14" /></td>
          <td v-else><q-icon name="cancel" color="red-13" /></td>

          <td v-if="props.row.paid"><q-icon name="check_circle" color="green-14" /></td>
          <td v-else><q-icon name="cancel" color="red-13" /></td>

          <td v-if="props.row.delivered"><q-icon name="check_circle" color="green-14" /></td>
          <td v-else><q-icon name="cancel" color="red-13" /></td>

          <td v-if="props.row.cash"><q-icon name="check_circle" color="green-14" /></td>
          <td v-else><q-icon name="cancel" color="red-13" /></td>

          <td><p class="tw-capitalize">{{ moment(props.row.createdAt).fromNow() }}</p></td>
        </tr>
      </template>
    </q-table>
  </q-card>

  <q-card flat square>
    <q-table :columns="expenseTableColumn" :rows="expenses" separator="none" title="expenses record" title-class="text-capitalize">
      <template v-slot:body="props" >
        <tr :props="props">

          <td><p class="text-capitalize">{{ props.row.category }}</p></td>

          <td>{{ props.row.user.username }}</td>

          <td v-if="props.row.user.admin"><q-icon name="check_circle" color="green-14" /></td>
          <td v-else><q-icon name="cancel" color="red-13" /></td>


          <td><p v-money="props.row.amount"></p></td>

          <td><p class="tw-max-w-[200px] tw-line-clamp-1 tw-text-ellipsis">{{ props.row.desc }}</p></td>

          <td><p class="tw-capitalize">{{ moment(props.row.createdAt).fromNow() }}</p></td>
        </tr>
      </template>
    </q-table>
  </q-card>
</template>
