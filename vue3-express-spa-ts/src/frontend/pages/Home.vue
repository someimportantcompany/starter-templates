<script setup lang="ts">
import fetch from 'cross-fetch';
import { ref, onMounted } from 'vue';
import { useHead } from '@unhead/vue';

import HelloWorld from '../components/HelloWorld.vue';

const data = ref<string>();
let isLoading = ref<boolean>(true);

async function fetchData(): Promise<string> {
  try {
    isLoading.value = true;

    const res = await fetch('/api', {
      method: 'POST',
      headers: { 'user-agent': navigator.userAgent },
    });

    return res.json();
  } catch (err) {
    console.error(err);
    return 'An error occurred';
  } finally {
    isLoading.value = false;
  }
}

// onServerPrefetch(async () => {
//   // component is rendered as part of the initial request
//   // pre-fetch data on server as it is faster than on the client
//   data.value = await fetchData();
// });

onMounted(async () => {
  if (!data.value) {
    // if data is null on mount, it means the component
    // is dynamically rendered on the client. Perform a
    // client-side fetch instead.
    data.value = await fetchData();
  }
});

useHead({
  title: 'Home - Some Site',
});
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/static/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="../assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <img v-if="isLoading" src="/static/spinner.svg" height="120px" width="120px"/>
  <h1 v-else>{{ data }}</h1>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
