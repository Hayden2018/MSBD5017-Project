<template>

  <!-- Main operation -->
  <RouterView />

  <!-- Bottom nav bar -->
  <CurvedBottomNavigation foreground-color='#ffeba7' badge-color='#FBC02D' background-color='#1f2029'
    icon-color='#ffeba7' :options="options" v-model="selected">
    <template #icon="{ props }">
      <font-awesome-icon :icon="props.icon" />
    </template>
    <template #title="{ props }">
      <b>{{ props.title }}</b>
    </template>
  </CurvedBottomNavigation>


</template>


<script setup lang="ts">

import { ref, reactive, inject, onMounted, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';

// bottom bar
import { CurvedBottomNavigation } from "bottom-navigation-vue";
import "bottom-navigation-vue/dist/style.css";

// icons
import { library } from '@fortawesome/fontawesome-svg-core'
import { faRightLeft, faAnglesUp, faLayerGroup } from '@fortawesome/free-solid-svg-icons'


library.add(faLayerGroup, faRightLeft, faAnglesUp)


// set nav bar
let selected = ref(1);
let options = reactive(
  [
    { id: 1, icon: 'fa-solid fa-layer-group', title: '', path: { name: 'nft-view' } },
    { id: 2, icon: 'fa-solid fa-angles-up', title: '', path: { name: 'nft-mint' } },
    { id: 3, icon: 'fa-solid fa-right-left', title: '', path: { name: 'nft-transfer' } }
  ]
)

let router = useRouter();

onBeforeMount(() => {
  console.log('mounted')
  router.push({ name: 'nft-view' })
})

</script>


<style scoped>

</style>