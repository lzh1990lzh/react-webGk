/**
 *  设备房
 */
import { Effect, Reducer } from 'umi';
import { queryRoomEqList, queryRoomEqInfoList } from '@/services/equipmentroom';

/**
 * 设备列表
 */
export interface PointItemType {
  building: string;
  domain: string;
  id: string;
  status: string;
  storey: string;
  type: string;
  unit: string;
  x: string;
  y: string;
  z: string;
}
/**
 * 设备信息列表
 */
export interface PointDataItemType {
  equipmentName: string;
  equipmentNumber: string;
  equipmentSite: string;
  equipmentType: string;
  humidityUsualValue: string;
  humidityValue: string;
  inUsualValue: string;
  inValue: string;
  monitorTime: string;
  monitorValue: string;
  outUsualValue: string;
  outValue: string;
  s1: string;
  s2: string;
  status: string;
  temperatureUsualValue: string;
  temperatureValue: string;
  usualValue: string;
}

export interface EQRoomModelState {
  pointList: PointItemType[][];
  dataList: PointDataItemType[];
}

export interface EQRoomModelType {
  namespace: 'eqroom';
  state: EQRoomModelState;
  effects: {
    queryPointList: Effect;
    queryDataList: Effect;
  };
  reducers: {
    setPointList: Reducer;
    setDataList: Reducer;
  };
}

const EQRoomModel: EQRoomModelType = {
  namespace: 'eqroom',
  state: {
    pointList: [],
    dataList: [],
  },
  effects: {
    *queryPointList({ payload }, { call, put }) {
      const res = yield call(queryRoomEqList, payload);
      console.log(res,"--导航数据");
      let { code, obj } = res;
      if (code === '0') {
        let list = obj;
        list = list.filter((item: PointItemType) => item);
        let types: string[] = [];
        list.forEach((item: PointItemType) => {
          if (item && types.indexOf(item.type) == -1) {
            types.push(item.type);
          }
        });

        let alllist = [];
        for (let i = 0; i < types.length; i++) {
          let arr = [];

          for (var j = 0; j < list.length; j++) {
            if (list[j].type == types[i]) {
              arr.push(list[j]);
            }
          }
          alllist.push(arr);
        }
        yield put({
          type: 'setPointList',
          payload: alllist,
        });
      }
    },
    *queryDataList({ payload }, { call, put }) {
      const res = yield call(queryRoomEqInfoList, payload);
      console.log(res,"---res数据");
      let { code, obj } = res;
      if (code === '0') {
        yield put({
          type: 'setDataList',
          payload: obj,
        });
      }
    },
  },
  reducers: {
    setPointList(state, { payload }) {
      return {
        ...state,
        pointList: [...payload] || [],
      };
    },
    setDataList(state, { payload }) {
      return {
        ...state,
        dataList: [...payload] || [],
      };
    },
  },
};

export default EQRoomModel;
