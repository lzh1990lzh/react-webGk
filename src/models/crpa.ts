/**
 * 人员进出
 */
import { Effect, Reducer } from 'umi';
import { queryCrpaList } from '@/services/crpa';

export interface CrpaModelState {
  roomList: { name: string; value: string }[];
  list: [];
  total: number;
}

export interface CrpaModelType {
  namespace: 'crpa';
  state: CrpaModelState;
  effects: {
    queryList: Effect;
  };
  reducers: {
    setList: Reducer;
    setTotal: Reducer;
  };
}

const CrpaModel: CrpaModelType = {
  namespace: 'crpa',
  state: {
    roomList: [
      {
        name: '南泵房',
        value: '1',
      },
      {
        name: '北泵房',
        value: '2',
      },
      {
        name: '12#配电室',
        value: '3',
      },
      {
        name: '14#配电室',
        value: '4',
      },
      {
        name: '23#配电室',
        value: '5',
      },
      {
        name: '15#配电室',
        value: '6',
      },
      {
        name: '19#配电室',
        value: '7',
      },
      {
        name: '13#配电室',
        value: '8',
      },
      {
        name: '21#配电室',
        value: '9',
      },
      {
        name: '20#配电室',
        value: '10',
      },
    ],
    list: [],
    total: 0,
  },
  effects: {
    *queryList({ payload }, { call, put }) {
      const res = yield call(queryCrpaList, payload);
      console.log(payload,"--入参");
      console.log(res,"---列表数据");
      let { code, obj } = res;
     
      if (code !== '0') {
        yield put({
          type: 'setList',
          payload: [],
        });
        yield put({
          type: 'setPage',
          payload: {},
        });
        return 
      };
      if (!obj) {
        yield put({
          type: 'setList',
          payload: [],
        });
        yield put({
          type: 'setPage',
          payload: {},
        });
        return 
      }
      let data = obj;
      
      let { total, list } = data;
      yield put({
        type: 'setList',
        payload: list ,
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

export default CrpaModel;
