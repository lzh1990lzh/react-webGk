import request from '@/utils/request';

// 获取左侧设备列表
export async function getLeftNavs() {
  return request('home/query/equipmentList');
}

// 历史报警列表
export async function getHistoryAlarmList() {
  return request('alarm/query/tenHistoryAlarm');
}

