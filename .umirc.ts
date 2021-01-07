import { defineConfig } from 'umi';

export default defineConfig({
  // nodeModulesTransform: {
  //   type: 'none',
  // },
  hash: true,
  history: {
    type: 'hash',
  },
  favicon: 'bh-favicon.png',
  title: '社区动脉物管综合管控云服务平台 — 双桥六号井',
  antd: {},
  locale: {
    antd: true,
  },
  dva: {
    immer: true,
    hmr: false,
  },
  // base: '/lfnl/',
  // publicPath: '/lfnl/',
  // proxy: {
  //   '/api/': {
  //     // target: 'https://preview.pro.ant.design',
  //     target: 'http://39.97.227.181',
  //     changeOrigin: true,
  //     pathRewrite: { '^': '' },
  //   },
  // },
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: '登录',
      component: '@/pages/login/index'
    },
    {
      path: '/home',
      name: '首页',
      component: '@/pages/home/index'
    },
    {
      path: '/crpa',
      name: '人员进出',
      title: '人员进出',
      exact: true,
      component: '@/pages/crpa/index',
    },
    {
      path: '/cofp',
      name: '消防通道抓拍',
      title: '消防通道抓拍',
      exact: true,
      component: '@/pages/cofp/index',
    },
    {
      path: '/cmp',
      name: '社区人员管理',
      title: '社区人员管理',
      exact: true,
      component: '@/pages/cmp/index',
    },
    {
      path: '/hta',
      name: '历史报警',
      title: '历史报警',
      exact: true,
      component: '@/pages/hta/index',
    },
    {
      path: '/pot',
      name: '黑名单报警',
      title: '黑名单报警',
      exact: true,
      component: '@/pages/pot/index',
    },
    {
      path: '/tra',
      name: '人像轨迹',
      title: '人像轨迹',
      exact: true,
      component: '@/pages/tra/index',
    },
    {
      path: '/act',
      name: '智慧门禁',
      title: '智慧门禁',
      exact: true,
      component: '@/pages/act/index',
    },
    {
      path: '/acc',
      name: '智慧停车',
      title: '智慧停车',
      exact: true,
      component: '@/pages/acc/index',
    },
    {
      path: '/rtm',
      name: '实时监控',
      title: '实时监控',
      exact: true,
      component: '@/pages/rtm/index',
    },
    {
      path: '/devM',
      name: '设备管理',
      title: '设备管理',
      exact: true,
      component: '@/pages/devM/index',
    },
  ],
});
