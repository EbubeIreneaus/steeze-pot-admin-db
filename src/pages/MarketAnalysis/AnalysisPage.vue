<script lang="ts" setup>
import OverviewChart from 'src/components/Charts/OverviewChart.vue';
import MiniCards from 'src/components/Card/MiniCards.vue';
import SalesList from 'src/components/Table/SalesList.vue';
import { defineAsyncComponent, ref } from 'vue';

const RecordSalesDialog = defineAsyncComponent(
  () => import('src/components/Dialog/RecordSalesDialog.vue')
);

const RecordExpenseDialog = defineAsyncComponent(() => import('src/components/Dialog/RecordExpenseDialog.vue'))

const showRecordSalesDialog = ref(false)
const showRecordExpenseDialog = ref(false)

function hideRecordSalesDialog() {
  showRecordSalesDialog.value = false
}

function hideRecordExpenseDialog() {
  showRecordExpenseDialog.value = false
}
</script>

<template>
  <q-page>
    <div>
      <!-- <div class="tw-grid lg:tw-grid-cols-3 tw-grid-cols-1 tw-gap-3">
        <overview-chart class="lg:tw-col-span-2" />
        <mini-cards class="lg:tw-col-span-1" />
      </div> -->
      <div class="tw-my-3">
        <!-- <q-btn label="Record Sales" color="green-13" @click="() => showRecordSalesDialog = true" />
        &nbsp;
        <q-btn label="Record Expense" color="red-13" @click="()=> showRecordExpenseDialog = true" /> -->
      </div>
      <SalesList page="analysis" />
    </div>

    <RecordSalesDialog v-if="showRecordSalesDialog" @close="hideRecordSalesDialog" />
    <RecordExpenseDialog v-if="showRecordExpenseDialog" @close="hideRecordExpenseDialog" />
  </q-page>
</template>
