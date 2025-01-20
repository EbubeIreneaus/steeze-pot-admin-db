/* eslint-disable @typescript-eslint/no-unused-vars */
import { defineStore } from 'pinia';
import { inject, ref } from 'vue';
// import { SessionStorage } from 'quasar';
import type { SalesType } from 'src/types/SalesTypes';

export const usesalesStore = defineStore('sales', () => {
  const api = inject('api');
  const sales = ref<SalesType[]>([]);

  function initialize() {
    fetch(`${api}/sales/all`, {
      method: 'get',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          return (sales.value = data.data);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function add(sale: SalesType) {

    sales.value.unshift(sale);
  }

  initialize();

  return {
    sales,
    initialize,
    add,
  };
});
