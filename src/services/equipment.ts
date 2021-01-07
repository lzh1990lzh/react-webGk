import request from '@/utils/request';

// 获取设备列表
export async function getLeftNavs() {
  return request('home/query/equipmentList');
}

// 获取设备详细信息
export async function getEqInfo(params: { id: string }) {
  return request('query/equipmentInfoByid', {
    data: params,
  });
}
