/**
 * 底部导航
 */
import PUBLIC_URL from '@/utils/address';
import { Effect, Reducer } from 'umi';
import { getLeftNavs, getHistoryAlarmList } from '@/services/menus';

export interface MenuItemType {
  name: string;
  icon?: string;
  type?: string;
  path?: string;
  id?: string;
  link?: 'view' | 'blank' | 'outblank';  // view 内部打开   blank 打开新窗口  outblank 跳转外部链接
  children?: MenuItemType[];
}

export interface NavItemType {
  count: string;
  sensorName: string;
  type: string;
}

export interface CtrsItemType {
  // name: string;
  // type: string;
  // icon: string;
  name: string;
  icon?: string;
  type?: string;
  path?: string;
  id?: string;
  link?: 'view' | 'blank' | 'outblank';  // view 内部打开   blank 打开新窗口  outblank 跳转外部链接 
  children?: CtrsItemType[];
}

export interface AlarmItemType {
  equipmentName: string;
  equipmentNumber: string;
  equipmentSite: string;
  id: string;
  level: string;
}

export interface MenuModelState {
  showAlarm: Boolean;
  leftNavTitle: string;
  leftnavs: NavItemType[];
  rightCtrs: CtrsItemType[];
  alarmList: AlarmItemType[];
  bottomlist: MenuItemType[];
}

export interface MenuModelType {
  namespace: 'menu';
  state: MenuModelState;
  effects: {
    queryNavList: Effect;
    queryAlarmList: Effect;
    resetAlarm: Effect;
  };
  reducers: {
    setNavs: Reducer;
    setTitle: Reducer;
    setShowAlarm: Reducer;
    setAlarmList: Reducer;
  };
}

const MenuModel: MenuModelType = {
  namespace: 'menu',
  state: {
    showAlarm: false,
    leftNavTitle: '',
    leftnavs: [],
    rightCtrs: [
      {
        name: '报警管理',
        type: 'alarm',
        icon: require('@/assets/icon-rnav/bj.png'),
      },
      {
        name: '数据汇总',
        type: 'total',
        icon: require('@/assets/icon-rnav/tjfx.png'),
        children:[
         {
          name: '社区数据汇总',
          type: 'totalR',
          id: '1',
          link: 'view'
         },
        ],
      },
      {
        name: '设备管理',
        type: 'devM',
        icon: require('@/assets/icon-rnav/bj.png'),
      },
    ],
    alarmList: [],
    bottomlist: [
      {
        name: '首页',
        icon: '',
        type: 'home',
      },
      {
        name: '机房感知',
        icon: require('@/assets/icon-menu/jfgz.png'),
        children: [
          {
            name: '南泵房',
            type: 'eqdroom',
            id: '1',
            link: 'view'
          },
          {
            name: '北泵房',
            type: 'eqdroom',
            id: '2',
            link: 'view'
          },
          {
            name: '配电室',
            children: [
              {
                name: '12#配电室',
                type: 'eqdroom',
                id: '3',
                link: 'view'
              },
              {
                name: '13#配电室',
                type: 'eqdroom',
                id: '8',
                link: 'view'
              },
              {
                name: '14#配电室',
                type: 'eqdroom',
                id: '4',
                link: 'view'
              },
              {
                name: '15#配电室',
                type: 'eqdroom',
                id: '6',
                link: 'view'
              },
              {
                name: '19#配电室',
                type: 'eqdroom',
                id: '7',
                link: 'view'
              },
              {
                name: '20#配电室',
                type: 'eqdroom',
                id: '10',
                link: 'view'
              },
              {
                name: '21#配电室',
                type: 'eqdroom',
                id: '9',
                link: 'view'
              },
              {
                name: '23#配电室',
                type: 'eqdroom',
                id: '5',
                link: 'view'
              },
            ],
          },
          {
            name: '机房人员进出',
            type: 'crpa',
            link: 'blank'
          },
        ],
      },
      {
        name: '智慧消防',
        icon: require('@/assets/icon-menu/bxfb.png'),
        children: [
          {
            name: '消防通道抓拍',
            type: 'cofp',
            link: 'blank'
          },
        ],
      },
      {
        name: '智慧安防',
        icon: require('@/assets/icon-menu/bzhaf.png'),
        children: [
          {
            name: '实时监控',
            type: 'rtm',
            link: 'blank'
          },
          {
            name: '社区人员管理',
            type: 'cmp',
            link: 'blank'
          },
          {
            name: '人像轨迹',
            type: 'pot',
            link: 'blank'
          },
          {
            name: '智慧门禁',
            type: 'act',
            link: 'blank'
          },
          {
            name: '智慧停车',
            type: 'acc',
            link: 'blank'
          },
        ],
      },
      {
        name: '智慧巡检',
        icon: require('@/assets/icon-menu/bxjgl.png'),
        path: `${PUBLIC_URL['xj']}`,
        link: 'outblank'
      },
    ],
  },
  effects: {
    *queryNavList(_, { call, put }) {
      const res = yield call(getLeftNavs);
      let { code, obj } = res;
      console.log(res,"---res--nav");
      console.log(obj,"---obj");
      console.log(code,"---code");
      
      if (code === '0') {
        let data =obj;
        yield put({
          type: 'setNavs',
          payload: data,
        });
      }
    },
    *queryAlarmList(_, { call, put }) {
      const res = yield call(getHistoryAlarmList);
      let { code, obj } = res;
      if (code === '0') {
        let data = obj;
        yield put({
          type: 'setAlarmList',
          payload: data,
        });

        yield put({
          type: 'setTitle',
          payload: '警报列表',
        });

        yield put({
          type: 'setShowAlarm',
          payload: true,
        });
      }
    },
    *resetAlarm(_, { put }) {
      yield put({
        type: 'setTitle',
        payload: '',
      });

      yield put({
        type: 'setShowAlarm',
        payload: false,
      });
    },
  },
  reducers: {
    setNavs(state, { payload }) {
      return {
        ...state,
        leftnavs: payload || [],
      };
    },
    setTitle(state, { payload }) {
      return {
        ...state,
        leftNavTitle: payload || '',
      };
    },
    setShowAlarm(state, { payload }) {
      return {
        ...state,
        showAlarm: payload || false,
      };
    },
    setAlarmList(state, { payload }) {
      return {
        ...state,
        alarmList: [...payload] || [],
      };
    },
  },
};

export default MenuModel;
