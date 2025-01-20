<script lang="ts" setup>
import { useProductStore } from 'src/stores/Products';
import { useQuasar } from 'quasar';
import { ref, reactive, inject, watch } from 'vue';

const props = defineProps<{ productId: number }>();

const emit = defineEmits(['close']);

const is_processing = ref(false);

const $q = useQuasar();

const visible = ref(true);

const api = inject('api');

let product = useProductStore().find(props.productId);

const categories = [
  {
    title: 'Clothings',
    img: 'clothing.jpg',
    group: [
      { title: 'men clothing', subtitle: [], href: '/shop/clothing/men' },
      { title: 'women clothing', subtitle: [], href: '/shop/clothing/women' },
      { title: 'kids clothing', subtitle: [], href: '/shop/clothing/kids' },
      { title: 'seasonal', subtitle: [], href: '/shop/clothing/season' },
    ],
  },
  {
    title: 'Footwear',
    img: 'footware.jpg',
    group: [
      { title: 'men footwear', subtitle: [], href: '/shop/footwear/men' },
      { title: 'women footwear', subtitle: [], href: '/shop/footwear/women' },
      { title: 'kids footwear', subtitle: [], href: '/shop/footwear/kids' },
    ],
  },

  {
    title: 'Accessories',
    img: 'accessories.jpg',
    group: [
      { title: 'men accessories', subtitle: [], href: '/shop/accessories/men' },
      {
        title: 'women accessories',
        subtitle: [],
        href: '/shop/accessories/women',
      },
      {
        title: 'kids accessories',
        subtitle: [],
        href: '/shop/accessories/kids',
      },
      { title: 'unisex', subtitle: [], href: '/shop/accessories/unisex' },
    ],
  },
];

const sub_category_options = ref<
  { title: string; href: string; subtitle: never[] }[]
>([]);

const form = reactive({
  long_title: product.long_title,

  desc: product.desc as string,

  category: product.category,

  sub_category: product.sub_category,

  store: product.store,

  id: product.id,
});

function recordProducts() {
  is_processing.value = true;

  fetch(`${api}/products/updateStore`, {
    method: 'post',

    body: JSON.stringify(form),

    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${$q.cookies.get('adminAuthKey')}`
    },
  })
    .then((res) => res.json())

    .then((data) => {
      is_processing.value = false;

      if (data.status) {
        $q.notify({
          message: 'Product updated successfully',
          textColor: 'white',
          color: 'green-10',
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
      is_processing.value = false
      $q.notify({
        message: err.message,
        textColor: 'red-14',
        color: 'red-3',
        iconColor: 'red-14',
        icon: 'error',
      });
    });
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

watch(
  () => form.category,

  (value) => {
    const val = value?.toLowerCase();

    form.sub_category = '';

    categories.forEach((category) => {
      if (category.title.toLowerCase() == val) {
        sub_category_options.value = category.group;
      }
    });
  }
);
</script>

<template>
  <q-dialog position="bottom" v-model="visible" persistent>
    <q-card class="tw-max-w-xl tw-w-full tw-py-5" flat>
      <q-card-section>
        <div class="tw-flex tw-justify-between tw-items-center">
          <h5 class="md:text-h6 text-subtitle1 tw-uppercase">
            Update {{ product.name }}
          </h5>
        </div>
      </q-card-section>
      <q-form @submit.prevent="recordProducts">
        <q-card-section>
          <div class="tw-mb-5" v-auto-animate>
            <div class="tw-grid tw-grid-cols-3 tw-gap-x-2 tw-gap-y-2 tw-mb-5">
              <q-input
                v-model="form.long_title"
                label="Long title"
                placeholder="will overide product title in store"
                dense
                borderless
                filled
                class="tw-col-span-3"
                input-class="product-name"
              />

              <q-select
                v-model="form.category"
                label="Category"
                dense
                borderless
                filled
                :options="categories"
                option-label="title"
                option-value="title"
                emit-value
                map-options
              />

              <q-select
                v-model="form.sub_category"
                label="Sub Category"
                :options="sub_category_options"
                option-label="title"
                option-value="title"
                emit-value
                map-options
                dense
                filled
              />

              <q-checkbox
                v-model="form.store"
                color="accent"
                label="List on store"
              />

              <q-editor
                v-model="form.desc"
                height="150px"
                class="tw-col-span-3"
                placeholder="Product description"
                square
                toolbar-color="accent"
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
