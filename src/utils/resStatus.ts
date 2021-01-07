import { notification } from 'antd';

const codeMessage = ['500'];
/**
 *
 * @param res 返回结果统一处理
 */
export function mergeRes(req: any, res: any) {
  const { code, msg } = res;
  const { url } = req;
  if (code === '0') {
    Object.assign(res, {
      status: 'ok',
    });
  } else if (codeMessage.indexOf(code) !== -1) {
    notification.error({
      message: `请求错误 ${url}`,
      description: msg,
    });
  } else {
    Object.assign(res, {
      status: 'error',
    });
  }
  // return res;
}
