/**
 * 智慧门禁
 */
import { Effect, Reducer } from 'umi';
import {
  queryNowData,
  queryAcRank,
  queryFaceRec,
  queryPeopleChartData,
  queryActTypesGroup,
  queryActTotalNum,
} from '@/services/act';

export interface FaceAliasType {
  in: string;
  out: string;
  total: string;
}

export interface peopleTypes {
  inCount: number;
  outCount: number;
  time: string;
}

export interface ActModelState {
  nowData: {}; // 实时数据
  rankList: []; // 30天排行数据
  faceRecList: []; // 出入明细
  peopleList: peopleTypes[]; // 人流趋势
  inOrOutTypes: []; // 进出类型
  errorTypes: []; // 异常类型
  recTypes: []; // 识别类型
  faceRecTotal: number;
  faceAlias: FaceAliasType;
  txtIcons: {
    [index: string]: {
      [index: string]: string;
    };
  };
}

export interface ActModelType {
  namespace: 'act';
  state: ActModelState;
  effects: {
    queryNowData: Effect;
    queryRankList: Effect;
    queryFaceRecList: Effect;
    queryPeopleList: Effect;
    queryTypes: Effect;
    queryActTotalNum: Effect;
  };
  reducers: {
    setNowData: Reducer;
    setRankList: Reducer;
    setFaceList: Reducer;
    setPeopleList: Reducer;
    setTypes: Reducer;
    setFaceTotal: Reducer;
    setFaceAlias: Reducer;
  };
}

const ActModel: ActModelType = {
  namespace: 'act',
  state: {
    nowData: {},
    rankList: [],
    faceRecList: [],
    faceRecTotal: 0,
    peopleList: [],
    inOrOutTypes: [],
    errorTypes: [],
    recTypes: [],
    faceAlias: {
      in: '0',
      out: '0',
      total: '0',
    },
    txtIcons: {
      total: {
        name: '小区用户总数',
        icon: require('@/assets/icon-act/icon1.png'),
      },
      intotal: {
        name: '今日进门总人次',
        icon: require('@/assets/icon-act/icon2.png'),
      },
      outtotal: {
        name: '今日出门总人次',
        icon: require('@/assets/icon-act/icon3.png'),
      },
      inFaceTotal: {
        name: '今日进口人脸总人次',
        icon: require('@/assets/icon-act/icon4.png'),
      },
      inDoorTotal: {
        name: '今日进口门禁总人次',
        icon: require('@/assets/icon-act/icon5.png'),
      },
      tempUnusual: {
        name: '进口测温异常总人次',
        icon: require('@/assets/icon-act/icon6.png'),
      },
      faceDoor: {
        name: '进口人脸/门禁占比',
        icon: require('@/assets/icon-act/icon7.png'),
      },
      tempIndex: {
        name: '进口测温异常占比',
        icon: require('@/assets/icon-act/icon8.png'),
      },
    },
  },
  effects: {
    *queryNowData({ payload }, { call, put }) {
      const res = yield call(queryNowData, payload);
      let { code, obj } = res;
      if (code !== '0') {
        yield put({
          type: 'setNowData',
          payload: {},
        });
        return
      }

      yield put({
        type: 'setNowData',
        payload: obj,
      });
    },
    *queryRankList({ payload }, { call, put }) {
      const res = yield call(queryAcRank, payload);
      let { code, obj } = res;
      if (code !== '0') {
        yield put({
          type: 'setRankList',
          payload: {},
        });
        return
      }

      yield put({
        type: 'setRankList',
        payload: obj,
      });
    },
    *queryFaceRecList({ payload }, { call, put }) {
      const res = yield call(queryFaceRec, payload);
      console.log(res,"---出人明细数据");
      console.log(payload,"--payload");

      let { code, obj } = res;
      if (code !== '0') {
        yield put({
          type: 'setFaceList',
          payload: [],
        });
        yield put({
          type: 'setFaceTotal',
          payload: {},
        });
        return
      }
      if (!obj) {
        yield put({
          type: 'setFaceList',
          payload: [],
        });
        yield put({
          type: 'setFaceTotal',
          payload: {},
        });
        return
      }
      let data = obj;
      let { list, total } = data;
      yield put({
        type: 'setFaceList',
        payload: list,
      });
      yield put({
        type: 'setFaceTotal',
        payload: total,
      });
    },
    *queryPeopleList({ payload }, { call, put }) {
      const res = yield call(queryPeopleChartData, payload);
      let { code, obj } = res;
      if (code !== '0') return;

      yield put({
        type: 'setPeopleList',
        payload: obj,
      });
    },
    *queryTypes(_, { call, put }) {
      const res = yield call(queryActTypesGroup);
      let { code, obj } = res;
      if (code !== '0') return;

      yield put({
        type: 'setTypes',
        payload: obj,
      });
    },
    *queryActTotalNum({ payload }, { call, put }) {
      const res = yield call(queryActTotalNum, payload);
      let { code, obj } = res;
      if (code !== '0') return;
      if (!obj) return;

      yield put({
        type: 'setFaceAlias',
        payload: obj,
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
    setFaceList(state, { payload }) {
      return {
        ...state,
        faceRecList: payload || [],
      };
    },
    setPeopleList(state, { payload }) {
      return {
        ...state,
        peopleList: payload || [],
      };
    },
    setTypes(state, { payload }) {
      return {
        ...state,
        inOrOutTypes: (payload && payload.inOrOut) || [],
        errorTypes: (payload && payload.error) || [],
        recTypes: (payload && payload.recType) || [],
      };
    },
    setFaceAlias(state, { payload }) {
      return {
        ...state,
        faceAlias: payload || {
          in: '0',
          out: '0',
          total: '0',
        },
      };
    },
  },
};

export default ActModel;
