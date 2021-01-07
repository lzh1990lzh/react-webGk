import request from '@/utils/request';

export interface htaPageType extends PageType {
  type?: string;
  beginTime?: string;
  endTime?: string;
  status? :string;
}

interface dealAlarmTypes {
  id: string;
  dealUser: string;
}
// 获取设备类型
export async function queryDeviceTypes() {
  return request('ds/query/equipmentTypeList');
}
// 获取设备状态
export async function queryDeviceStatus() {
  return request('ds/query/equipmentStatusList');
}

// 获取设备列表
export async function queryWarnList(params: htaPageType) {
  return request('ds/query/equipments', {
    data: params,
  });
}

// 处理报警
export async function dealAlarm(params: dealAlarmTypes) {
  return request('alarm/query/alarm/deal', {
    data: params,
  });
}
