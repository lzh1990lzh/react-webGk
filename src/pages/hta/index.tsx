import React, { useState, useEffect } from 'react';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';
import { Table, Form, Button, Select, DatePicker, Image, Modal } from 'antd';
import moment from 'moment';
import { htaPageType, dealAlarm } from '@/services/hta';
import PUBLIC_URL from '@/utils/address';
import NavHead from '@/compments/nav-header';
import styles from './index.less';

interface HtaProps {
  dispatch: Dispatch;
  loading?: boolean;
  totalNum: number;
  warntypes: { name: string; id: string }[];
  list: [];
}

const { Option } = Select;

const Hta: React.FC<HtaProps> = props => {
  console.log(props,"--hta");
  const { dispatch, totalNum, list, warntypes, loading } = props;
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageIndex, setpageIndex] = useState<number>(1);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [handleId, setHandleId] = useState<string>('');
  const [form] = Form.useForm();
  const [submitbeginTime, setBeginTime] = useState<string>(getDate('start'))
  const [submitendTime, setEndTime] = useState<string>(getDate('now'))
  

  const columns = [
    {
      title: '报警类型',
      dataIndex: 'typeName',
      key: 'typeName',
    },
    {
      title: '报警时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '报警设备',
      dataIndex: 'equipmentName',
      key: 'equipmentName',
    },
    {
      title: '报警位置',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: '状态',
      dataIndex: 'isdeal',
      key: 'isdeal',
    },
    {
      title: '图片',
      key: 'photoPath',
      dataIndex: 'photoPath',
      render: (url: string) =>
        url ? <Image src={`${PUBLIC_URL.imgUrl}${url}`} width={100} /> : <></>,
    },
    {
      title: '操作',
      key: 'action',
      render: (text: any) => (
        <Button
          type="primary"
          onClick={() => {
            let { id } = text;
            setHandleId(id);
            setModalVisible(true);
          }}
        >
          处理
        </Button>
      ),
    },
  ];

  function handleConfirm() {
    if (!handleId) return;
    let params = {
      id: handleId,
      dealUser: '',
    };
    dealAlarm(params).then(res => {
      let { code } = res;
      if (code !== '0') return;
      setpageIndex(1);
    });
  }

  function queryList(params: htaPageType) {
    dispatch({
      type: 'hta/queryList',
      payload: params,
    });
  }
  function getDate(type: 'start' | 'end' | 'now', left?: number) {
    let now = new Date();
    if (left) {
      now = new Date(now.getTime() - 1000 * 60 * 60 * 24 * left);
    }
    let calc = (n: number) => (n > 9 ? n : `0${n}`);

    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    let hh = now.getHours();
    let mm = now.getMinutes();
    let ss = now.getSeconds();

    let hmsType = {
      start: '00:00:00',
      now: `${[hh, mm, ss].map(item => calc(item)).join(':')}`,
      end: '23:59:59',
    };

    return `${[year, month, day].map(item => calc(item)).join('-')} ${
      hmsType[type]
    }`;
  }
  function onFinish(values: any) {
    let { beginTime, endTime, type = '0' } = values;
    beginTime = beginTime ? beginTime.format('YYYY-MM-DD HH:mm:ss') : '';
    endTime = endTime ? endTime.format('YYYY-MM-DD HH:mm:ss') : '';
    setBeginTime(beginTime)
    setEndTime(endTime)
    setpageIndex(1);

    let params = {
      pageSize,
      pageIndex,
      type,
      beginTime,
      endTime,
    };
    queryList(params);
  }

  function formReset() {
    form.resetFields();
    if (pageIndex === 1) {
      onFinish({
        beginTime: moment(getDate('start')),
        endTime: moment(getDate('now')),
        type: '0',
      });
    } else {
      setpageIndex(1);
    }
  }

  function resetModal() {
    setModalVisible(false);
    setHandleId('');
  }

  useEffect(() => {
    dispatch({
      type: 'hta/queryTypes',
    });
  }, []);

  useEffect(() => {
    queryList({ 
      pageSize, 
      pageIndex,
      beginTime: submitbeginTime,
      endTime: submitendTime,
     });
  }, [pageIndex, pageSize]);

  return (
    <div className={styles['hta-wrapper']}>
      <NavHead showLogo={false} />
      <div className={styles['hta-container']}>
        <Form
          form={form}
          name="querygroup"
          className={styles['hta-form']}
          layout="inline"
          onFinish={onFinish}
          initialValues={{
            beginTime: moment(getDate('start')),
            endTime: moment(getDate('now')),
          }}
        >
          <Form.Item label="报警类型" name="type">
            <Select style={{ width: 120 }} placeholder="报警类型">
              {warntypes.map(item => {
                return (
                  <Option value={item.value} key={item.name}>
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
        <Table
          columns={columns}
          dataSource={list}
          bordered
          loading={loading}
          rowKey="id"
          pagination={{
            pageSize,
            total: totalNum,
            showQuickJumper: true,
            onChange: (page: number) => {
              setpageIndex(page);
            },
            onShowSizeChange: (current: number, size: number) => {
              setPageSize(size);
            },
          }}
        />
      </div>
      <Modal
        title="预警处理"
        visible={modalVisible}
        centered
        onOk={handleConfirm}
        onCancel={() => {
          resetModal();
        }}
      >
        <p>确定要处理吗？</p>
      </Modal>
    </div>
  );
};

export default connect(({ global, hta, loading }: ConnectState) => ({
  pageTitle: global.title,
  totalNum: hta.total,
  warntypes: hta.types,
  list: hta.list,
  loading: loading.effects['hta/queryList'],
}))(Hta);
