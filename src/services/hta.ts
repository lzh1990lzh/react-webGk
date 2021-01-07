import request from '@/utils/request';

export interface htaPageType extends PageType {
  type?: string;
  beginTime?: string;
  endTime?: string;
}

interface dealAlarmTypes {
  id: string;
  dealUser: string;
}
// 获取报警类型
export async function queryWarnTypes() {
  return request('alarm/query/getAlarmType');
}

// 获取报警列表
export async function queryWarnList(params: htaPageType) {
  return request('alarm/query/historyByTypeAndTime', {
    data: params,
  });
}

// 处理报警
export async function dealAlarm(params: dealAlarmTypes) {
  return request('alarm/query/alarm/deal', {
    data: params,
  });
}
