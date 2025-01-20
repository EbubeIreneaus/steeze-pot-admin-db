<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts" setup>
import { useProductStore } from 'src/stores/Products';
import { useQuasar } from 'quasar';
import { ref, reactive, inject } from 'vue';
import { ProductCategories } from 'src/utils/ProductCategory';
import { NotifyError, NotifySuccess } from 'src/utils/notify';

const emit = defineEmits(['close'])
const props = defineProps<{ productId: number }>();
const is_processing = ref(false);
const show = ref(true);
const $q = useQuasar();
const api = inject('api');

let product = useProductStore().find(props.productId);

const form = reactive({
  name: product.name,
  price: product.price,
  category: product.category,
  desc: product.desc,
  id: product.id,
  available: product.available
});

async function recordProducts() {
  const products = form;
  is_processing.value = true;

  try {
    const res = await (
      await fetch(`${api}/admin/product/updateData`, {
        method: 'post',
        body: JSON.stringify(products),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${$q.cookies.get('adminAuthKey')}`,
        },
      })
    ).json();

    if (res.statusCode === 200) {
      NotifySuccess('Product details updated 🤩');
      return emit('close');
    }

    NotifyError(res.message || res.statusMessage);
  } catch (error: any) {
    NotifyError(error.message || error.statusMessage);
  } finally {
    is_processing.value = false;
  }
}

const monitorInput = (val: string) => {
  if (!val) {
    return 'Field is required';
  }
  if (val.toLowerCase().trim() != product.name) {
    let is_similar = useProductStore().product.some(
      (pr) => pr.name == val.toLowerCase().trim()
    );
    if (is_similar) {
      return 'similar product found';
    }
  }
  return true;
};
</script>

<template>
  <q-dialog position="bottom" v-model="show" persistent>
    <q-card class="tw-max-w-xl tw-w-full tw-py-5" flat>
      <q-card-section>
        <div class="tw-flex tw-justify-between tw-items-center">
          <h5 class="md:text-h6 text-subtitle1 tw-uppercase">
            Update Exisiting Product
          </h5>
        </div>
      </q-card-section>
      <q-form @submit.prevent="recordProducts">
        <q-card-section>
          <div class="tw-mb-5" v-auto-animate>
            <div class="tw-grid tw-grid-cols-3 tw-gap-1 tw-mb-5">
              <q-input
                v-model="form.name"
                label="Product Name"
                dense
                borderless
                filled
                class="tw-col-span-3"
                input-class="product-name"
              />

              <q-input
                v-model="form.price"
                label="Price(NGN)"
                dense
                borderless
                filled
              />
              <q-select
                v-model="form.category"
                label="Category"
                dense
                borderless
                filled
                :options="ProductCategories"
              />
              <q-checkbox v-model="form.available" label="Available" color="accent" />
              <q-input
                v-model="form.desc"
                label="description"
                dense
                borderless
                filled
                class="tw-col-span-3"
              />
            </div>
            <q-btn
              label="Record"
              color="accent"
              class="tw-inline-block tw-float-right tw-mx-3"
              type="submit"
              :loading="is_processing"
            />
            <q-btn
              label="Close"
              color="red-12"
              class="tw-inline-block tw-float-right tw-mx-auto"
              @click="emit('close')"
            />
          </div>
        </q-card-section>
        <q-card-actions> </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped></style>
