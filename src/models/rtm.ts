/**
 * 实时监控
 */
import { Effect, Reducer } from 'umi';
import { queryMonitorList } from '@/services/rtm';

export interface RtmModelState {
  list: [];
}

export interface RtmModelType {
  namespace: 'rtm';
  state: RtmModelState;
  effects: {
    queryList: Effect;
  };
  reducers: {
    setList: Reducer;
  };
}

const PotModel: RtmModelType = {
  namespace: 'rtm',
  state: {
    list: [],
  },
  effects: {
    *queryList(_, { call, put }) {
      const res = yield call(queryMonitorList);
      let { returnCode, returnObj } = res;
      if (returnCode !== '0') return;

      yield put({
        type: 'setList',
        payload: JSON.parse(returnObj),
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
  },
};

export default PotModel;
