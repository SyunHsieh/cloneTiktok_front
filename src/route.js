import Vue from "vue";
import VueRouter from "vue-router";
import tiktokHome from "../view/home";
import login from "../view/login";
import register from "../view/register";
import createPost from "../view/createPost";

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
  {
    path: "/login",
    name: "login",
    component: login,
  },

  {
    path: "/register",
    name: "register",
    component: register,
  },
  {
    path: "/createPost",
    name: "createPost",
    component: createPost,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
