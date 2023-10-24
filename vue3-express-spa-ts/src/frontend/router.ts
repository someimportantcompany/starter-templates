import { createRouter, createWebHistory } from 'vue-router';

// Auto generates routes from vue files under ./pages
// https://vitejs.dev/guide/features.html#glob-import
// const pages = import.meta.glob('./pages/*.vue')

// const routes = Object.keys(pages).map((path) => {
//   const name = path.match(/\.\/pages(.*)\.vue$/)[1].toLowerCase()
//   return {
//     path: name === '/home' ? '/' : name,
//     component: pages[path], // () => import('./pages/*.vue')
//   }
// })

/**
 * Create a Vue Router for the client.
 */
export const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      component: () => import('./pages/Home.vue'),
    },
  ],
});
