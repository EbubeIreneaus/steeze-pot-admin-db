<script setup lang="ts">
import { computed } from 'vue';
import { usesalesStore } from 'src/stores/sales';
import { useExpenseStore } from 'src/stores/expenses';
import { storeToRefs } from 'pinia';

const SalesStore = usesalesStore()
const ExpensesStore = useExpenseStore()

const {sales} = storeToRefs(SalesStore)
const {Expenses: expense} = storeToRefs(ExpensesStore)
const today = new Date();
// sevenDaysAgo.setDate(new Date().getDate() - 7);

const filteredSales = computed(() => {
  const f_sales = sales.value.filter((sale) => {
    const sold_date = new Date(sale.createdAt);
    return (
      today.getDate() == sold_date.getDate()&&
      today.getMonth() == sold_date.getMonth() &&
      today.getFullYear() == sold_date.getFullYear()
    );
  });
  return f_sales;
});

const filteredExpenses = computed(() => {
  const f_expense = expense.value.filter((expense) => {
    const expense_date = new Date(expense.createdAt);
    return (
      today.getDate() == expense_date.getDate()&&
      today.getMonth() == expense_date.getMonth() &&
      today.getFullYear() == expense_date.getFullYear()
    );
  });
  return f_expense;
});

const todaySales = computed(() => {
  const amount = filteredSales.value.reduce(
    (x, y) => x + parseInt(y.amount?.toString() || '0'),
    0
  );
  return amount;
});

// each sales per custumer
const todayCustomer = computed(() => {
  return filteredSales.value.length;
});

const todayExpense = computed(() => {
  return filteredExpenses.value.reduce(
    (x, y) => x + parseInt(y.amount?.toString() || '0'),
    0
  );
});

const todayProfit = computed(() => {
  let profit = 0;
  filteredSales.value.forEach((sales) => {
    const sp = sales.sold_products;
    sp.forEach((spv) => {
      const product_sold_amount = spv.amount;
      const product_quantity_sold = spv.quantity;
      const product_unit_price = spv.product.unit_price;
      let this_product_profit =
        product_sold_amount - product_unit_price * product_quantity_sold;
      profit += this_product_profit;
    });
  });
  return profit;
});
</script>

<template>
  <div>
    <div class="tw-grid tw-grid-cols-2 md:tw-grid-cols-4 tw-gap-x-5 tw-gap-y-7">
      <q-card class="tw-col-span-1" flat>
        <q-card-section>
          <div class="row justify-between">
            <q-btn dense icon="bar_chart" size="" round color="teal"></q-btn>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="text-subtitle q-mb-sm">Total Revenue</div>
          <div class="row">
            <div class="text-h5" v-money="todaySales"></div>
            <q-icon name="expand_less" color="green"></q-icon>
            <div class="text-green-5">10%</div>
          </div>
          <div class="text-subtitle q-mt-md text-weight-light">
            Today Revenue
          </div>
        </q-card-section>
      </q-card>

      <q-card class="tw-col-span-1" flat>
        <q-card-section>
          <div class="row justify-between">
            <q-btn
              dense
              icon="message"
              size=""
              round
              color="accent"
            ></q-btn>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="text-subtitle q-mb-sm">Total Messages</div>
          <div class="row">
            <div class="text-h5" >0</div>
          </div>
          <div class="text-subtitle q-mt-md text-weight-light">Unanswered</div>
        </q-card-section>
      </q-card>

      <q-card class="tw-col-span-1" flat>
        <q-card-section>
          <div class="row justify-between">
            <q-btn dense icon="bar_chart" size="" round color="warning"></q-btn>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="text-subtitle q-mb-sm">Total Bookings</div>
          <div class="row">
            <div class="text-h5"> 0</div>
          </div>
          <div class="text-subtitle q-mt-md text-weight-light">
            Unanswered
          </div>
        </q-card-section>
      </q-card>

      <q-card class="tw-col-span-1" flat>
        <q-card-section>
          <div class="row justify-between">
            <q-btn
              dense
              icon="attach_money"
              size=""
              round
              color="secondary"
            ></q-btn>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="text-subtitle q-mb-sm">Total Orders</div>
          <div class="row">
            <div class="text-h5" >0</div>
          </div>
          <div class="text-subtitle q-mt-md text-weight-light">
           Today
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
