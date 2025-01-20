<template>
  <q-page>
    <div class="tw-grid tw-grid-cols-12 tw-gap-5">
      <congrat-card class=" md:tw-col-span-4 tw-col-span-12" />
      <statistic-card class="md:tw-col-span-8 tw-col-span-12" />
      <overview-chart class="md:tw-col-span-7 tw-col-span-12" />
      <!-- <total-earnings class="md:tw-col-span-3 tw-col-span-12" /> -->
      <mini-cards class="md:tw-col-span-5 tw-col-span-12" />
      <!-- <sales-list class="tw-col-span-12" page="home" /> -->
      <product-table class="tw-col-span-12" page="home" />

    </div>
  </q-page>
</template>

<script setup lang="ts">
import { defineAsyncComponent} from 'vue';
import CongratCard from 'src/components/Card/CongratCard.vue';
import StatisticCard from 'src/components/Card/StatisticCard.vue'
import TotalEarnings from 'src/components/Card/TotalEarnings.vue'
import MiniCards from 'src/components/Card/MiniCards.vue'
// import SalesList from 'src/components/Card/SalesList.vue'
const OverviewChart = defineAsyncComponent(()=>import('src/components/Charts/OverviewChart.vue'))
const ProductTable = defineAsyncComponent(()=>import('src/components/Table/ProductTable.vue'))
defineOptions({
  name: 'IndexPage'
});

</script>
