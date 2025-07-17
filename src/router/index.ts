import { createRouter, createWebHistory } from "vue-router";

const routes = [
  /* {
    path: "/",
    name: "Messenger",
    component: () =>
      import(
        "../views/messenger/MessengerRouting.vue"
      ),
  }, */
  {
    path: "/",
    name: "Messenger",
    component: () =>
      import(
        /* webpackChunkName: "Messenger" */ "../views/messenger/DesktopMessenger.vue"
      ),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
