import Vue from "vue";
import VueRouter from "vue-router";
import tiktokHome from "../view/home";
Vue.use(VueRouter);

const routes = [
  {
    //   like tiktok app home page.
    path: "/",
    name: "home",
    component: tiktokHome,
  },
  {
    // like tiktok app user page (user infos and posts)
    path: "/user/:userid",
    name: "user",
    component: tiktokHome,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
