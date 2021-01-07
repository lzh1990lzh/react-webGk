import React from 'react';
import { connect, Dispatch } from 'umi';
import { Row, Col } from 'antd';
import { ConnectState } from '@/models/connect';
import NavHead from '@/compments/nav-header';
import styles from './index.less';

interface RtmProps {
  dispatch: Dispatch;
}

const style = { background: '#0092ff', padding: '8px 0' };
const Rtm: React.FC<RtmProps> = props => {
  return (
    <div className={styles['rtm-wrapper ']}>
      <NavHead showLogo={false} />
      
      <div className={styles['rtm-left']}>
        <div className={styles['tabLeft']}>					
						<div data-val="0" className={styles['tabSsActiv']}>全部</div>
						<div data-val="1">智能</div>
						<div data-val="2">园区</div>
						<div data-val="3">电梯</div>
				</div>
        <div className={styles['tabRight']}>
          <h5>摄像头</h5>
          <div>
            <input></input>
            
          </div>
        </div>
      </div>
      <div className={styles['rtm-right']}>22</div>
    
    </div>
  );
};

export default connect(({ global, pot, loading }: ConnectState) => ({
  pageTitle: global.title,
  totalNum: pot.total,
  list: pot.list,
  loading: loading.effects['rtm/queryList'],
}))(Rtm);
