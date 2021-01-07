/**
 *  设备房
 */
import { Effect, Reducer } from 'umi';

export interface EQIconTypes {
  [index: string]: {
    [index: string]: string;
  };
}

/**
 * 设备列表
 */
export interface PointItemType {}
/**
 * 设备信息列表
 */
export interface PointDataItemType {}

export interface EquipmentModelState {
  eqIcons: EQIconTypes;
  eqRIcons: IconsType;
  list: [];
}

export interface EquipmentModelType {
  namespace: 'equipment';
  state: EquipmentModelState;
}

const EquipmentModel: EquipmentModelType = {
  namespace: 'equipment',
  state: {
    eqIcons: {
      '1': {
        '-1': require('@/assets/icon--map-red/1.png'),
        '0': require('@/assets/icon--map-yellow/1.png'),
        '1': require('@/assets/icon--map-green/1.png'),
      },
      '2': {
        '-1': require('@/assets/icon--map-red/2.png'),
        '0': require('@/assets/icon--map-yellow/2.png'),
        '1': require('@/assets/icon--map-green/2.png'),
      },
      '3': {
        '-1': require('@/assets/icon--map-red/3.png'),
        '0': require('@/assets/icon--map-yellow/3.png'),
        '1': require('@/assets/icon--map-green/3.png'),
      },
      '4': {
        '-1': require('@/assets/icon--map-red/4.png'),
        '0': require('@/assets/icon--map-yellow/4.png'),
        '1': require('@/assets/icon--map-green/4.png'),
      },
      '5': {
        '-1': require('@/assets/icon--map-red/5.png'),
        '0': require('@/assets/icon--map-yellow/5.png'),
        '1': require('@/assets/icon--map-green/5.png'),
      },
      '6': {
        '-1': require('@/assets/icon--map-red/6.png'),
        '0': require('@/assets/icon--map-yellow/6.png'),
        '1': require('@/assets/icon--map-green/6.png'),
      },
      '7': {
        '-1': require('@/assets/icon--map-red/7.png'),
        '0': require('@/assets/icon--map-yellow/7.png'),
        '1': require('@/assets/icon--map-green/7.png'),
      },
      '10': {
        '-1': require('@/assets/icon--map-red/10.png'),
        '0': require('@/assets/icon--map-yellow/10.png'),
        '1': require('@/assets/icon--map-green/10.png'),
      },
      '11': {
        '-1': require('@/assets/icon--map-red/11.png'),
        '0': require('@/assets/icon--map-yellow/11.png'),
        '1': require('@/assets/icon--map-green/11.png'),
      },
      '12': {
        '-1': require('@/assets/icon--map-red/12.png'),
        '0': require('@/assets/icon--map-yellow/12.png'),
        '1': require('@/assets/icon--map-green/12.png'),
      },
      '13': {
        '-1': require('@/assets/icon--map-red/13.png'),
        '0': require('@/assets/icon--map-yellow/13.png'),
        '1': require('@/assets/icon--map-green/13.png'),
      },
      '14': {
        '-1': require('@/assets/icon--map-red/14.png'),
        '0': require('@/assets/icon--map-yellow/14.png'),
        '1': require('@/assets/icon--map-green/14.png'),
      },
      '15': {
        '-1': require('@/assets/icon--map-red/7.png'),
        '0': require('@/assets/icon--map-yellow/7.png'),
        '1': require('@/assets/icon--map-green/7.png'),
      },
      '16': {
        '-1': require('@/assets/icon--map-green/16.png'),
        '0': require('@/assets/icon--map-green/16.png'),
        '1': require('@/assets/icon--map-green/16.png'),
      },
      '18': {
        '-1': require('@/assets/icon--map-red/18.png'),
        '0': require('@/assets/icon--map-yellow/18.png'),
        '1': require('@/assets/icon--map-green/18.png'),
      },
      '19': {
        '-1': require('@/assets/icon--map-red/12.png'),
        '0': require('@/assets/icon--map-yellow/12.png'),
        '1': require('@/assets/icon--map-green/12.png'),
      },
    },
    eqRIcons: {
      levelgauge: require('@/assets/icon-lnav/1.png'),
      jwst20alarm: require('@/assets/icon-lnav/2.png'),
      waterpressure: require('@/assets/icon-lnav/3.png'),
      ordinarycamera: require('@/assets/icon-lnav/7.png'),
      facealarm: require('@/assets/icon-lnav/10.png'),
      firechannelcamera: require('@/assets/icon-lnav/14.png'),
    },
    list: [],
  },
};

export default EquipmentModel;
