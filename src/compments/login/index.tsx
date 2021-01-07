import React, { useState } from 'react';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';
import styles from './index.less';
import logo from '@/assets/logo.png';

interface NavHeadProps {
  showLogo: boolean;
  pageTitle: String;
}
const NavHead: React.FC<NavHeadProps> = props => {
  const { pageTitle, showLogo = true } = props;

  return (
    <div className={styles['nav-header']}>
      <div className={styles['nav-title']}>
        社区动脉物管综合管控云服务平台 —<span>{pageTitle}</span>
      </div>
      {showLogo ? <img src={logo} alt="" /> : <></>}
    </div>
  );
};
export default connect(({ global }: ConnectState) => ({
  pageTitle: global.title,
}))(NavHead);
