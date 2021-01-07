import React, { useState, useEffect } from 'react';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';
import { Form, Button, DatePicker, Image, Modal, Space } from 'antd';
import moment from 'moment';
import { potPageType } from '@/services/pot';
import PUBLIC_URL from '@/utils/address';
import NavHead from '@/compments/nav-header';
import JjzTable from '@/compments/table';
import styles from './index.less';

interface PotProps {
  dispatch: Dispatch;
  loading?: boolean;
  totalNum: number;
  list: [];
}

const Pot: React.FC<PotProps> = props => {
  const { dispatch, totalNum, list, loading = false } = props;
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageIndex, setpageIndex] = useState<number>(1);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
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
        <Space>
          <Button type="primary">查看</Button>
          <Button type="primary">编辑</Button>
          <Button type="primary">删除</Button>
          <Button type="primary">轨迹</Button>
        </Space>
      ),
    },
  ];

  function queryList(params: potPageType) {
    dispatch({
      type: 'pot/queryList',
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
    let { beginTime, endTime } = values;
    beginTime = beginTime ? beginTime.format('YYYY-MM-DD HH:mm:ss') : '';
    endTime = endTime ? endTime.format('YYYY-MM-DD HH:mm:ss') : '';
    setBeginTime(beginTime)
    setEndTime(endTime)
    setpageIndex(1);

    let params = {
      pageSize,
      pageIndex,
      beginTime,
      endTime,
    };
    queryList(params);
  }

  function formReset() {
    form.resetFields();
    if (pageIndex === 1) {
      onFinish({
        beginTime: '',
        endTime: '',
        type: '',
      });
    } else {
      setpageIndex(1);
    }
  }

  function resetModal() {
    setModalVisible(false);
  }

  function goWarnPage() {
    window.open(window.location.href.replace('tra', 'index'));
  }
  useEffect(() => {
    queryList({ 
      pageSize, 
      pageIndex,
      beginTime: submitbeginTime,
      endTime: submitendTime,
     });
  }, [pageIndex, pageSize]);

  return (
    <div className={styles['pot-wrapper']}>
      <NavHead showLogo={false} />
      <div className={styles['pot-container']}>
        <div className={styles['pot-title']}>黑名单报警</div>

        <div className={styles['pot-content']}>
          <Form
            form={form}
            name="querygroup"
            className={styles['pot-form']}
            layout="inline"
            onFinish={onFinish}
            initialValues={{
              beginTime: moment(getDate('start')),
              endTime: moment(getDate('now')),
            }}
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
              <Button type="primary" htmlType="button" onClick={formReset}>
                重置
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="primary" 
              
              onClick={() => {
                window.open(window.location.href.replace('pot', 'tra'));
              }}>
                轨迹
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
      <Modal
        title="预警处理"
        visible={modalVisible}
        centered
        onOk={() => {
          setModalVisible(false);
        }}
        onCancel={() => {
          resetModal();
        }}
      >
        <p>确定要处理吗？</p>
      </Modal>
    </div>
  );
};

export default connect(({ global, pot, loading }: ConnectState) => ({
  pageTitle: global.title,
  totalNum: pot.total,
  list: pot.list,
  loading: loading.effects['pot/queryList'],
}))(Pot);
