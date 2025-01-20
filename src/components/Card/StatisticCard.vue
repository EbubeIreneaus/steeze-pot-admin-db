<script setup lang="ts">
import { computed } from 'vue';
import { usesalesStore } from 'src/stores/sales';
import { useExpenseStore } from 'src/stores/expenses';
import { storeToRefs } from 'pinia';
// import { SalesType } from 'src/types/SalesTypes';
// import type { ExpenseType } from 'src/types/ExpenseType';

// const duration: Ref = inject('analysis_duration') as Ref;
const SalesStore = usesalesStore()
const ExpensesStore = useExpenseStore()

const {sales} = storeToRefs(SalesStore);
const {Expenses: expense} = storeToRefs(ExpensesStore)

const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(new Date().getDate() - 7);

const filteredSales = computed(() => {
  const f_sales = sales.value.filter((sale) => {
    const sold_date = new Date(sale.createdAt);
    return sold_date.getTime() >= sevenDaysAgo.getTime();
  });
  return f_sales;
});

const filteredExpenses = computed(() => {
  const f_expense = expense.value.filter((expense) => {
    const expense_date = new Date(expense.createdAt);
    return expense_date.getTime() >= sevenDaysAgo.getTime();
  });
  return f_expense;
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

const totalExpenseThisWeek = computed(() => {
  return filteredExpenses.value.reduce((x,y) => x + parseInt(y.amount.toString()), 0)
})

const totalProfitThisWeek = computed(() => {
  let profit = 0
  filteredSales.value.forEach((sales) => {
    const sp = sales.sold_products
    sp.forEach((spv) => {
      const product_sold_amount = spv.amount || 0;
      const product_quantity_sold = spv.quantity
      const product_unit_price = spv.product.unit_price || 0
      let this_product_profit = product_sold_amount - (product_unit_price * product_quantity_sold)
      profit += this_product_profit
    })
  });
  return profit
})
</script>

<template>
  <q-card class="card q-pa-sm relative-position" flat>
    <q-card-section>
      <span class="text-h6 text-title">Statistics Card</span>
      <span class="text-subtitle block q-mb-md"
        >Total 48.5% growth 😎 this week</span
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
            <div class="col text-caption">Customers</div>
            <div class="col text-h6">{{ totalCustomerThisWeek }}</div>
          </div>
        </div>
        <div class="row items-center col-6 col-sm-auto" style="gap: 10px">
          <div class="bg-red-5 q-pa-xs" style="border-radius: 10px">
            <q-icon name="inventory" size="lg" color="white"></q-icon>
          </div>
          <div class="column justify-center">
            <div class="col text-caption">Expenses</div>
            <div class="col text-h6"><span v-money="totalExpenseThisWeek"></span></div>
          </div>
        </div>
        <div class="row items-center col-6 col-sm-auto" style="gap: 10px">
          <div class="bg-blue-5 q-pa-xs" style="border-radius: 10px">
            <q-icon name="payments" size="lg" color="white"></q-icon>
          </div>
          <div class="column justify-center">
            <div class="col text-caption">Profit</div>
            <div class="col text-h6" v-money="totalProfitThisWeek"></div>
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
