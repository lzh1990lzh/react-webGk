import React, { useEffect } from 'react';
import { stringify } from 'querystring';
import { history, Reducer, Effect } from 'umi';
import md5 from 'md5';

import { fakeAccountLogin } from '@/services/login';
//import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { json } from 'express';
import { Session, Local  } from '@/utils/session';


export interface StateType {
  status?: string;
  type?: string;
  id?: string;
  groupId?: string;
  groupName?: string;
  companyId?: string;
  companyName?: string;
  communityId?: string;
  communityName?: string;
  userName?: string;
  userNumber?: string;
  password?: string;
  phone?: string;
  gender?: string;
  level?: string;
  userType?: string;
  isdisable?: string;
  userHead?: string;
  createUser?: string;
  createTime?: string;
  updateUser?: string;
  updateTime?: string;
  isdelete?: string;
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    setLoginInfo: Reducer<StateType>;
  };
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {    
      const { userPassword } = payload
      const params = {
        ...payload,
        userPassword: userPassword ? md5(userPassword).toUpperCase() : ''
      }
      const response = yield call(fakeAccountLogin, params);
      console.log(response,"--response");
      const {userNumber}= payload
      if (!response) return
      const { code, data = {} } = response
      const dataResponse = data ? JSON.parse(JSON.stringify(data)) : {}     
     
      const userName=dataResponse.userName;
      Object.keys(dataResponse).forEach(item => {
        if (item === 'userPasswrod') {
          delete dataResponse[item]
        }
      })
      Object.assign(dataResponse, {
        code,
      })
      yield put({
        type: 'setLoginInfo',
        payload: dataResponse,
      });
     
      Session.set('userName',userName);
      if (response.code === '0') {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);          
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) { 
              redirect = "/Approval/Submitted";
              //redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        history.replace(redirect || '/');
      }
    },

    logout() {
      const { redirect } = getPageQuery();
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/login' && !redirect) {
        history.replace({
          pathname: '/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },

  reducers: {
    setLoginInfo(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      if (Object.keys(payload).length > 0) {
        Session.set('userInfo', payload)
      }

      //const { code = '' } = payload
      return {
        ...state,
        status: payload.code,
        type: 'account',
        ...payload
      };
    },
  },
};

export default Model;
