import React, { useState, useEffect } from 'react';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';
import { Table, Form, Button, Select, DatePicker, Image, Modal,Input } from 'antd';
import moment from 'moment';
import { htaPageType, dealAlarm } from '@/services/devM';
import PUBLIC_URL from '@/utils/address';
import NavHead from '@/compments/nav-header';
import styles from './index.less';

interface DevProps {
  dispatch: Dispatch;
  loading?: boolean;
  totalNum: number;
  warntypes: { name: string; id: string }[];
  list: [];
  status:{ name: string; id: string }[];
  onCalcel: ()=>void;
}


const { Option } = Select;

const Dev: React.FC<DevProps> = props => {
  console.log(props,"--hta");
  const { dispatch, totalNum, list, warntypes,status, loading} = props;
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageIndex, setpageIndex] = useState<number>(1);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [handleId, setHandleId] = useState<string>('');
  const [form] = Form.useForm();
  const [submitbeginTime, setBeginTime] = useState<string>(getDate('start'))
  const [submitendTime, setEndTime] = useState<string>(getDate('now'))
  
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  };

  const columns = [
    {
      title: '设备类型',
      dataIndex: 'typeName',
      key: 'typeName',
    },
    {
      title: '运行状态',
      dataIndex: 'statusName',
      key: 'statusName',
    },
    {
      title: '安装位置',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '负责人',
      dataIndex: 'createUser',
      key: 'createUser',
    },
    {
      title: '绑定时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    // {
    //   title: '图片',
    //   key: 'photoPath',
    //   dataIndex: 'photoPath',
    //   render: (url: string) =>
    //     url ? <Image src={`${PUBLIC_URL.imgUrl}${url}`} width={100} /> : <></>,
    // },
    {
      title: '操作',
      key: 'action',
      render: (text: any) => (
        <Button
          type="primary"
          onClick={() => {
            let { id } = text;
            setHandleId(text);
            setModalVisible(true);
          }}
        >
          查看
        </Button>
      ),
    },
  ];
 
  form.setFieldsValue(handleId);
  function handleConfirm() {
    if (!handleId) return;
    // let params = {
    //   id: handleId,
    //   dealUser: '',
    // };
    dealAlarm(params).then(res => {
      let { code } = res;
      if (code !== '0') return;
      setpageIndex(1);
    });
  }

  function queryList(params: htaPageType) {
    dispatch({
      type: 'dev/queryList',
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
      end: '23:59 :59',
    };

    return `${[year, month, day].map(item => calc(item)).join('-')} ${
      hmsType[type]
    }`;
  }
  function onFinish(values: any) {
    console.log(values,"---values");
    let { beginTime, endTime, type, status } = values;
    beginTime = beginTime ? beginTime.format('YYYY-MM-DD HH:mm:ss') : '';
    endTime = endTime ? endTime.format('YYYY-MM-DD HH:mm:ss') : '';
    setBeginTime(beginTime)
    setEndTime(endTime)
    setpageIndex(1);

    let params = {
      pageSize,
      pageIndex,
      typeId:type,
      status,
      // beginTime,
      // endTime,
    };
    queryList(params);
  }

  function formReset() {
    form.resetFields();
    if (pageIndex === 1) {
      onFinish({
        // beginTime: moment(getDate('start')),
        // endTime: moment(getDate('now')),
        typeId:'',
        status:''
      });
    } else {
      setpageIndex(1);
    }
  }

  function resetModal() {
    setModalVisible(false);
    setHandleId();
  }

  useEffect(() => {
    dispatch({
      type: 'dev/queryTypes',
    });
    dispatch({
      type: 'dev/queryStatus',
    });
  }, []);

  useEffect(() => {
    queryList({ 
      pageSize, 
      pageIndex,
      // beginTime: submitbeginTime,
      // endTime: submitendTime,
     });
  }, [pageIndex, pageSize]);

  return (
    <div className={styles['hta-wrapper']}>
      <NavHead showLogo={false} />
      <div className={styles['hta-container']}>
        {/* <div className={styles['cofp-title']}>设备管理</div> */}
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
          <Form.Item label="设备类型" name="type">
            <Select style={{ width: 120 }} placeholder="设备类型">
              {warntypes.map(item => {
                return (
                  <Option value={item.id} key={item.typeName}>
                    {item.typeName}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item label="设备状态" name="status">
            <Select style={{ width: 120 }} placeholder="设备状态">
              {status.map(item => {
                return (
                  <Option value={item.id} key={item.name}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          {/* <Form.Item label="开始时间" name="beginTime">
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
          </Form.Item> */}
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
        title="详情"
        visible={modalVisible}
        onOk={() => {
          resetModal();
        }}
        onCancel={() => {
          resetModal();
        }}
      >
        <Form
           {...layout}
           form={form}
          // name="modalForm"
          // onFinish={handelAdd}
        >
          <Form.Item label='设备类型' name='typeName'>
            <Input></Input>
          </Form.Item>
          <Form.Item label='运行状态' name='statusName'>
            <Input></Input>
          </Form.Item>
          <Form.Item label='安装位置' name='location'>
            <Input></Input>
          </Form.Item>
          <Form.Item label='精度' name='x'>
            <Input></Input>
          </Form.Item>
          <Form.Item label='维度' name='y'>
            <Input></Input>
          </Form.Item>
          <Form.Item label='海拔' name='z'>
            <Input></Input>
          </Form.Item>
          <Form.Item label='绑定时间' name='createTime'>
            <Input></Input>
          </Form.Item>
          <Form.Item label='负责人' name='createUser'>
            <Input></Input>
          </Form.Item>
        </Form>
        
      </Modal>
    </div>
  );
};

export default connect(({ global, dev, loading }: ConnectState) => ({
  pageTitle: global.title,
  totalNum: dev.total,
  warntypes: dev.types,
  list: dev.list,
  status: dev.status,
  loading: loading.effects['dev/queryList'],
}))(Dev);
