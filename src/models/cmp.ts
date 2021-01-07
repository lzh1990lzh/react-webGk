/**
 * 历史抓拍 消防通道抓拍
 */
import { Effect, Reducer } from 'umi';
import { queryCmpList, queryCrimeTypes } from '@/services/cmp';

export interface CmpItemType {
  createTime: string;
  crimeName: string;
  username: string;
  id: string;
  gender: string;
  birthday: string;
  photoPath: string;
  idCard: string;
  faceToken: string;
}

export interface CrimeItemType {
  id: string;
  name: string;
}

export interface CmpModelState {
  list: CmpItemType[];
  crimeList: CrimeItemType[];
}

export interface CmpModelType {
  namespace: 'cmp';
  state: CmpModelState;
  effects: {
    queryList: Effect;
    queryCrimeList: Effect;
  };
  reducers: {
    setList: Reducer;
    setCrimeList: Reducer;
  };
}

const CmpModel: CmpModelType = {
  namespace: 'cmp',
  state: {
    list: [],
    crimeList: [],
  },
  effects: {
    *queryList({ payload }, { call, put }) {
      const res = yield call(queryCmpList, payload);
      let { returnCode, returnObj } = res;
      if (returnCode !== '0') return;

      yield put({
        type: 'setList',
        payload: JSON.parse(returnObj),
      });
    },
    *queryCrimeList(_, { call, put }) {
      const res = yield call(queryCrimeTypes);
      let { returnCode, returnObj } = res;
      if (returnCode !== '0') return;
      yield put({
        type: 'setCrimeList',
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
    setCrimeList(state, { payload }) {
      return {
        ...state,
        crimeList: payload || [],
      };
    },
  },
};

export default CmpModel;
