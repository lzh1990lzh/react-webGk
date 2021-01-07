import request from '@/utils/request';

export interface cofpPageType {
  beginTime: string;
  endTime: string;
}
// 获取左侧导航数据
export async function queryMonitorList(params: cofpPageType) {
  return request('query/monitorUrlList', {
    data: params,
  });
}
