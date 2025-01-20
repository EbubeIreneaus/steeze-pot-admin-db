<script lang="ts" setup>
import AccountEditSection from 'src/components/Auth/AccountEditSection.vue';
import AccountSecurityEditSection from 'src/components/Auth/AccountSecurityEditSection.vue';
import { inject, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const $q = useQuasar();
const api = inject('api');
const tab = ref('account');
const user = ref(null);

(async function () {
  try {
    const res = await (
      await fetch(`${api}/auth/`, {
        method: 'get',
        headers: {
          Authorization : `Bearer ${$q.cookies.get('adminAuthKey')}`,
        },
      })
    ).json();

    if (res.status) {
      return (user.value = res.data);
    }
    return useRouter().push('/auth/');
  } catch (error) {
    console.log('error', error);
  }
})();
</script>

<template>
 <q-page>
  <q-card flat>
    <q-card-section>
      <q-tabs
        v-model="tab"
        content-class="!tw-border-red-500"
        align="left"
        active-color="blue-11"
        inline-label
      >
        <q-tab icon="person" name="account" label="Account"></q-tab>
        <q-tab name="security" icon="lock" label="security"></q-tab>
        <q-tab name="info" icon="info" label="info" disable></q-tab>
      </q-tabs>
    </q-card-section>

    <q-card-section>
      <q-tab-panels v-model="tab" animated keep-alive>
        <q-tab-panel name="account">
          <AccountEditSection :person="user"  />
        </q-tab-panel>
        <q-tab-panel name="security">
          <AccountSecurityEditSection />
        </q-tab-panel>
      </q-tab-panels>
    </q-card-section>
  </q-card>
 </q-page>
</template>
