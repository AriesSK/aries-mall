import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  // 将空路径重定向至 home，防止空页面
  {
    path: '/',
    name: 'home',
    redirect: 'home'
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    meta: {
      index: 1 // 设定为第一级
    }
  },
  {
    path: '/category',
    name: 'category',
    // 路由懒加载 借助 webpack 的 import() 实现异步组件 并且通过注释实现 webpack 代码分块
    component: () => import(/* webpackChunkName: "about" */ '../views/Category.vue'),
    meta: {
      index: 1
    }
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import(/* webpackChunkName: "about" */ '../views/Cart.vue'),
    meta: {
      index: 1
    }
  },
  {
    path: '/user',
    name: 'user',
    component: () => import(/* webpackChunkName: "about" */ '../views/User.vue'),
    meta: {
      index: 1
    }
  },
  {
    path: '/detail',
    name: 'detail',
    component: () => import(/* webpackChunkName: "about" */ '../views/Detail.vue'),
    meta: {
      index: 2
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    meta: {
      index: 2
    }
  },
  {
    path: '/product-list',
    name: 'product-list',
    component: () => import(/* webpackChunkName: "product-list" */ '../views/ProductList.vue'),
    meta: {
      index: 2
    }
  },
  {
    // 动态路由：将给定匹配模式的路由映射到同一个组件
    // :id 表示路径参数，在组件中通过 this.$route.params 获取
    path: '/product/:id',
    name: 'product',
    component: () => import(/* webpackChunkName: "product" */ '../views/ProductDetail.vue'),
    meta: {
      index: 3
    }
  },
  {
    path: '/create-order',
    name: 'create-order',
    component: () => import(/* webpackChunkName: "create-order" */ '../views/CreateOrder.vue'),
    meta: {
      index: 2
    }
  },
  {
    path: '/address',
    name: 'address',
    component: () => import(/* webpackChunkName: "address" */ '../views/Address.vue'),
    meta: {
      index: 2
    }
  },
  {
    path: '/address-edit',
    name: 'address-edit',
    component: () => import(/* webpackChunkName: "address-edit" */ '../views/AddressEdit.vue'),
    meta: {
      index: 3
    }
  },
  {
    path: '/order',
    name: 'order',
    component: () => import(/* webpackChunkName: "order" */ '../views/Order.vue'),
    meta: {
      index: 2
    }
  },
  {
    path: '/setting',
    name: 'setting',
    component: () => import(/* webpackChunkName: "setting" */ '../views/Setting.vue'),
    meta: {
      index: 2
    }
  }
]

const router = new VueRouter({
  routes,
  // scrollBehavior 可以自定义滚动行为
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      // 若回退页面，则返回 savedPosition，不需要滚动至页面顶部
      return savedPosition
    } else {
      // 若跳转新页面，滚动至页面顶部
      return { x: 0, y: 0 }
    }
  }
})

export default router
