// import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { createHead } from '@unhead/vue';

import { router } from './router';

import App from './App.vue';
import './style.css';

/**
 * Create a Vue app for both client & server.
 */
const app = createApp(App);
// const pinia = createPinia()
// app.use(pinia)
app.use(router);

const head = createHead();
app.use(head);

router.isReady().then(() => app.mount('#app'));
