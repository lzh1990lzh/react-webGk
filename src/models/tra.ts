/**
 * 人像轨迹
 */
import { Effect, Reducer } from 'umi';
import { queryPotList } from '@/services/tra';

export interface PotModelState {
  list: [];
  total: number;
}

export interface PotModelType {
  namespace: 'tra';
  state: PotModelState;
  effects: {
    queryList: Effect;
  };
  reducers: {
    setList: Reducer;
    setTotal: Reducer;
  };
}

const PotModel: PotModelType = {
  namespace: 'tra',
  state: {
    list: [],
    total: 0,
  },
  effects: {
    *queryList({ payload }, { call, put }) {
      const res = yield call(queryPotList, payload);
      console.log(payload,"---参数")
      console.log(res,"-----list");
      let { code, obj } = res;
      if (code !== '0') {
        yield put({
          type: 'setList',
          payload: [],
        });
        yield put({
          type: 'setTotal',
          payload: {},
        });
      }
      if (!obj) {
        yield put({
          type: 'setList',
          payload: [],
        });
        yield put({
          type: 'setTotal',
          payload: {},
        });
        return 
      }
      let data = obj;

      let { total, list } = data;
      // total=data;
      // list=data;
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

export default PotModel;
