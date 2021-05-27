import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [{
  path: '/home',
  name: 'Home',
  component: Home,
  children: [{
      path: '/platform',
      component: () => import( /* webpackChunkName: "platform" */ '../components/platform.vue')
    },
    {
      path: '/role',
      component: () => import( /* webpackChunkName: "role" */ '../components/role.vue')
    },
    {
      path: '/admin',
      component: () => import( /* webpackChunkName: "admin" */ '../components/admin.vue')
    },
    {
      path: '/right',
      component: () => import( /* webpackChunkName: "right" */ '../components/right.vue')
    },
    {
      path: '/welcome',
      component: () => import( /* webpackChunkName: "welcome" */ '../components/welcome.vue')
    },
    {
      path: '/ban',
      component: () => import( /* webpackChunkName: "ban" */ '../components/ban.vue')
    },
    {
      path: '/client',
      component: () => import( /* webpackChunkName: "client" */ '../components/client.vue')
    },
    {
      path: '/operator',
      component: () => import( /* webpackChunkName: "operator" */ '../components/operator.vue')
    },
    {
      path: '/history',
      component: () => import( /* webpackChunkName: "history" */ '../components/history.vue')
    }
  ]
}, {
  path: "/login",
  name: 'Login',
  component: () => import( /* webpackChunkName: "login" */ '../views/login.vue')
}]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


router.beforeEach((to, from, next) => {
  //超级管理员放行所有
  if (to.path === '/login') return next();
  if (to.path === '/') return next('/login');
  const tokenStr = window.sessionStorage.getItem("token")
  if (!tokenStr) {
    return next('/login')
  }
  const user = window.sessionStorage.getItem("user")
  if (JSON.parse(user).adminCode == 'root') {
    return next()
  }
  //路径权限判断

  if (to.path == '/welcome') {
    //是welcome
    return next()
  }

  if (to.path == "/ban") {
    //ban
    return next()
  }

  let flagNext = false
  flagNext = false
  const right = window.sessionStorage.getItem("right")
  let rightJson = JSON.parse(right)

  rightJson.forEach(item => {
    console.log(item.rightUrl);
    if (to.path.indexOf(item.rightUrl) != -1) {
      //进来证明有权限
      flagNext = true
    }
  });
  if (!flagNext) {
    Vue.prototype.$message.error("当前账户没有此项操作权限")
    return next(from)
  }else{
    return next()
  }
})
//路由权限控制

export default router
