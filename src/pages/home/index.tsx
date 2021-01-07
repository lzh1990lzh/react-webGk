import React, { useState } from 'react';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';
import BottomMenu from '@/compments/menu';
import LeftNav from '@/compments/leftnav';
import RightNav from '@/compments/rightnav';
import EqRoom from '@/compments/equipmentroom';
import NavHead from '@/compments/nav-header';
import Map from '@/pages/map';
import styles from './index.less';

interface HomeProps {
  pageTitle: String;
}
const Home: React.FC<HomeProps> = props => {
  const { pageTitle, children } = props;
  const [roomId, setRoomId] = useState<string>('');
  const [roomTitle, setRoomTitle] = useState<string>('');
  const [showEqRoom, setShowEqRoom] = useState<boolean>(false);

  function resetHomes() {
    setRoomId('');
    setRoomTitle('');
    setShowEqRoom(false);
  }

  function itemHandle(type: string, title = '', id = '') {
    switch (type) {
      case 'home':
        resetHomes();
        break;
      case 'eqdroom':
        setRoomTitle(title);
        setRoomId(id);
        setShowEqRoom(true);
        break;
      default:
        break;
    }
  }
  return (
    <div className={styles['home-wrapper']}>
      <NavHead showLogo />
      <Map />
      {!showEqRoom ? <LeftNav /> : <></>}
      {!showEqRoom ? <RightNav /> : <></>}
      <BottomMenu itemHandle={itemHandle} />
      {showEqRoom ? <EqRoom title={roomTitle} roomId={roomId} /> : <></>}
    </div>
  );
};
export default connect(({ global }: ConnectState) => ({
  pageTitle: global.title,
}))(Home);
