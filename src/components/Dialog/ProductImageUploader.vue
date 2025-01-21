<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts" setup>
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import { inject, ref, watch } from 'vue';
import { useObjectUrl } from '@vueuse/core';
import { useQuasar } from 'quasar';
import { useProductStore } from 'src/stores/Products';
import { NotifyError, NotifySuccess } from 'src/utils/notify';

const props = defineProps<{ prId: number }>();
const emit = defineEmits(['closeSuccess', 'closeError', 'close']);
const FileInput = ref();
const src = ref();
const cropper = ref();
const api = inject('api');
const $q = useQuasar();
const isLoading = ref(false);
const ProductStore = useProductStore();
const alt = ref('')

watch(
  () => FileInput.value,
  (file) => {
    if (file) src.value = useObjectUrl(FileInput).value;
  }
);

async function cropImage() {
  isLoading.value = true;

  const { canvas } = cropper.value.getResult();

  const form = new FormData();

  form.append('productId', props.prId.toString());

  const blob: Blob = await new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    canvas.toBlob((blob: any) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to create blob from canvas'));
      }
    });
  });

  form.append('file', blob);
  form.append('alt', alt.value)

  try {
    const res = await (
      await fetch(`${api}/admin/product/updateImage`, {
        method: 'post',
        body: form,
        headers: {
          Authorization: `Bearer ${$q.cookies.get('adminAuthKey')}`,
        },
      })
    ).json();

    if (res.statusCode === 201) {
      NotifySuccess('Image updated successfully 😎');
      ProductStore.updateImg(res.data.productId, res.data.filename)
      return emit('close');
    }

    return NotifyError(res.message || res.statusMessage);
  } catch (error: any) {
    return NotifyError(error.message || error.statusMessage);
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <q-dialog class="" :model-value="true" persistent>
    <q-card class="tw-h-fit tw-max-w-xl tw-w-full" flat>
      <q-card-section>
        <div class="tw-w-full">
          <q-file v-model="FileInput" label-slot dense borderless>
            <template v-slot:label>
              <q-btn
                label="choose file"
                icon="image"
                color="accent"
                unelevated
              />
            </template>
          </q-file>
        </div>
      </q-card-section>

      <q-card-section v-if="src">
        <q-input v-model="alt" placeholder="A plate of samosa rice.." label="alt text" dense class="tw-mb-2" />

        <Cropper
          ref="cropper"
          :src="src"
          :stencil-props="{
            handlers: {},
            movable: false,
            resizable: false,
          }"
          :resize-image="{
            adjustStencil: false,
          }"
          image-restriction="stencil"
        />
      </q-card-section>

      <q-card-actions>
        <q-btn
          label="save"
          flat
          color="green-13"
          icon="save"
          @click="cropImage()"
          :loading="isLoading"
          v-if="src"
        />

        <q-btn
          label="close"
          flat
          color="red-14"
          class="tw-mx-5"
          @click="emit('close')"
          icon="close"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.cropper {
  height: 200px !important;
  width: 400px;
  background: #ddd;
}
</style>
