import request from '@/utils/request';

// 获取设备房间设备列表
export async function queryRoomEqList(params: { roomId: string }) {
  return request('er/query/pointListByRoomId', {
    data: params,
  });
}

// 获取设备房间设备信息列表
export async function queryRoomEqInfoList(params: { roomId: string }) {
  return request('er/query/EquipmentListByRoomId', {
    data: params,
  });
}
