import React, { useEffect } from 'react';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';
import { Button } from 'antd'
import classnames from 'classnames'
import styles from './index.less';

interface DialogProps {
  x: number;
  y: number;
  NavIcons: IconsType;
  info: DialogInfoType;
  close: () => void;
}

interface eqTypeType {
  [index: string]: {
    name: string;
    value: any;
  }[];
}

const DialogEquipment: React.FC<DialogProps> = props => {
  const { x = 0, y = 0, info, NavIcons, close } = props;
  const {
    id,
    type,
    status,
    sensorName,
    typeName,
    domain,
    building,
    unit,
    monitorValue,
    temperatureValue,
    humidityValue ,
    monitorTime,
    accesstoken,
    ezopen,
  } = info;

  const TypeEl: eqTypeType = {
    1: [
      {
        name: '液位值',
        value: monitorValue,
      },
    ],
    2: [
      {
        name: '温度值',
        value: temperatureValue,
      },
      {
        name: '湿度值',
        value: humidityValue,
      },
    ],
    3: [
      {
        name: '水压值',
        value: monitorValue,
      },
    ],
    4: [
      {
        name: '压力值',
        value: monitorValue,
      },
    ],
    5: [],
  };

  const CenterEl = () => {
    if (+type > 0 && +type < 6) {
      return (
        <div className={styles['dialog-item-b']}>
          <div className={styles['diaolog-item']}>
            <span>监控数据：</span>
          </div>
          {TypeEl[type] ? (
            TypeEl[type].map((eitem, idx) => {
              return (
                <div className={styles['diaolog-item']} key={idx}>
                  <span>{eitem.name}：</span>
                  {eitem.value}
                </div>
              );
            })
          ) : (
            <></>
          )}
        </div>
      );
    } else if (type === '16') {
      <div className={classnames(styles['diaolog-item'], styles['diaolog-btn'])}>
        <Button type="primary">查看进出记录</Button>
      </div>;
    }
  };

  const EndEl = () => {
    let typeArr = ['7', '10', '11', '13', '14', '15'];
    if (typeArr.indexOf(type) !== -1) {
      return <div className={classnames(styles['diaolog-item'], styles['diaolog-btn'])}>
        <Button type="primary">查看摄像头</Button>
      </div>;
    } else {
      return <></>;
    }
  };

  return (
    <div
      className={styles['dialog-wrapper']}
      style={{
        top: `${y}px`,
        left: `${x}px`,
      }}
    >
      <div className={styles['dialog-close']} onClick={close}>
        x
      </div>
      <div className={styles['diaolog-item']}>
        <img src={NavIcons[type]} alt="" />
        {sensorName}
      </div>
      <div className={styles['diaolog-item']}>
        <span>设备类型：</span>
        {typeName}
      </div>
      <div className={styles['diaolog-item']}>
        <span>所在位置：</span>
        {domain || ''}
        {building || ''}
        {unit || ''}
      </div>
      <div className={styles['diaolog-item']}>
        <span>状态：</span>
        {status}
      </div>
      {CenterEl()}
      {EndEl()}
    </div>
  );
};

export default connect(({ global }: ConnectState) => ({
  NavIcons: global.NavIcons,
}))(DialogEquipment);
