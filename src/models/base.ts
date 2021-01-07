/**
 * 外部跳转链接
 */
export interface BaseModelState {}

export interface BaseModelType {
  namespace: 'base';
  state: BaseModelState;
}

const BaseModel: BaseModelType = {
  namespace: 'base',
  state: {},
};

export default BaseModel;
