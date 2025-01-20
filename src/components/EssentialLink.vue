<style scoped lang="scss">
.active{
  background-image: linear-gradient(to right, white, $accent);
  color: $secondary;
}
.li{
  border-radius:0 50px 50px 0;
}
</style>
<template>
  <q-item
    clickable
    v-ripple
    :to="link"
    class="li"
    exact-active-class="active"
  >
    <q-item-section
      v-if="icon"
      avatar
    >
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
defineOptions({
  name: 'EssentialLink'
});

export interface EssentialLinkProps {
  title: string;
  caption?: string;
  link?: string;
  icon?: string;
};

withDefaults(defineProps<EssentialLinkProps>(), {
  caption: '',
  link: '#',
  icon: '',
});
</script>
