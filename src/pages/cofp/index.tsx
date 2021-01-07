import React, { useState, useEffect } from 'react';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';
import { Form, Button, DatePicker, Modal, Image } from 'antd';
import { HistoryOutlined } from '@ant-design/icons';
import { CofpItemType } from '@/models/cofp';
import moment from 'moment';
import PUBLIC_URL from '@/utils/address';
import NavHead from '@/compments/nav-header';
import styles from './index.less';

interface CofpProps {
  dispatch: Dispatch;
  loading?: boolean;
  list: CofpItemType[];
}

const Cofp: React.FC<CofpProps> = props => {
  const { dispatch, list, loading } = props;
  const [form] = Form.useForm();
  const [beginTime, setBeginTime] = useState(moment('2020-08-24 00:00:00'));
  const [endTime, setEndTime] = useState(moment('2020-08-24 23:59:59'));
  const [modalInfo, setModalInfo] = useState<CofpItemType>({
    createTime: '',
    dealTime: '',
    dealUser: '',
    id: '',
    isDeal: '',
    phoneNumber: '',
    photoPath: '',
  });
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  function onFinish(values: any) {
    let { beginTime, endTime, roomId = '' } = values;
    beginTime = beginTime ? beginTime.format('YYYY-MM-DD HH:mm:ss') : '';
    endTime = endTime ? endTime.format('YYYY-MM-DD HH:mm:ss') : '';
    setBeginTime(beginTime);
    setEndTime(endTime);
    queryList({
      beginTime,
      endTime,
    });
  }

  function queryList(params?: { beginTime: string; endTime: string }) {
    dispatch({
      type: 'cofp/queryList',
      payload: params || {
        beginTime,
        endTime,
      },
    });
  }

  function imgClick(info: CofpItemType) {
    setModalInfo(info);
    setModalVisible(true);
  }

  useEffect(() => {
    queryList();
  }, []);

  return (
    <div className={styles['cofp-wrapper']}>
      <NavHead showLogo={false} />
      <div className={styles['cofp-container']}>
        <div className={styles['cofp-title']}>历史抓拍</div>
        <Form
          form={form}
          name="querygroup"
          className={styles['cofp-query-group']}
          layout="inline"
          initialValues={{
            beginTime,
            endTime,
          }}
          onFinish={onFinish}
        >
          <Form.Item label="开始时间" name="beginTime">
            <DatePicker
              format="YYYY-MM-DD HH:mm:ss"
              showTime
              allowClear
              placeholder="开始时间"
            />
          </Form.Item>
          <Form.Item label="结束时间" name="endTime">
            <DatePicker
              format="YYYY-MM-DD HH:mm:ss"
              showTime
              allowClear
              placeholder="结束时间"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
          </Form.Item>
        </Form>
        <div className={styles['cofp-img-container']}>
          {list.map(item => {
            return (
              <div className={styles['cofp-img-item']} key={item.id}>
                <div className={styles['cofp-img-content']}>
                  {/* <img
                    src={`${PUBLIC_URL.imgUrl}${item.photoPath}`}
                    alt=""
                    onClick={() => {
                      imgClick(item);
                    }}
                  /> */}
                  <Image
                    src={`${PUBLIC_URL.imgUrl}${item.photoPath}`}
                    width={236}
                    height={133}
                    placeholder
                    preview={false}
                    onClick={() => {
                      imgClick(item);
                    }}
                  />
                  <div className={styles['cofp-img-des']}>
                    <HistoryOutlined style={{ marginRight: '5px' }} />
                    {item.createTime}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Modal
        visible={modalVisible}
        title="抓拍详情"
        centered
        width={410}
        onCancel={() => {
          setModalVisible(false);
        }}
        footer={[
          <Button
            type="primary"
            onClick={() => {
              setModalVisible(false);
            }}
          >
            关闭
          </Button>,
        ]}
      >
        <div className={styles['cofp-dialog-item']}>
          <img src={`${PUBLIC_URL.imgUrl}${modalInfo.photoPath}`} alt="" />
        </div>
        <div className={styles['cofp-dialog-item']} key={1}>
          <span>报警时间：</span>
          {modalInfo.createTime}
        </div>
        <div className={styles['cofp-dialog-item']} key={2}>
          <span>处理人：</span>
          {modalInfo.dealUser}
        </div>
        <div className={styles['cofp-dialog-item']} key={3}>
          <span>联系方式：</span>
          {modalInfo.phoneNumber}
        </div>
        <div className={styles['cofp-dialog-item']} key={4}>
          <span>处理时间：</span>
          {modalInfo.dealTime}
        </div>
        <div className={styles['cofp-dialog-item']} key={5}>
          <span>处理结果：</span>
          {modalInfo.isDeal}
        </div>
      </Modal>
    </div>
  );
};

export default connect(({ global, cofp, loading }: ConnectState) => ({
  pageTitle: global.title,
  list: cofp.list,
}))(Cofp);
