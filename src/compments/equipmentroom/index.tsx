import React, { useEffect, useState } from 'react';
import { connect, Dispatch } from 'umi';
import { Row, Col } from 'antd';
import { ConnectState } from '@/models/connect';
import { PointItemType, PointDataItemType } from '@/models/equimentroom';
import { EQIconTypes } from '@/models/equiment';
import { getEqInfo } from '@/services/equipment';
import classnames from 'classnames';
import DialogEquip from '@/compments/dialog-equip';
import styles from './index.less';

interface EquimentRoomProps {
  title: string;
  roomId: string;
  icons: EQIconTypes;
  roomIcons: IconsType;
  pointList: PointItemType[][];
  infoList: PointDataItemType[];
  dispatch: Dispatch;
}

const EquimentRoom: React.FC<EquimentRoomProps> = props => {
  const {
    title = '',
    roomId = '',
    pointList,
    infoList,
    icons,
    roomIcons,
    dispatch,
  } = props;

  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [x, setx] = useState<number>(0);
  const [y, sety] = useState<number>(0);
  const [dialogInfo, setDialogInfo] = useState<DialogInfoType>({
    id: '',
    type: '',
    sensorName: '',
    typeName: '',
    domain: '',
    building: '',
    unit: '',
    accesstoken: '',
    ezopen: '',
    equipmentName: '',
    equipmentNumber: '',
    equipmentSite: '',
    equipmentType: '',
    humidityUsualValue: '',
    humidityValue: '',
    inUsualValue: '',
    inValue: '',
    monitorTime: '',
    monitorValue: '',
    outUsualValue: '',
    outValue: '',
    s1: '',
    s2: '',
    status: '',
    temperatureUsualValue: '',
    temperatureValue: '',
    usualValue: '',
  });

  function queryInfoList() {
    dispatch({
      type: 'eqroom/queryDataList',
      payload: {
        roomId: roomId,
      },
    });
  }

  function queryPointList() {
    dispatch({
      type: 'eqroom/queryPointList',
      payload: {
        roomId: roomId,
      },
    });
  }

  function queryInfo(id: string, e: any) {
    if (!id) return;
    let x = e.clientX;
    let y = e.clientY;
    getEqInfo({ id }).then(res => {
      let { returnCode, returnObj } = res;
      if (returnCode !== '0') return;

      setDialogInfo(
        JSON.parse(returnObj).length > 0 ? JSON.parse(returnObj)[0] : {},
      );
      setx(x);
      sety(y);
      setShowDialog(true);
    });
  }

  function getBackCover() {
    if (title.indexOf('电') !== -1) {
      return styles['eqr-wrapper-d'];
    } else if (title.indexOf('泵') !== -1) {
      return styles['eqr-wrapper-s'];
    } else {
      return '';
    }
  }

  function getIcons(type: string) {
    return roomIcons[type];
  }

  function getEqIcon(icon: IconsType, type: string) {
    if (type === '0' || type === '1') {
      return icon[type];
    } else {
      return icon['-1'];
    }
  }

  const infoListEl = infoList.map(item => {
    interface eqTypeType {
      [index: string]: {
        name: string;
        value: any;
      }[];
    }
    const eqtype: eqTypeType = {
      waterpressure: [
        {
          name: '水压值',
          value: item.monitorValue || '',
        },
      ],
      levelgauge: [
        {
          name: '液位值',
          value: item.monitorValue || '',
        },
      ],
      jwst20alarm: [
        {
          name: '温度值',
          value: item.temperatureValue || '',
        },
        {
          name: '状态',
          value: item.s1 || '',
        },
        {
          name: '湿度值',
          value: item.humidityValue || '',
        },
        {
          name: '状态',
          value: item.s2 || '',
        },
      ],
    };
    return (
      <Col
        className={styles['eqr-info-l-item']}
        span={6}
        key={item.equipmentNumber}
      >
        <div className={styles['eqr-info-l-ic']}>
          <img src={getIcons(item.equipmentType)} alt="" />
          {item.equipmentName}
        </div>
        <div className={styles['eqr-info-l-ic']}>
          <div className={styles['eqr-info-l-icl']}>编号：</div>
          <div className={styles['eqr-info-l-ict']}>{item.equipmentNumber}</div>
        </div>
        <div className={styles['eqr-info-l-ic']}>
          <div className={styles['eqr-info-l-icl']}>正常阈值：</div>
          <div className={styles['eqr-info-l-ict']}>{item.usualValue}</div>
        </div>
        <div className={styles['eqr-info-l-ic']}>
          <div className={styles['eqr-info-l-icl']}>所在位置：</div>
          <div className={styles['eqr-info-l-ict']}>{item.equipmentSite}</div>
        </div>
        <div className={styles['eqr-info-l-icb']}>
          {eqtype[item.equipmentType] ? (
            eqtype[item.equipmentType].map((eitem, idx) => {
              return (
                <div className={styles.t} key={idx}>
                  <span>{eitem.name}：</span>
                  {eitem.value}
                </div>
              );
            })
          ) : (
            <></>
          )}
          <div className={styles['eqr-info-l-ic']}>
            <div className={styles['eqr-info-l-icl']}>监控时间：</div>
            <div className={styles['eqr-info-l-ict']}>{item.monitorTime}</div>
          </div>
        </div>
      </Col>
    );
  });

  const eqListEl = pointList.map((item, idx) => {
    return (
      <div className={styles['eqr-info-p-item']} key={idx}>
        {item.length > 0 ? (
          item.map(citem => {
            return (
              <img
                key={citem.id}
                src={getEqIcon(icons[citem.type], citem.status)}
                onClick={event => {
                  queryInfo(citem.id, event);
                }}
                alt=""
              />
            );
          })
        ) : (
          <></>
        )}
      </div>
    );
  });

  useEffect(() => {
    if (roomId) {
      queryInfoList();
      queryPointList();
    }
  }, []);

  return (
    <div className={classnames(styles['eqr-wrapper'], getBackCover())}>
      <div className={styles['eqr-container']}>
        {/* 设备信息列表 */}
        <div className={styles['eqr-info-l']}>
          <div className={styles['eqr-info-l-title']}>
            {title}
            <div className={styles.close}>x</div>
          </div>
          <div className={styles['eqr-info-l-list']}>
            <Row gutter={[16, 24]}>{infoListEl}</Row>
          </div>
        </div>
        {/* 设备点位列表 */}
        <div className={styles['eqr-info-p']}>{eqListEl}</div>
      </div>
      {showDialog ? (
        <DialogEquip
          x={x}
          y={y}
          info={dialogInfo}
          close={() => {
            setShowDialog(false);
          }}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default connect(({ eqroom, equipment }: ConnectState) => ({
  pointList: eqroom.pointList,
  infoList: eqroom.dataList,
  icons: equipment.eqIcons,
  roomIcons: equipment.eqRIcons,
}))(EquimentRoom);
