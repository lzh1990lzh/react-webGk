/**
 * 智慧门禁
 */
import { Effect, Reducer } from 'umi';
import {
  queryCarNowData,
  queryCarRank,
  queryCarChartData,
  queryCarTypesGroup,
  queryCarInOutList,
  queryCarTotalNum,
} from '@/services/acc';

export interface CarFaceAliasType {
  inTotalCount: string;
  outTotalCount: string;
  sumCount: string;
}

export interface carChangeTypes {
  inCount: number;
  outCount: number;
  time: string;
}

export interface AccModelState {
  nowData: {}; // 实时数据
  rankList: []; // 30天排行数据
  inOutList: []; // 出入明细
  carChangeList: carChangeTypes[]; // 车流趋势
  inOrOutTypes: []; // 进出类型
  faceRecTotal: number;
  faceAlias: CarFaceAliasType;
  txtIcons: {
    [index: string]: {
      [index: string]: string;
    };
  };
}

export interface AccModelType {
  namespace: 'acc';
  state: AccModelState;
  effects: {
    queryNowData: Effect;
    queryRankList: Effect;
    queryInOutList: Effect;
    queryCarList: Effect;
    queryTypes: Effect;
    queryTotalNum: Effect;
  };
  reducers: {
    setNowData: Reducer;
    setRankList: Reducer;
    setInOutList: Reducer;
    setCarList: Reducer;
    setTypes: Reducer;
    setFaceTotal: Reducer;
    setFaceAlias: Reducer;
  };
}

const AccModel: AccModelType = {
  namespace: 'acc',
  state: {
    nowData: {},
    rankList: [],
    inOutList: [],
    faceRecTotal: 0,
    carChangeList: [],
    inOrOutTypes: [],
    faceAlias: {
      inTotalCount: '0',
      outTotalCount: '0',
      sumCount: '0',
    },
    txtIcons: {
      total: {
        name: '车场剩余车位',
        icon: require('@/assets/icon-acc/icon1.png'),
      },
      intotal: {
        name: '今日总进车数量',
        icon: require('@/assets/icon-acc/icon2.png'),
      },
      outtotal: {
        name: '今日总出车数量',
        icon: require('@/assets/icon-acc/icon3.png'),
      },
      inFaceTotal: {
        name: '今日临时车进/出车数量',
        icon: require('@/assets/icon-acc/icon4.png'),
      },
      inDoorTotal: {
        name: '今日长租车进/出车数量',
        icon: require('@/assets/icon-acc/icon5.png'),
      },
    },
  },
  effects: {
    *queryNowData({ payload }, { call, put }) {
      const res = yield call(queryCarNowData, payload);
      let { returnCode, returnObj } = res;
      if (returnCode !== '0') return;

      yield put({
        type: 'setNowData',
        payload: returnObj,
      });
    },
    *queryRankList({ payload }, { call, put }) {
      const res = yield call(queryCarRank, payload);
      let { returnCode, returnObj } = res;
      if (returnCode !== '0') return;

      yield put({
        type: 'setRankList',
        payload: returnObj,
      });
    },
    *queryInOutList({ payload }, { call, put }) {
      const res = yield call(queryCarInOutList, payload);
      let { returnCode, returnObj } = res;
      if (returnCode !== '0') return;
      if (!returnObj) return;
      let data = JSON.parse(returnObj);
      let { list, total } = data;
      yield put({
        type: 'setInOutList',
        payload: list,
      });
      yield put({
        type: 'setFaceTotal',
        payload: total,
      });
    },
    // 车流
    *queryCarList({ payload }, { call, put }) {
      const res = yield call(queryCarChartData, payload);
      let { returnCode, returnObj } = res;
      if (returnCode !== '0') return;

      yield put({
        type: 'setCarList',
        payload: returnObj,
      });
    },
    *queryTypes(_, { call, put }) {
      const res = yield call(queryCarTypesGroup);
      let { returnCode, returnObj } = res;
      if (returnCode !== '0') return;

      yield put({
        type: 'setTypes',
        payload: returnObj,
      });
    },
    *queryTotalNum({ payload }, { call, put }) {
      const res = yield call(queryCarTotalNum, payload);
      let { returnCode, returnObj } = res;
      if (returnCode !== '0') return;
      if (!returnObj) return;

      yield put({
        type: 'setFaceAlias',
        payload: JSON.parse(returnObj),
      });
    },
  },
  reducers: {
    setNowData(state, { payload }) {
      return {
        ...state,
        nowData: payload || {},
      };
    },
    setRankList(state, { payload }) {
      return {
        ...state,
        rankList: payload || [],
      };
    },
    setFaceTotal(state, { payload }) {
      return {
        ...state,
        faceRecTotal: payload || 0,
      };
    },
    setInOutList(state, { payload }) {
      return {
        ...state,
        inOutList: payload || [],
      };
    },
    setCarList(state, { payload }) {
      return {
        ...state,
        carChangeList: payload || [],
      };
    },
    setTypes(state, { payload }) {
      return {
        ...state,
        inOrOutTypes: payload || [],
      };
    },
    setFaceAlias(state, { payload }) {
      return {
        ...state,
        faceAlias: payload || {
          inTotalCount: '0',
          outTotalCount: '0',
          sumCount: '0',
        },
      };
    },
  },
};

export default AccModel;
