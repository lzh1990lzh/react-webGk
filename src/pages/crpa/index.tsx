import React, { useState, useEffect } from 'react';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';
import { Form, Button, Select, DatePicker, Image } from 'antd';
import { crpaPageType } from '@/services/crpa';
import moment from 'moment';
import PUBLIC_URL from '@/utils/address';
import NavHead from '@/compments/nav-header';
import JjzTable from '@/compments/table';
import styles from './index.less';

interface CrpaProps {
  dispatch: Dispatch;
  loading?: boolean;
  totalNum: number;
  roomList: { name: string; value: string }[];
  list: [];
}

const { Option } = Select;

const Crpa: React.FC<CrpaProps> = props => {
  console.log(props);
  const { dispatch, totalNum, list, roomList, loading = false } = props;
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageIndex, setpageIndex] = useState<number>(1);
  const [form] = Form.useForm();

  const columns = [
    {
      title: '设备名称',
      dataIndex: 'equipmentName',
      key: 'equipmentName',
    },
    {
      title: '抓拍时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '位置',
      dataIndex: 'site',
      key: 'site',
    },
    {
      title: '图片',
      key: 'photoPath',
      dataIndex: 'photoPath',
      render: (url: string) => (
        <Image src={`${PUBLIC_URL.imgUrl}${url}`} width={100} />
      ),
    },
  ];

  function queryList(params: crpaPageType) {
    dispatch({
      type: 'crpa/queryList',
      payload: params,
    });
  }
  function onFinish(values: any) {
    let { beginTime, endTime, roomId = '' } = values;
    beginTime = beginTime ? beginTime.format('YYYY-MM-DD HH:mm:ss') : '';
    endTime = endTime ? endTime.format('YYYY-MM-DD HH:mm:ss') : '';
    setpageIndex(1);

    let params = {
      pageSize,
      pageIndex,
      roomId,
      beginTime,
      endTime,
    };
    console.log(params,"--搜入参");
    queryList(params);
  }

  function formReset() {
    form.resetFields();
    if (pageIndex === 1) {
      onFinish({
        beginTime: '',
        endTime: '',
        roomId: '',
      });
    } else {
      setpageIndex(1);
    }
  }

  useEffect(() => {
    queryList({ pageSize, pageIndex });
  }, [pageIndex, pageSize]);
  return (
    <div className={styles['crpa-wrapper']}>
      <NavHead showLogo={false} />
      <div className={styles['crpa-container']}>
        <Form
          form={form}
          name="querygroup"
          className={styles['crpa-form']}
          layout="inline"
          onFinish={onFinish}
        >
          <Form.Item label="房间类型" name="roomId">
            <Select style={{ width: 120 }} placeholder="房间类型">
              {roomList.map(item => {
                return (
                  <Option value={item.value} key={item.name}>
                    <Option value="">全部</Option>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
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
            <Button type="primary" htmlType="button" onClick={formReset}>
              重置
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
          </Form.Item>
        </Form>
        <JjzTable
          columns={columns}
          loading={loading}
          rowKey="id"
          pageSize={pageSize}
          datasource={list}
          totalNum={totalNum}
          pageIndexChange={(page: number) => {
            setpageIndex(page);
          }}
          pageSizeChange={(size: number) => {
            setPageSize(size);
          }}
        />
      </div>
    </div>
  );
};

export default connect(({ global, crpa, loading }: ConnectState) => ({
  pageTitle: global.title,
  totalNum: crpa.total,
  roomList: crpa.roomList,
  list: crpa.list,
  loading: loading.effects['crpa/queryList'],
}))(Crpa);
