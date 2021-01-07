import request from '@/utils/request';

export interface crpaPageType extends PageType {
  roomId?: string;
  beginTime?: string;
  endTime?: string;
}
// 获取设备列表
export async function queryCrpaList(params: crpaPageType) {
  return request('ds/query/getRoomCameraList', {
    data: params,
  });
}
