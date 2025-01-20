<script lang="ts" setup>
import { useProductStore } from 'src/stores/Products';
import { useQuasar } from 'quasar';
import { inject, reactive, ref } from 'vue';

const is_processing = ref(false);
const show = ref(true);
const $q = useQuasar();
const products = ref(useProductStore().product);
const api = inject('api');
const emit = defineEmits(['close']);
const authKey = $q.cookies.get('adminAuthKey');

const productFormProps = {
  productId: null,
  amount: null,
  quantity: null,
};
const salesForm = reactive({
  paid: true,
  cash: true,
  website: false,
});
const form = ref<(typeof productFormProps)[]>([{ ...productFormProps }]);

function incrementProductRow() {
  form.value.push({ ...productFormProps });
}
function removeProductRow(index: number) {
  form.value.splice(index, 1);
}

function recordSales() {
  const new_products = form.value;
  is_processing.value = true;

  fetch(`${api}/sales/`, {
    method: 'put',
    body: JSON.stringify({ sale: salesForm, new_products }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authKey}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status) {
        $q.notify({
          message: "Sales's recorded successfully",
          color: 'green-10',
          textColor: 'white',
          iconColor: 'white',
          icon: 'check_circle',
        });
        emit('close');
      } else {
        $q.notify({
          message: data.msg,
          textColor: 'red-14',
          color: 'red-3',
          iconColor: 'red-14',
          icon: 'error',
        });
      }
    })
    .catch((err) => {
      $q.notify({
        message: err.msg,
        textColor: 'red-14',
        color: 'red-3',
        iconColor: 'red-14',
        icon: 'error',
      });
    })
    .finally(() => (is_processing.value = false));
}

function filterFn(val: string, update: (arg0: { (): void; (): void }) => void) {
  if (val === '') {
    update(() => {
      products.value = useProductStore().product;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    products.value = useProductStore().product.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
}
</script>

<template>
  <q-dialog position="bottom" v-model="show" persistent>
    <q-card class="tw-max-w-xl tw-w-full tw-py-5" flat>
      <q-card-section>
        <div class="tw-flex tw-justify-between tw-items-center">
          <h5 class="md:text-h6 text-subtitle1 tw-uppercase">Record Sales</h5>
          <q-btn
            no-caps
            label="+1"
            @click="incrementProductRow"
            :disable="form.length > 10"
          />
        </div>
      </q-card-section>
      <q-form @submit.prevent="recordSales">
        <q-card-section>
          <div class="tw-mb-5" v-auto-animate>
            <div class="tw-mb-2" v-for="(_, index) in form" :key="index">
              <div>
                <div class="tw-flex tw-items-center">
                  <q-btn
                    icon="close"
                    dense
                    flat
                    color="red-12"
                    @click="removeProductRow(index)"
                    :disable="form.length < 2"
                    size="sm"
                  />
                  <div>
                    <div class="tw-grid tw-grid-cols-5 tw-gap-x-2">
                      <q-select
                        v-model="form[index].productId"
                        label="Product Name"
                        dense
                        borderless
                        filled
                        clearable
                        use-input
                        :options="products"
                        @filter="filterFn"
                        option-label="name"
                        option-value="id"
                        emit-value
                        map-options
                        class="tw-w-full tw-col-span-5"
                        input-class="product-name"
                        hide-dropdown-icon
                        :rules="[(val) => val || 'this field is required']"
                      >
                        <template v-slot:no-option>
                          <q-item>
                            <q-item-section class="text-grey">
                              No results
                            </q-item-section>
                          </q-item>
                        </template>
                      </q-select>

                      <q-input
                        v-model="form[index].quantity"
                        label="Quantity"
                        dense
                        borderless
                        filled
                        :rules="[(val) => val >= 1 || 'enter quantity sold']"
                      />

                      <q-input
                        v-model="form[index].amount"
                        label="Price(NGN)"
                        dense
                        borderless
                        filled
                        class="tw-col-span-2"
                        :rules="[(val) => val >= 1 || 'enter amount sold']"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="tw-flex tw-gap-1 tw-items-center tw-col-span-2">
              <q-checkbox
                v-model="salesForm.paid"
                label="Paid"
                color="accent"
              />
              <q-checkbox
                v-model="salesForm.cash"
                label="Cash"
                color="accent"
              />
            </div>
            <q-btn
              :label="form.length > 1 ? 'Record All' : 'Record'"
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
