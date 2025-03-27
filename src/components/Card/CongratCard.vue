<script setup lang="ts">
import { computed } from 'vue';
import { usesalesStore } from 'src/stores/sales';
import { SalesType } from 'src/types/SalesTypes';
import { storeToRefs } from 'pinia';

// const duration: Ref = inject('analysis_duration') as Ref;
const SalesStore = usesalesStore()

const totalSale = computed(() => {
  const {sales} = storeToRefs(SalesStore)
  let filteredSales: SalesType[];
  const today = new Date();

  filteredSales = sales.value.filter((sale) => {
    const sold_date = new Date(sale.createdAt);
    return (
      today.getFullYear() == sold_date.getFullYear() &&
      today.getMonth() == sold_date.getMonth()
    );
  });

  const amount = filteredSales.reduce(
    (x, y) => x + parseInt(y.amount?.toString() || '0'),
    0
  );

  return amount;
});
</script>
<template>
  <q-card class="card q-pa-sm relative-position" flat>
    <img src="src/assets/images/triangle-light.png" />
    <q-card-section>
      <span class="text-h6 text-title">Congratulation  Mildred</span>
      <span class="text-subtitle block q-mb-md text-capitalize"
        >Best seller of the Mnnth
      </span>
      <span class="text-h5 text-accent" v-money="totalSale"></span>
    </q-card-section>
    <q-card-actions>
      <q-btn
        outlined
        color="accent"
        dense
        class="rounded-borders q-px-lg"
        to="/analysis"
        >view sales</q-btn
      >
    </q-card-actions>
  </q-card>
</template>

<style scoped lang="scss">
.card {
  border-radius: 10px;
  background-image: url('src/assets/images/trophy.png');
  background-repeat: no-repeat;
  background-size: 75px;
  background-position: bottom 15px right 20px;
}
img {
  width: 130px;
  position: absolute;
  right: 0;
  bottom: 0;
}
</style>
