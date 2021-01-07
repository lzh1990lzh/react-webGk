/**
 * 历史抓拍 消防通道抓拍
 */
import { Effect, Reducer } from 'umi';
import { queryCofpList } from '@/services/cofp';

export interface CofpItemType {
  createTime: string;
  dealTime: string;
  dealUser: string;
  id: string;
  isDeal: string;
  phoneNumber: string;
  photoPath: string;
}

export interface CofpModelState {
  list: CofpItemType[];
}

export interface CofpModelType {
  namespace: 'cofp';
  state: CofpModelState;
  effects: {
    queryList: Effect;
  };
  reducers: {
    setList: Reducer;
  };
}

const CofpModel: CofpModelType = {
  namespace: 'cofp',
  state: {
    list: [],
  },
  effects: {
    *queryList({ payload }, { call, put }) {
      const res = yield call(queryCofpList, payload);
      console.log(payload,"----payload");
      console.log(res,"---list");
      let { code, obj } = res;
      if (code !== '0') return;

      yield put({
        type: 'setList',
        payload: obj,
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

export default CofpModel;
