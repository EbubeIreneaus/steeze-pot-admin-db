<script setup lang="ts">
import type { Product } from 'src/types/ProductTypes';
import { QTableColumn, useTimeout, useQuasar } from 'quasar';
import { useProductStore } from 'src/stores/Products';
import { defineAsyncComponent, inject, onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { NotifyError, NotifySuccess } from 'src/utils/notify';
const EditProductDialog = defineAsyncComponent(
  () => import('src/components/Dialog/EditProductDialog.vue')
);
const ProductImageDialog = defineAsyncComponent(
  () => import('src/components/Dialog/ProductImageUploader.vue')
);

const api = inject('api');
const props = defineProps<{ page: 'home' | 'product' }>();
const $q = useQuasar();
const ProductStore = useProductStore();
const { product: products } = storeToRefs(ProductStore);
const search = ref('');
const product_to_edit_id = ref<number>(0);
const showEdit = ref(false);
const showPrImageUploader = ref(false);
const prImageToEdit = ref();

const { registerTimeout } = useTimeout();

let columns: QTableColumn[] = [
  {
    name: 'img',
    label: 'Image',
    sortable: true,
    field: 'imgage',
    align: 'left',
  },
  {
    name: 'name',
    label: 'Product Name',
    sortable: true,
    field: 'name',
    align: 'left',
  },

  {
    name: 'available',
    field: 'available',
    label: 'Available',
    sortable: true,
    align: 'left',
  },
  {
    name: '=price',
    label: 'Price',
    sortable: true,
    field: 'price',
    align: 'left',
  },

  {
    name: 'category',
    label: 'Category',
    sortable: true,
    field: 'category',
    align: 'left',
  },
];

if (props.page === 'product') {
  columns.push({
    name: 'action',
    label: '',
    field: '',
    align: 'left',
  });
}

watch(
  () => search.value.toLowerCase(),
  (val) => {
    products.value = useProductStore().product.filter((product) =>
      product.name.toLowerCase().includes(val)
    );
  }
);

function updateProductEditId(id: number) {
  showEdit.value = false;
  product_to_edit_id.value = id;
  registerTimeout(() => {
    showEdit.value = true;
  }, 500);
}

function deleteProduct(id: number) {
  $q.dialog({
    title: 'Are You Sure?',
    message: 'If you delete this product, all related data will be deleted',
    color: 'accent',
    ok: "I'am sure",
  }).onOk(() => {
    fetch(`${api}/admin/product/delete`, {
      method: 'delete',
      body: JSON.stringify({ productId: id }),
      headers: {
        Authorization: `Bearer ${$q.cookies.get('adminAuthKey')}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.statusCode === 200) {
          NotifySuccess('Product deleted sucessfully');
          return ProductStore.del(data.productId)
        } else {
          NotifyError(data.message);
        }
      })
      .catch((err) => {
        NotifyError(err.message);
      });
  });
}

function updateProductImgae(id: number | null, action: 'open' | 'close') {
  if (action == 'open') {
    showPrImageUploader.value = true;
    prImageToEdit.value = id;
  } else {
    showPrImageUploader.value = false;
    prImageToEdit.value = null;
  }
}

function dismissImageEditDialogWithSuccess() {
  showPrImageUploader.value = false;
  $q.notify({
    message: 'Image Updated Successfuly',
    color: 'green-13',
    icon: 'check_circle',
  });
}

onMounted(() => {
  //
});
</script>

<template>
  <div>
    <q-card flat>
      <q-card-section>
        <div class="tw-flex items-center justify-between">
          <h4 class="text-subtitle1 md:text-h5">Products</h4>

          <div>
            <q-input
              type="search"
              placeholder="Search Product"
              v-model="search"
              class="tw-px-4 tw-py-1 tw-rounded-md"
              dense
              clearable
              standout="bg-accent text-white"
              v-if="page === 'product'"
            >
              <template v-slot:append><q-icon name="search" /></template>
            </q-input>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <q-table
          :rows="products"
          :columns="columns"
          row-key="id"
          separator="none"
          flat
        >
          <template v-slot:body="props">
            <tr :props="props">
              <td :key="props.row.image">
                <q-img
                  width="64px"
                  fit="cover"
                  :src="`http://localhost:3000/img/products/${props.row.image}`"
                  class="tw-rounded-md tw-w-16 tw-h-16 !tw-object-cover !tw-object-center"
                  v-if="props.row.image"
                />

                <q-img
                  width="50px"
                  src="~assets/images/placeholder.png"
                  class="tw-rounded-md"
                  v-else
                />
              </td>

              <td class="tw-uppercase">
                {{ props.row.name }}
              </td>

              <td>
                <q-icon
                  name="check_circle"
                  color="green-14"
                  v-if="props.row.available"
                />
                <q-icon name="cancel" color="red-14" v-else />
              </td>

              <td class="tw-font-mono">
                <span
                  v-money-full="props.row.price"
                  class="tw-text-base"
                ></span>
              </td>

              <td class="tw-font-mono">
                <span class="tw-text-base">{{
                  props.row.category || 'Nill'
                }}</span>
              </td>

              <td class="" v-if="page === 'product'">
                <q-btn icon="more_vert" flat dense>
                  <q-menu square auto-close>
                    <q-btn
                      icon="edit"
                      label=""
                      flat
                      size="md"
                      color="accent"
                      @click="updateProductEditId(props.row.id)"
                    >
                      <q-tooltip title="Edit product details"
                        >Edit product details</q-tooltip
                      >
                    </q-btn>

                    <q-btn
                      icon="image"
                      label=""
                      flat
                      size="md"
                      color="green-14"
                      @click="updateProductImgae(props.row.id, 'open')"
                    >
                      <q-tooltip
                        title="Update product image, will be updated on store."
                        >Update product image, will be updated on
                        store.</q-tooltip
                      >
                    </q-btn>

                    <q-btn
                      icon="delete"
                      label=""
                      flat
                      size="md"
                      color="red-13"
                      @click="deleteProduct(props.row.id)"
                    >
                      <q-tooltip title="Delete this product"
                        >Delete this product</q-tooltip
                      >
                    </q-btn>
                  </q-menu>
                </q-btn>
              </td>
            </tr>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <edit-product-dialog
      :product-id="product_to_edit_id"
      v-if="showEdit"
      @close="showEdit = false"
    />

    <product-image-dialog
      v-if="showPrImageUploader"
      :prId="prImageToEdit"
      @close-success="dismissImageEditDialogWithSuccess"
      @close="() => (showPrImageUploader = false)"
    />

  </div>
</template>
