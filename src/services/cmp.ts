import request from '@/utils/request';

export interface CmpPageType {
  beginTime: string;
  endTime: string;
  userName: string;
  idCard: string;
  crimeId: string;
}

// 社区人员管理：黑名单列表
export async function queryCmpList(params: CmpPageType) {
  return request('query/blackList', {
    data: params,
  });
}

// 犯罪类型
export async function queryCrimeTypes() {
  return request('query/crimeType');
}

// 添加黑名单
export async function addCmp(param: FormData) {
  return request('save/blackList', {
    data: param
  })
}


// 删除
export async function deleteCmp(param: { faceToken: string }) {
  return request('delete/blackList', {
    data: param
  })
}
