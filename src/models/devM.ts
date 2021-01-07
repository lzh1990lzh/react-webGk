/**
 * 历史报警
 */
import { Effect, Reducer } from 'umi';
import { queryDeviceTypes,queryDeviceStatus, queryWarnList } from '@/services/devM';

export interface DevModelState {
  types: { name: string; id: string }[];
  list: [];
  total: number;
  status:  { name: string; id: string }[];
}

export interface DevModelType {
  namespace: 'dev';
  state: DevModelState;
  effects: {
    queryTypes: Effect;
    queryList: Effect;
    queryStatus: Effect;
  };
  reducers: {
    setTypes: Reducer;
    setList: Reducer;
    setTotal: Reducer;
    setStatus: Reducer;
  };
}

const DevModel: DevModelType = {
  namespace: 'dev',
  state: {
    types: [],
    list: [],
    total: 0,
    status: [],
  },
  effects: {
    *queryTypes(_, { call, put }) {
      const res = yield call(queryDeviceTypes);
      console.log(res,'--res');
      let { code, obj } = res;
      if (code !== '0') {
        yield put({
          type: 'setTypes',
          payload: {},
        });
        return
      };

      yield put({
        type: 'setTypes',
        payload: obj,
      });
    },
    *queryStatus(_, { call, put }) {
      const res = yield call(queryDeviceStatus);
      console.log(res,'--状态');
      let { code, obj } = res;
      if (code !== '0') {
        yield put({
          type: 'setStatus',
          payload: {},
        });
        return
      };

      yield put({
        type: 'setStatus',
        payload: obj,
      });
    },
    *queryList({ payload }, { call, put }) {
      const res = yield call(queryWarnList, payload);
      console.log(payload,"----入参");
      console.log(res,"--列表数据");
      let { code, obj } = res;
      if (code !== '0'){
        yield put({
          type: 'setList',
          payload: [],
        });
        yield put({
          type: 'setTotal',
          payload: {},
        });
        return
      };
      if (!obj){
        yield put({
          type: 'setList',
          payload: [],
        });
        yield put({
          type: 'setTotal',
          payload: {},
        });
        return
      };
      let data = obj;

      let { total, list } = data;
      yield put({
        type: 'setList',
        payload: list,
      });
      yield put({
        type: 'setTotal',
        payload: total,
      });
    },
  },
  reducers: {
    setTypes(state, { payload }) {
      return {
        ...state,
        types: payload || [],
      };
    },
    setStatus(state, { payload }) {
      return {
        ...state,
        status: payload || [],
      };
    },
    setList(state, { payload }) {
      return {
        ...state,
        list: payload || [],
      };
    },
    setTotal(state, { payload }) {
      return {
        ...state,
        total: payload || 0,
      };
    },
  },
};

export default DevModel;
