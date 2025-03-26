<script setup lang="ts">
import { computed } from 'vue';
import { usesalesStore } from 'src/stores/sales';
import { storeToRefs } from 'pinia';

// const duration: Ref = inject('analysis_duration') as Ref;
const SalesStore = usesalesStore()
const {sales} = storeToRefs(SalesStore);

const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(new Date().getDate() - 7);

const filteredSales = computed(() => {
  const f_sales = sales.value.filter((sale) => {
    const sold_date = new Date(sale.createdAt);
    return sold_date.getTime() >= sevenDaysAgo.getTime();
  });
  return f_sales;
});



const thisWeekSales = computed(() => {
  const amount = filteredSales.value.reduce(
    (x, y) => x + parseInt(y.amount?.toString() || '0'),
    0
  );
  return amount;
});

// each sales per custumer
const totalCustomerThisWeek = computed(() =>{
  return filteredSales.value.length
})

</script>

<template>
  <q-card class="card q-pa-sm relative-position" flat>
    <q-card-section>
      <span class="text-h6 text-title">Statistics Card</span>
      <span class="text-subtitle block q-mb-md"
        >Total growth 😎 this week</span
      >
    </q-card-section>
    <q-card-action>
      <div class="row justify-evenly q-gutter-y-md">
        <div class="row items-center col-6 col-sm-auto" style="gap: 10px">
          <div class="bg-accent q-pa-xs" style="border-radius: 10px">
            <q-icon name="show_chart" size="lg" color="white"></q-icon>
          </div>
          <div class="column justify-center">
            <div class="col text-caption">Revenue</div>
            <div class="col text-h6"><span v-money="thisWeekSales"></span></div>
          </div>
        </div>
        <div class="row items-center col-6 col-sm-auto" style="gap: 10px">
          <div class="bg-green-5 q-pa-xs" style="border-radius: 10px">
            <q-icon name="person" size="lg" color="white"></q-icon>
          </div>
          <div class="column justify-center">
            <div class="col text-caption">New Customers</div>
            <div class="col text-h6">{{ totalCustomerThisWeek }}</div>
          </div>
        </div>
      </div>
    </q-card-action>
  </q-card>
</template>

<style scoped>
.card {
  border-radius: 15px;
}
</style>
