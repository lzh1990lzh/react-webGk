import request from '@/utils/request';

interface paramsType {
  beginTime: string;
  endTime: string;
}

export interface inOrOutParamsTypes extends paramsType {
  pageNum: number;
  pageSize: number;
  inOrOut?: string;
  errorFlag?: string;
  recType?: string;
}
// 实时数据
export async function queryCarNowData(params: paramsType) {
  return request('carpark/realtimeData', {
    data: params,
  });
}

// 车流量分支趋势
export async function queryCarChartData(params: paramsType) {
  return request('carpark/sevenDay', {
    data: params,
  });
}

// 30天使用排行
export async function queryCarRank(params: paramsType) {
  return request('carpark/monthRank', {
    data: params,
  });
}

// 出入明细
export async function queryCarInOutList(params: inOrOutParamsTypes) {
  return request('carpark/crossDetailList', {
    data: params,
  });
}

// 类型数据
export async function queryCarTypesGroup() {
  return request('carpark/status');
}

// 门禁出入统计总数
export async function queryCarTotalNum(params: inOrOutParamsTypes) {
  return request('carpark/crossDetailSum', {
    data: params,
  });
}
