/**
 * 历史报警
 */
import { Effect, Reducer } from 'umi';
import { queryWarnTypes, queryWarnList } from '@/services/hta';

export interface HtaModelState {
  types: { name: string; id: string }[];
  list: [];
  total: number;
}

export interface HtaModelType {
  namespace: 'hta';
  state: HtaModelState;
  effects: {
    queryTypes: Effect;
    queryList: Effect;
  };
  reducers: {
    setTypes: Reducer;
    setList: Reducer;
    setTotal: Reducer;
  };
}

const HtaModel: HtaModelType = {
  namespace: 'hta',
  state: {
    types: [],
    list: [],
    total: 0,
  },
  effects: {
    *queryTypes(_, { call, put }) {
      const res = yield call(queryWarnTypes);
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

export default HtaModel;
