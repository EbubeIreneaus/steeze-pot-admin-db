<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts" setup>
import { useProductStore } from 'src/stores/Products';
import { useQuasar } from 'quasar';
import { inject, onMounted, ref } from 'vue';
import { ProductCategories } from 'src/utils/ProductCategory';
import { NotifyError, NotifySuccess } from 'src/utils/notify';


const emit = defineEmits(['close']);

const is_processing = ref(false);
const $q = useQuasar();
const api = inject('api');

const productFormProps = {
  name: '',
  price: null as unknown as number,
  category: '',
  desc: '',
  available: false
};
const form = ref<(typeof productFormProps)[]>([{ ...productFormProps }]);

function incrementProductRow() {
  form.value.push({ ...productFormProps });
}
function removeProductRow(index: number) {
  form.value.splice(index, 1);
}

async function recordProducts() {
  const products = form.value;
  is_processing.value = true;

  try {
    const res = await (
      await fetch(`${api}/admin/product/add`, {
        method: 'put',
        body: JSON.stringify(products),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${$q.cookies.get('adminAuthKey')}`,
        },
      })
    ).json();

    if (res.statusCode === 201) {
      NotifySuccess('Product uploaded successfully')
      return emit('close')
    }

    NotifyError(res.messgae)
    console.log(res)

  } catch (error: any) {
    NotifyError(error.messgae)
  } finally {
    is_processing.value = false;
  }
}

function monitorInput(index: number) {
  const is_similar = useProductStore().product.find(
    (pr) =>
      pr.name.toLowerCase() === form.value[index].name.toLowerCase().trim()
  );
  if (is_similar) {
  } else {
  }
}

onMounted(() => {
  // form.value.push({ });
});
</script>

<template>
  <q-dialog position="bottom" :model-value="true" persistent>
    <q-card class="tw-max-w-xl tw-w-full tw-py-5" flat>
      <q-card-section>
        <div class="tw-flex tw-justify-between tw-items-center">
          <h5 class="md:text-h6 text-subtitle1 tw-uppercase">
            Record New Product
          </h5>
          <q-btn
            no-caps
            label="+1"
            @click="incrementProductRow"
            :disable="form.length > 5"
          />
        </div>
      </q-card-section>

      <q-form @submit.prevent="recordProducts">
        <q-card-section>
          <div class="tw-mb-5" v-auto-animate>
            <div class="tw-mb-5">
              <div class="tw-mb-3" v-for="(_, index) in form" :key="index">
                <div class="tw-flex tw-items-center">
                  <q-btn
                    icon="close"
                    dense
                    flat
                    color="red-12"
                    @click="removeProductRow(index)"
                    :disable="form.length < 2"
                    size="md"
                  />
                  <div class="tw-grid tw-grid-cols-3 tw-gap-1 tw-items-center">
                    <q-input
                      v-model="form[index].name"
                      label="Product Name"
                      dense
                      borderless
                      filled
                      class="tw-col-span-3"
                      input-class="product-name"
                      :oninput="monitorInput(index)"
                    />
                    <q-input
                      v-model="form[index].price"
                      label="Price(NGN)"
                      dense
                      borderless
                      filled
                    />
                    <q-select
                      v-model="form[index].category"
                      label="Group"
                      dense
                      borderless
                      filled
                      :options="ProductCategories"
                    />
                   
                    <q-input
                      v-model="form[index].desc"
                      label="desc"
                      dense
                      borderless
                      filled
                      class="tw-col-span-3"
                    />
                  </div>
                </div>
              </div>
            </div>
            <q-btn
              label="Record All"
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
