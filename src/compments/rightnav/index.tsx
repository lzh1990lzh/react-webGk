import React, { useEffect } from 'react';
import { connect, Dispatch } from 'umi';
import { Menu, Dropdown } from 'antd';
import { ConnectState } from '@/models/connect';
import { CtrsItemType } from '@/models/menu';
import styles from './index.less';

interface LeftMenuProps {
  dispatch: Dispatch;
  list: CtrsItemType[];
}

const RightNav: React.FC<LeftMenuProps> = props => {
  const { list, dispatch } = props;
  console.log(list,"---list右侧导航");
  const ItemClick = (info: CtrsItemType) => {
    let { type } = info;
    switch (type) {
      case 'alarm':
        queryAlarmList();
        break;      
      case 'devM':
        queryRnav();
        break;
      default:
        break;
    }
  };
  
  function queryAlarmList() {
    dispatch({
      type: 'menu/queryAlarmList',
    });
  }
  function queryRnav(){ 
   window.open(window.location.href.replace("home", "devM"));    
  }

  return (
    <div className={styles['right-nav']}>
      {list.map(item => {
        return (
          <div
            className={styles['nav-item']}
            key={item.name}
            onClick={() => {
              ItemClick(item);
            }}
          >
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <div className={styles['item-content']}>
              <img src={item.icon} alt="" />
              {item.name}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default connect(({ menu }: ConnectState) => ({
  list: menu.rightCtrs,
}))(RightNav);
