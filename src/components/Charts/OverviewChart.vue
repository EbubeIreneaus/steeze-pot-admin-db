<template>
  <q-card class="q-py-sm text-accent tw-h-[400px] md:tw-h-full" flat>
    <div class="">
      <q-select
        v-model="dataBy"
        :options="['days', 'months']"
        filled
        dense
        flat
        borderless
        class="tw-w-fit tw-mx-3"
      >
        <template v-slot:prepend>
          <small class="tw-text-sm tw-capitalize">analyse by: </small>
        </template>
      </q-select>
    </div>
    <apexchart
      type="line"
      :options="options"
      :series="series"
      height="90%"
    ></apexchart>
  </q-card>
</template>

<script setup>
import {  useQuasar } from 'quasar';
import { usesalesStore } from 'src/stores/sales';
import { useExpenseStore } from 'src/stores/expenses';
import { ref, computed } from 'vue';
const dataBy = ref('days');
import moment, { max } from 'moment';
import { storeToRefs } from 'pinia';


const today = new Date();
// sevenDaysAgo.setDate(new Date().getDate() - 7);
const SalesStore = usesalesStore()
const ExpensesStore = useExpenseStore()

const {sales} = storeToRefs(SalesStore)
const {Expenses: expense} = storeToRefs(ExpensesStore)

const filteredSales = computed(() => {
  const f_sales = sales.value.filter((sale) => {
    const sold_date = new Date(sale.createdAt);

    if (dataBy.value == 'days') {
      return (
        moment(today).week() == moment(sold_date).week() &&
        today.getMonth() == sold_date.getMonth() &&
        today.getFullYear() == sold_date.getFullYear()
      );
    } else {
      return (
        today.getMonth() == sold_date.getMonth() &&
        today.getFullYear() == sold_date.getFullYear()
      );
    }
  });
  return f_sales;
});

const filteredExpenses = computed(() => {
  const f_expense = expense.value.filter((expense) => {
    const expense_date = new Date(expense.createdAt);
    return dataBy.value == 'days'
      ? moment(today).week() == moment(expense.createdAt).week() &&
          today.getMonth() == expense_date.getMonth() &&
          today.getFullYear() == expense_date.getFullYear()
      : today.getMonth() == expense_date.getMonth() &&
          today.getFullYear() == expense_date.getFullYear();
  });
  return f_expense;
});

const revenueSeries = computed(() => {
  if (dataBy.value == 'days') {
    const series = [
      { x: 'Sun', y: 0 },
      { x: 'Mon', y: 0 },
      { x: 'Tue', y: 0 },
      { x: 'Wed', y: 0 },
      { x: 'Thu', y: 0 },
      { x: 'Fri', y: 0 },
      { x: 'Sat', y: 0 },
    ];
    filteredSales.value.forEach((sale) => {
      const day = new Date(sale.createdAt).getDay();
      // if sale day is sunday(0) then
      // increment the value of sale on sunday
      // series[0].y = series[0].y += sale.amount
      return (series[day].y += parseInt(sale.amount || '0'));
    });
    return series;
  } else {
    const series = [
      { x: 'Jan', y: 0 },
      { x: 'Feb', y: 0 },
      { x: 'Mar', y: 0 },
      { x: 'Apr', y: 0 },
      { x: 'May', y: 0 },
      { x: 'Jun', y: 0 },
      { x: 'Jul', y: 0 },
      { x: 'Aug', y: 0 },
      { x: 'Sep', y: 0 },
      { x: 'Oct', y: 0 },
      { x: 'Nov', y: 0 },
      { x: 'Dec', y: 0 },
    ];
    console.log(filteredSales.value);
    filteredSales.value.forEach((sale) => {
      const month = new Date(sale.createdAt).getMonth();
      return (series[month].y += parseInt(sale.amount || '0'));
    });
    return series;
  }
});

const expenseSeries = computed(() => {
  if (dataBy.value == 'days') {
    const series = [
      { x: 'Sun', y: 0 },
      { x: 'Mon', y: 0 },
      { x: 'Tue', y: 0 },
      { x: 'Wed', y: 0 },
      { x: 'Thu', y: 0 },
      { x: 'Fri', y: 0 },
      { x: 'Sat', y: 0 },
    ];

    filteredExpenses.value.forEach((expense) => {
      const day = new Date(expense.createdAt).getDay();
      // dont understand, refer to revenueSeries to understand
      return (series[day].y += parseInt(expense.amount || '0'));
    });
    return series;
  } else {
    const series = [
      { x: 'Jan', y: 0 },
      { x: 'Feb', y: 0 },
      { x: 'Mar', y: 0 },
      { x: 'Apr', y: 0 },
      { x: 'May', y: 0 },
      { x: 'Jun', y: 0 },
      { x: 'Jul', y: 0 },
      { x: 'Aug', y: 0 },
      { x: 'Sep', y: 0 },
      { x: 'Oct', y: 0 },
      { x: 'Nov', y: 0 },
      { x: 'Dec', y: 0 },
    ];

    filteredExpenses.value.forEach((expense) => {
      const month = new Date(expense.createdAt).getMonth();
      return (series[month].y += parseInt(expense.amount || '0'));
    });
    return series;
  }
});

const profitSeries = computed(() => {
  if (dataBy.value == 'days') {
    const series = [
      { x: 'Sun', y: 0 },
      { x: 'Mon', y: 0 },
      { x: 'Tue', y: 0 },
      { x: 'Wed', y: 0 },
      { x: 'Thu', y: 0 },
      { x: 'Fri', y: 0 },
      { x: 'Sat', y: 0 },
    ];

    filteredSales.value.forEach((sale) => {
      const day = new Date(sale.createdAt).getDay();
      const sp = sale.sold_products;
      let profit = 0;
      sp.forEach((spv) => {
        const product_sold_amount = spv.amount || 0;
        const product_quantity_sold = spv.quantity;
        const product_unit_price = spv.product.unit_price || 0;
        let this_product_profit =
          product_sold_amount - product_unit_price * product_quantity_sold;
        profit += this_product_profit;
      });
      return (series[day].y += parseInt(profit));
    });
    return series;
  } else {
    const series = [
      { x: 'Jan', y: 0 },
      { x: 'Feb', y: 0 },
      { x: 'Mar', y: 0 },
      { x: 'Apr', y: 0 },
      { x: 'May', y: 0 },
      { x: 'Jun', y: 0 },
      { x: 'Jul', y: 0 },
      { x: 'Aug', y: 0 },
      { x: 'Sep', y: 0 },
      { x: 'Oct', y: 0 },
      { x: 'Nov', y: 0 },
      { x: 'Dec', y: 0 },
    ];
    console.log(filteredSales.value);
    filteredSales.value.forEach((sale) => {
      const month = new Date(sale.createdAt).getMonth();
      const sp = sale.sold_products;
      let profit = 0;
      sp.forEach((spv) => {
        const product_sold_amount = spv.amount || 0;
        const product_quantity_sold = spv.quantity;
        const product_unit_price = spv.product.unit_price || 0;
        let this_product_profit =
          product_sold_amount - product_unit_price * product_quantity_sold;
        profit += this_product_profit;
      });
      return (series[month].y += parseInt(profit));
    });
    return series;
  }
});

let options = {
  title: {
    text: 'Sales Analysis',
    style: {
      color: '#9C27B0',
    },
  },
  chart: {
    toolbar: {
      show: true,
      offsetX: 0,
      offsetY: 0,
      tools: {
        download: true,
        selection: false,
        zoom: false,
        zoomin: true,
        zoomout: true,
        pan: false,
        reset: false | '<img src="/static/icons/reset.png" width="20">',
        customIcons: [],
      },
    },
  },
  stroke: {
    curve: 'smooth',
  },
  grid: {
    show: false,
  },
  xaxis: {

    labels: {
      style: {
        colors: '#9C27B0',
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: '#9C27B0',
      },
    },
  },
};
let series = computed(() => [
  {
    name: 'Revenue',
    data: revenueSeries.value,
  },
  {
    name: 'Expenses',
    data: expenseSeries.value,
  },
  {
    name: 'Profit',
    data: profitSeries.value
  },
]);
</script>
