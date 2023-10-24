// import { createPinia } from 'pinia';
import { createSSRApp } from 'vue';
import { createHead } from '@unhead/vue';

import { createRouter } from './router';

import App from './App.vue';
import './style.css';

/**
 * Create a Vue app for both client & server.
 */
export function createApp(): {
  app: ReturnType<typeof createSSRApp>,
  head: ReturnType<typeof createHead>,
  router: ReturnType<typeof createRouter>,
  } {
  const app = createSSRApp(App);
  // const pinia = createPinia()
  // app.use(pinia)
  const router = createRouter();
  app.use(router);

  const head = createHead();
  app.use(head);

  return {
    app,
    head,
    router,
  };
}
