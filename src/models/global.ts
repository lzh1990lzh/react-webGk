/**
 * 全局配置
 */
export interface GlobalModelState {
  title: String;
  NavIcons: IconsType;
}

export interface GlobalModelType {
  namespace: 'global';
  state: GlobalModelState;
}

const GlobalModel: GlobalModelType = {
  namespace: 'global',
  state: {
    title: '双桥六号井',
    NavIcons: {
      '0': require('@/assets/icon-lnav/all.png'),
      '1': require('@/assets/icon-lnav/1.png'),
      '2': require('@/assets/icon-lnav/2.png'),
      '3': require('@/assets/icon-lnav/3.png'),
      '4': require('@/assets/icon-lnav/4.png'),
      '5': require('@/assets/icon-lnav/5.png'),
      '6': require('@/assets/icon-lnav/6.png'),
      '7': require('@/assets/icon-lnav/7.png'),
      '8': require('@/assets/icon-lnav/7.png'),
      '9': require('@/assets/icon-lnav/7.png'),
      '10': require('@/assets/icon-lnav/10.png'),
      '11': require('@/assets/icon-lnav/11.png'),
      '12': require('@/assets/icon-lnav/12.png'),
      '13': require('@/assets/icon-lnav/7.png'),
      '14': require('@/assets/icon-lnav/14.png'),
      '15': require('@/assets/icon-lnav/7.png'),
      '16': require('@/assets/icon-lnav/16.png'),
      '18': require('@/assets/icon-lnav/18.png'),
      '19': require('@/assets/icon-lnav/19.png'),
    },
  },
};

export default GlobalModel;
