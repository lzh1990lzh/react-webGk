import React, { useEffect } from 'react';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';
import { Button } from 'antd';
import { NavItemType, AlarmItemType } from '@/models/menu';
import styles from './index.less';

interface LeftMenuProps {
  showAlarm?: Boolean;
  title?: string;
  list: NavItemType[];
  alarmlist?: AlarmItemType[];
  NavIcons: IconsType;
  dispatch: Dispatch;
}

const LeftMenu: React.FC<LeftMenuProps> = props => {
  const {
    showAlarm,
    title = '',
    list,
    alarmlist = [],
    dispatch,
    NavIcons,
  } = props;

  const getIcons = (type: string) => {
    return NavIcons[type];
  };

  const NavEl = list.map(item => {
    return (
      <div className={styles['nav-item']} key={item.sensorName}>
        <div className={styles['nav-info']}>
          <img src={getIcons(item.type)} alt="" />
          {item.sensorName}
        </div>
        <div className={styles['nav-count']}>{item.count}</div>
      </div>
    );
  });

  const AlarmEl = alarmlist.map(item => {
    return (
      <div className={styles['alarm-item']} key={item.id}>
        <div className={styles['alarm-tl']}>
          <img src={require('@/assets/icon/icon-alarm.png')} alt="" />
          <span>{item.level}</span>
        </div>
        <div className={styles['alarm-tr']}>
          <span>{item.equipmentName}</span>
          <span>{item.equipmentSite}</span>
        </div>
      </div>
    );
  });

  function goWarnPage() {
    window.open(window.location.href.replace('home', 'hta'));
  }

  useEffect(() => {
    dispatch({
      type: 'menu/queryNavList',
    });
  }, []);

  return (
    <div className={styles['left-nav-wrapper']}>
      <div className={styles['nav-title']}>
        {title || '物联网智能感知终端列表'}
        {showAlarm ? (
          <Button type="primary" onClick={goWarnPage}>
            历史报警
          </Button>
        ) : (
          ''
        )}
      </div>
      <div className={styles['nav-list']}>{!showAlarm ? NavEl : AlarmEl}</div>
    </div>
  );
};

export default connect(({ menu, global }: ConnectState) => ({
  showAlarm: menu.showAlarm,
  title: menu.leftNavTitle,
  list: menu.leftnavs,
  alarmlist: menu.alarmList,
  NavIcons: global.NavIcons,
}))(LeftMenu);
