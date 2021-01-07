import request from '@/utils/request';

export interface cofpPageType {
  beginTime: string;
  endTime: string;
}
// 获取历史抓拍列表
export async function queryCofpList(params: cofpPageType) {
  return request('ff/query/cameraHistory', {
    data: params,
  });
}
