import React, { useState, useEffect } from 'react';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';
import {
  Form,
  Button,
  DatePicker,
  Input,
  Select,
  Image,
  Modal,
  message,
  Row,
  Col,
  Popconfirm,
} from 'antd';
import {
  HistoryOutlined,
  LoadingOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { CmpItemType, CrimeItemType } from '@/models/cmp';
import { addCmp, deleteCmp } from '@/services/cmp';
import PUBLIC_URL from '@/utils/address';
import NavHead from '@/compments/nav-header';
import Avatar from '@/compments/avatar';
import styles from './index.less';

interface CmpProps {
  dispatch: Dispatch;
  loading?: boolean;
  list: CmpItemType[];
  crimes: CrimeItemType[];
}

interface CmpParamsProps {
  beginTime: string;
  endTime: string;
  crimeId: string;
  userName: string;
  idCard: string;
}

interface AddItemProps {
  userName: string;
  gender: string;
  birthday: any;
  idCard: string;
  messageId: string;
}

const { Option } = Select;

const Cmp: React.FC<CmpProps> = props => {
  const { dispatch, list, loading, crimes } = props;
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [headPath, setHeadPath] = useState<string>('');
  const [headSubmiPath, setHeadSubmiPath] = useState('');
  const [imgLoading, setImgLoading] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();

  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
  };

  const tailLayout = {
    wrapperCol: { offset: 5, span: 19 },
  };

  const headuploadButton = (
    <div>
      {imgLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">上传</div>
    </div>
  );

  function onFinish(values: any) {
    let {
      beginTime,
      endTime,
      crimeId = '',
      userName = '',
      idCard = '',
    } = values;
    beginTime = beginTime ? beginTime.format('YYYY-MM-DD HH:mm:ss') : '';
    endTime = endTime ? endTime.format('YYYY-MM-DD HH:mm:ss') : '';
    queryList({
      beginTime,
      endTime,
      crimeId,
      userName,
      idCard,
    });
  }

  function queryList(params: CmpParamsProps) {
    dispatch({
      type: 'cmp/queryList',
      payload: params,
    });
  }

  function formReset() {
    form.resetFields();
    queryList({
      beginTime: '',
      endTime: '',
      crimeId: '',
      userName: '',
      idCard: '',
    });
  }

  function modalFormReset() {
    modalForm.resetFields();
    setModalVisible(false);
  }

  function imageChange(file: any, url: string) {
    setHeadSubmiPath(file);
    setHeadPath(url);
    setImgLoading(false);
  }

  async function handelAdd(values: AddItemProps) {
    if (!headSubmiPath) {
      message.error('上传图片不能为空！');
      return;
    }
    setSubmitLoading(true);
    let { userName, gender, messageId, birthday, idCard } = values;
    birthday = birthday ? birthday.format('YYYY-MM-DD') : '';
    let params: IconsType = {
      file: headSubmiPath,
      userName,
      gender,
      messageId,
      birthday,
      idCard,
      userType: '0',
      message:
        crimes.filter(item => item.id === messageId).length > 0
          ? crimes.filter(item => item.id === messageId)[0].name
          : '',
    };
    const formData = new FormData();
    Object.keys(params).forEach(item => {
      formData.append(item, params[item]);
    });
    await addCmp(formData)
      .then(res => {
        let { returnCode } = res;
        if (returnCode === '0') {
          message.success('添加成功！');
        } else {
          message.error('添加失败！');
        }
      })
      .catch(err => {
        message.error('添加失败！');
      });
    await queryList({
      beginTime: '',
      endTime: '',
      crimeId: '',
      userName: '',
      idCard: '',
    });
    setSubmitLoading(false);
  }

  async function handelDelete(faceToken: string) {
    setDeleteLoading(true);
    await deleteCmp({
      faceToken,
    })
      .then(res => {
        let { returnCode } = res;
        if (returnCode === '0') {
          message.success('删除成功！');
        } else {
          message.error('删除失败！');
        }
      })
      .catch(err => {
        message.error('删除失败！');
      });
    setDeleteLoading(false);
  }

  useEffect(() => {
    dispatch({
      type: 'cmp/queryCrimeList',
    });
    queryList({
      beginTime: '',
      endTime: '',
      crimeId: '',
      userName: '',
      idCard: '',
    });
  }, []);

  return (
    <div className={styles['cmp-wrapper']}>
      <NavHead showLogo={false} />
      <div className={styles['cmp-container']}>
        <div className={styles['cmp-title']}>
          <span>社区人员管理</span>
          <Button
            style={{ borderColor: '#0e88e5', color: '#0e88e5' }}
            onClick={() => {
              window.open(window.location.href.replace('cmp', 'pot'));
            }}
          >
            黑名单抓拍
          </Button>
        </div>
        <div className={styles['cmp-sub-title']}>
          <span>黑名单</span>
          <Button
            type="primary"
            onClick={() => {
              setModalVisible(true);
            }}
          >
            添加
          </Button>
        </div>
        <Form
          form={form}
          name="querygroup"
          className={styles['cmp-query-group']}
          layout="inline"
          onFinish={onFinish}
        >
          <Form.Item label="姓名" name="userName">
            <Input />
          </Form.Item>
          <Form.Item label="身份证号" name="idCard">
            <Input />
          </Form.Item>
          <Form.Item label="所犯类型" name="crimeId">
            <Select style={{ width: 120 }} placeholder="所犯类型">
              {crimes.map(item => {
                return (
                  <Option value={item.id} key={item.name}>
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
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="button" onClick={formReset}>
              重置
            </Button>
          </Form.Item>
        </Form>
        <div className={styles['cmp-img-container']}>
          <Row>
            {list.map(item => {
              return (
                <Col span={6} key={item.id}>
                  <div className={styles['cmp-img-item']}>
                    <div className={styles['cmp-img-top']}>
                      <div className={styles['cmp-img-txt']}>
                        <HistoryOutlined style={{ marginRight: '5px' }} />
                        录入时间：{item.createTime}
                      </div>
                      <div className={styles['cmp-img-txt']} title={item.id}>
                        编号：{item.id}
                      </div>
                    </div>
                    <div className={styles['cmp-img-bottom']}>
                      <div className={styles['cmp-img-gr']}>
                        <Image
                          src={`${PUBLIC_URL.imgUrl}${item.photoPath}`}
                          width={128}
                          placeholder
                          preview={false}
                        />
                        <Button
                          type="primary"
                          size="small"
                          style={{ marginTop: 8, fontSize: 12 }}
                        >
                          {item.crimeName}
                        </Button>
                      </div>
                      <div className={styles['cmp-img-des']}>
                        <p>姓名：{item.username}</p>
                        <p>性别：{item.gender}</p>
                        <p>出生日期：{item.birthday}</p>
                        <p>身份证号：{item.idCard}</p>
                        <Popconfirm
                          title="确定删除吗？"
                          icon={
                            <QuestionCircleOutlined style={{ color: 'red' }} />
                          }
                          onConfirm={() => {
                            handelDelete(item.id);
                          }}
                        >
                          <Button
                            className={styles['cmp-img-delet']}
                            loading={deleteLoading}
                          >
                            删除
                          </Button>
                        </Popconfirm>
                        ,
                      </div>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        </div>
      </div>
      <Modal
        title="添加黑名单"
        visible={modalVisible}
        centered
        footer={null}
        onCancel={modalFormReset}
      >
        <Form
          {...layout}
          form={modalForm}
          name="modalForm"
          onFinish={handelAdd}
        >
          <Form.Item label="人像">
            <Avatar
              onOk={(file: any, url: string) => {
                imageChange(file, url);
              }}
            >
              {headPath ? (
                <img src={headPath} alt="avatar" style={{ width: '100%' }} />
              ) : (
                headuploadButton
              )}
            </Avatar>
          </Form.Item>
          <Form.Item label="姓名" name="userName">
            <Input style={{ width: 280 }} />
          </Form.Item>
          <Form.Item label="性别" name="gender">
            <Select style={{ width: 280 }} placeholder="性别">
              <Option value="男" key="男">
                男
              </Option>
              <Option value="女" key="女">
                女
              </Option>
            </Select>
          </Form.Item>
          <Form.Item label="出生日期" name="birthday">
            <DatePicker
              format="YYYY-MM-DD"
              allowClear
              placeholder="出生日期"
              style={{ width: 280 }}
            />
          </Form.Item>
          <Form.Item label="身份证号" name="idCard">
            <Input style={{ width: 280 }} type="number" />
          </Form.Item>
          <Form.Item label="所犯类型" name="messageId">
            <Select style={{ width: 280 }} placeholder="所犯类型">
              {crimes.map(item => {
                return (
                  <Option value={item.id} key={item.name}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item colon={false} style={{ marginBottom: 0 }} {...tailLayout}>
            <div className={styles['modal-footer']}>
              <Button type="primary" htmlType="submit" loading={submitLoading}>
                确定
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default connect(({ global, cmp, loading }: ConnectState) => ({
  pageTitle: global.title,
  list: cmp.list,
  crimes: cmp.crimeList,
}))(Cmp);
