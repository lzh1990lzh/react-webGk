import request from '@/utils/request';

export interface potPageType extends PageType {
  beginTime?: string;
  endTime?: string;
}

// 获取黑名单报警列表
export async function queryPotList(params: potPageType) {
  let param = { ...params };
  Object.assign(param, {
    userType: '0',
    faceToken: '',
  });
  return request('sec/query/historyAlarmOfImage', {
    data: param,
  });
}
