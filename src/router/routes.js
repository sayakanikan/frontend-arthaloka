const routes = [
  {
    path: "/",
    name: "home",
    meta: { requiresAuth: false },
    component: () => import("pages/IndexPage.vue"),
  },
  {
    path: "/login",
    name: "login",
    meta: { requiresAuth: false },
    component: () => import("pages/LoginPage.vue"),
  },
  {
    path: "/",
    meta: { requiresAuth: true },
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "atm_list",
        name: "atm_list",
        component: () => import("pages/AtmListPage.vue"),
      },
      {
        path: "users",
        name: "users",
        component: () => import("pages/UsersPage.vue"),
      },
      {
        path: "riwayat",
        name: "riwayat",
        component: () => import("pages/RiwayatPage.vue"),
      },
      {
        path: "detail",
        component: () => import("pages/DetailsPage.vue"),
        children: [
          { path: "atm_list", name: "Detail Atm" },
          { path: "users", name: "Detail Customer" },
          { path: "riwayat", name: "Detail Riwayat" },
        ],
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
