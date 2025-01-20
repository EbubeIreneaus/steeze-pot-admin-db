import { defineStore } from 'pinia';
import { inject, ref } from 'vue';
import type { ExpenseType } from 'src/types/ExpenseType';

export const useExpenseStore = defineStore('expenses', () => {
  const api = inject('api');
  const Expenses = ref<ExpenseType[]>([]);

  function initialize(force = false) {
    if (Expenses.value.length > 1 && !force) {
      return;
    }
    fetch(`${api}/expenses/all`, {
      method: 'get',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          Expenses.value = data.data;
        }
      })
      .catch((err) => {
        console.error(err.message);
      });
  }

  function add(expense : ExpenseType){
    Expenses.value.unshift(expense)
  }

  initialize()

  return {
    Expenses,
    initialize,
    add
  }
});
