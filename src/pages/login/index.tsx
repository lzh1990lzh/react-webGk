import React, { useState, useEffect } from 'react';
import { connect, Dispatch } from 'umi';
import { LoginModal } from '@/models/login';

import styles from './index.less';
import { Modal, Form, Input, Timeline,Button,Checkbox} from 'antd';
import { UserOutlined,LockOutlined } from '@ant-design/icons';

interface HomeProps {
  loginInfo:LoginModal[];  
  dispatch: Dispatch;
}

const Login: React.FC<HomeProps> = props => {
  const {dispatch, loginInfo } = props;
  console.log(loginInfo,"---");
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
  const layout = {
    labelCol: { span: 12 },
    wrapperCol: { span: 8 },
  };
  const size={
    size: 'large',
  }
  
  const Demo = () => {
    // const onFinish = values => {
    //   console.log('Success:', values);
    // };
  
    // const onFinishFailed = errorInfo => {
    //   console.log('Failed:', errorInfo);
    // };
  }
  useEffect(() => {
    dispatch({
      type: 'login/login',
      //payload: { ... }
    });
    // dispatch({
    //   type: 'approvalMyC/queryList',
    //   payload: { ... }
    // });
  }, []);        
  return (
    <div className={styles['login-wrapper']}>
      
      <div className={styles['title']}>社区动脉物管综合管控云服务平台</div>
      {/* <div className={styles.desc}></div> */}
     
        <Form
          // {...layout}
          name="basic"
          initialValues={{ remember: true }}
          // onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
        >
          <Form.Item
           label=""
           name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input size="large" placeholder="请输入用户名" prefix={<UserOutlined  />}  />
            
          </Form.Item>

          <Form.Item
            label=""
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input size="large" type="password" placeholder="请输入密码" prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item >
            <Button type="primary"  block htmlType="submit"  size="large" >          
              登录
            </Button>
          </Form.Item>
        </Form>
      {/* <NavHead showLogo /> */}
      {/* <Map /> */}
      {/* {!showEqRoom ? <LeftNav /> : <></>}
      {!showEqRoom ? <RightNav /> : <></>}
      <BottomMenu itemHandle={itemHandle} />
      {showEqRoom ? <EqRoom title={roomTitle} roomId={roomId} /> : <></>} */}
    </div>
  );
};
export default connect(({ login }: ConnectState) => ({
  loginInfo: login.login,
}))(Login);
