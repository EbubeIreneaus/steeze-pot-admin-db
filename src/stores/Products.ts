import { defineStore } from 'pinia';
import { inject, ref } from 'vue';
import { Product } from 'src/types/ProductTypes';
import { Cookies } from 'quasar';
// import { SessionStorage } from 'quasar';
// import { LocalStorage } from 'quasar';

export const useProductStore = defineStore('product', () => {
  const api = inject('api');
  const product = ref<Product[]>([]);

  async function initialize() {
    fetch(`${api}/admin/product/all`, {
      headers: {
        'Authorization': `Bearer ${Cookies.get('adminAuthKey')}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.statusCode === 200) {
          return (product.value = data.data);
        }
      })
      .catch((error) => console.log(error));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function add(new_products: any[]) {
    for (const new_pro of new_products) {
      product.value.unshift({
        ...new_pro,
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function update(updated_product: any) {
    const {id } = updated_product;
    const prod = product.value.findIndex((pr) => pr.id == id) ?? ({} as Product);
   product.value[prod] = {...updated_product};
    return;
  }

  function del(productId: number) {
    const index = product.value.findIndex((pr) => pr.id === productId);
    product.value.splice(index, 1);
  }

  function find(productId: number) {
    return product.value.find((pr) => pr.id === productId) ?? ({} as Product);
  }

  function updateImg(id: number, filename: string) {
    for (const pr of product.value) {
      if (pr.id == id) {
        return (pr.image = filename);
      }
    }
  }

  initialize();

  return {
    product,
    add,
    update,
    del,
    find,
    initialize,
    updateImg,
  };
});
