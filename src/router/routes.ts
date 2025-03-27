import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {path: 'account', component: () => import('pages/AccountSettings.vue')},
      {path: 'product', component: () => import('pages/product/ProductPage.vue')},
      {path: 'analysis', component: () => import('pages/MarketAnalysis/AnalysisPage.vue')},
      {path: 'admin', component: () => import('pages/Users/UserIndexPage.vue')},
      {path: 'sales/:id', component: () => import('pages/MarketAnalysis/SalesDetails.vue')},
      {path: 'users/:id', component: () => import('pages/Users/UserDetailsPage.vue')}
    ],
  },
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/Auth/SignUp.vue') },
      { path: 'logout', component: () => import('src/pages/Auth/logoutPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
