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
export async function queryNowData(params: paramsType) {
  return request('sec/query/detectionData', {
    data: params,
  });
}

// 人流量分支趋势
export async function queryPeopleChartData(params: paramsType) {
  return request('sec/query/personFlow', {
    data: params,
  });
}

// 30天使用排行
export async function queryAcRank(params: paramsType) {
  return request('sec/query/entranceGuard', {
    data: params,
  });
}

// 出入明细
export async function queryFaceRec(params: inOrOutParamsTypes) {
  return request('sec/query/getFaceRec', {
    data: params,
  });
}

// 类型数据
export async function queryActTypesGroup() {
  return request('sec/query/getBaseData');
}

// 门禁出入统计总数
export async function queryActTotalNum(params: inOrOutParamsTypes) {
  return request('sec/query/getFaceRecData', {
    data: params,
  });
}
