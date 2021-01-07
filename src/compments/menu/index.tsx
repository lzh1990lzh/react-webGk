import React, { useState, useEffect } from 'react';
import { connect, Dispatch, history } from 'umi';
import { Menu, Dropdown } from 'antd';
import { ConnectState } from '@/models/connect';
import { MenuItemType } from '@/models/menu';
import styles from './index.less';

interface MenuProps {
  dispatch: Dispatch;
  list: MenuItemType[];
  itemHandle: (type: string, name: string, id?: string) => void;
}

const { SubMenu } = Menu;

const MenuEl: React.FC<MenuProps> = props => {
  const { list, dispatch, itemHandle } = props;
  const ItemClick = (info: MenuItemType) => {
    let { type = '', id, name, link } = info;
    if (type === 'home') {
      dispatch({
        type: 'menu/resetAlarm',
      });
      itemHandle('home', name, id);
    } else if (link && link === 'view') {
      itemHandle('eqdroom', name, id);
    } else if (link && link === 'blank') {
      pageChange('home', type);
    }
  };

  function pageChange(orgin: string, target: string) {
    window.open(window.location.href.replace(orgin, target));
  }

  const getChildren = (info: MenuItemType) => {
    if (!info.children) {
      return <></>;
    }

    return (
      <Menu className={styles['menu-item']}>
        {info.children.map(item => {
          if (item.children) {
            return (
              <SubMenu title={item.name} key={item.name}>
                {item.children.map(citem => {
                  return (
                    <Menu.Item
                      key={citem.name}
                      onClick={() => {
                        ItemClick(citem);
                      }}
                    >
                      {citem.name}
                    </Menu.Item>
                  );
                })}
              </SubMenu>
            );
          } else {
            return (
              <Menu.Item
                key={item.name}
                onClick={() => {
                  ItemClick(item);
                }}
              >
                {item.name}
              </Menu.Item>
            );
          }
        })}
      </Menu>
    );
  };

  const MenuEl = list.map(item => {
    return (
      <Dropdown
        overlay={getChildren(item)}
        placement="topCenter"
        arrow
        overlayClassName={styles['menu-dropdown']}
        key={item.name}
      >
        <div
          className={styles['menu-item']}
          onClick={() => {
            ItemClick(item);
          }}
        >
          <div className={styles['menu-title']}>
            {item.icon ? <img src={item.icon} alt="" /> : ''}
            <span>{item.name}</span>
          </div>
        </div>
      </Dropdown>
    );
  });

  return (
    <div className={styles['menu-wrapper']}>
      <ul className={styles.menus}>{MenuEl}</ul>
    </div>
  );
};

export default connect(({ menu }: ConnectState) => ({
  list: menu.bottomlist,
}))(MenuEl);
