import request from '@/utils/request';
 
export interface LoginParamsType {
  userNumber: string;
  userPassword: string;
  
}
//inspectgetway/login//http://124.204.48.134:800/inspectgetway/login
export async function fakeAccountLogin(params: LoginParamsType) {
  return request('/Common/UnifiedLogin', {
    data: params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
