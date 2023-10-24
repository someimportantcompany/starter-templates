import { createRouter as createVueRouter, createMemoryHistory, createWebHistory } from 'vue-router';

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
 * Create a Vue Router for both client & server.
 */
export function createRouter() {
  return createVueRouter({
    history: import.meta.env.SSR ? createMemoryHistory('/') : createWebHistory('/'),
    routes: [
      {
        path: '/',
        component: () => import('./pages/Home.vue'),
      },
    ],
  })
}
