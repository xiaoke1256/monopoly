import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Index",
    component: () => import("../views/home/Index.vue"),
  },
  {
    path: "/game",
    name: "Main",
    component: () => import("../views/game/Main.vue"),
  },
  // {
  //     path: "/home",
  //     component: HomeMain,
  //     children: [
  //       { path: 'profile', component: UserProfile }, // 匹配 /user/:id/profile
  //       { path: 'posts', component: UserPosts }       // 匹配 /user/:id/posts
  //     ]
  // },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/home/Login.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/home/Register.vue"),
  },
  {
    path: "/gameManage",
    name: "GameManager",
    component: () => import("../views/home/GameManager.vue"),
  },
  {
    path: "/joinGame",
    name: "JoinGame",
    component: () => import("../views/home/JoinGame.vue"),
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// 需要登录才能访问的路由
const protectedRoutes = ['/game'];

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (protectedRoutes.includes(to.path) && !token) {
    next({ path: '/login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;
