import React, { useState, useEffect } from 'react';
import { connect, Dispatch } from 'umi';
import { ConnectState } from '@/models/connect';
import { Form, Button, DatePicker, Row, Col, Select, Table, Image } from 'antd';
import moment from 'moment';
import NavHead from '@/compments/nav-header';
import JjzTable from '@/compments/table';
import classnames from 'classnames';
import echarts from 'echarts/lib/echarts';
//导入柱状图
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';

import ReactEcharts from 'echarts-for-react';
import chartOpts from './chart';
import PUBLIC_URL from '@/utils/address';
import { FaceAliasType, peopleTypes } from '@/models/act';
import { inOrOutParamsTypes } from '@/services/act';
import '@/base/less/common.less';
import styles from './index.less';

interface objType {
  id: string;
  name: string;
}

interface ActProps {
  dispatch: Dispatch;
  loading?: boolean;
  nowData: IconsType;
  rankList: {
    name: string;
    value: number;
  }[];
  faceList: [];
  faceRecTotal: number;
  peopleList: peopleTypes[];
  inOrOutTypes: objType[];
  errorTypes: objType[];
  recTypes: objType[];
  faceAlias: FaceAliasType;
  TxtIcons: {
    [index: string]: {
      [index: string]: string;
    };
  };
}

const { Option } = Select;
const selectWidt = 120;

const Act: React.FC<ActProps> = props => {
  const {
    dispatch,
    loading = false,
    nowData = {},
    rankList = [],
    faceList = [],
    peopleList = [],
    inOrOutTypes = [],
    errorTypes = [],
    recTypes = [],
    TxtIcons,
    faceAlias,
    faceRecTotal = 0,
  } = props;

  const [form] = Form.useForm();
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageIndex, setpageIndex] = useState<number>(1);
  const [submitbeginTime, setBeginTime] = useState<string>(getDate('start'))
  const [submitendTime, setEndTime] = useState<string>(getDate('now'))

  const columns = [
    {
      title: '进门/出门',
      dataIndex: 'inOrOutName',
      key: 'inOrOutName',
    },
    {
      title: '异常状态',
      dataIndex: 'errorFlagName',
      key: 'errorFlagName',
    },
    {
      title: '识别类型',
      dataIndex: 'recTypeName',
      key: 'recTypeName',
    },
    {
      title: '温度',
      dataIndex: 'temperature',
      key: 'temperature',
    },
    {
      title: '姓名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '图片',
      key: 'photoPath',
      dataIndex: 'photoPath',
      render: (url: string) =>
        url ? <Image src={`${PUBLIC_URL.imgUrl}${url}`} width={100} /> : <></>,
    },
  ];

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

  function getNow(type?: 'time') {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    let hh = now.getHours();
    let mm = now.getMinutes();
    let ss = now.getSeconds();

    let calc = (n: number) => (n > 9 ? n : `0${n}`);
    if (!type) {
      return `${[year, month, day].map(item => calc(item)).join('-')}`;
    } else {
      return `${[year, month, day].map(item => calc(item)).join('-')} ${[
        hh,
        mm,
        ss,
      ]
        .map(item => calc(item))
        .join(':')}`;
    }
  }

  function getChartOpt() {
    let opt = { ...JSON.parse(JSON.stringify(chartOpts)) };
    if (peopleList.length > 0) {
      opt.xAxis[0].data = [];
      opt.series[0].data = [];
      opt.series[1].data = [];
      peopleList.forEach(item => {
        opt.xAxis[0].data.push(item.time);
        opt.series[0].data.push(item.inCount);
        opt.series[1].data.push(item.outCount);
      });
    }
    return opt;
  }

  function onFinish(values: any) {
    let { beginTime, endTime, inOrOut, errorFlag, recType } = values;
    beginTime = beginTime ? beginTime.format('YYYY-MM-DD HH:mm:ss') : '';
    endTime = endTime ? endTime.format('YYYY-MM-DD HH:mm:ss') : '';
    setBeginTime(beginTime)
    setEndTime(endTime)
    setpageIndex(1);

    let params = {
      pageSize,
      pageIndex,
      inOrOut,
      errorFlag,
      recType,
      beginTime,
      endTime,
    };
    queryList(params);
  }

  function queryList(params: inOrOutParamsTypes) {
    dispatch({
      type: 'act/queryFaceRecList',
      payload: params,
    });
    dispatch({
      type: 'act/queryActTotalNum',
      payload: params,
    });
  }

  useEffect(() => {
    dispatch({
      type: 'act/queryNowData',
      payload: {
        beginTime: getDate('start'),
        endTime: getDate('end'),
      },
    });

    dispatch({
      type: 'act/queryPeopleList',
      payload: {
        beginTime: getDate('now', 7),
        endTime: getDate('now'),
      },
    });

    dispatch({
      type: 'act/queryRankList',
      payload: {
        beginTime: getDate('start', 30),
        endTime: getDate('end'),
      },
    });

    dispatch({
      type: 'act/queryTypes',
    });
  }, []);

  useEffect(() => {
    queryList({
      pageSize,
      pageIndex,
      beginTime: submitbeginTime,
      endTime: submitendTime,
    });
  }, [pageIndex, pageSize]);

  return (
    <div className={styles['act-wrapper']}>
      <NavHead showLogo />
      <div className={styles['act-container']}>
        {/* 实时数据预览 */}
        <div
          className={classnames(styles['act-number-group'], styles['act-card'])}
        >
          <div className={classnames(styles['title'], 'layout-slide')}>
            <span>实时数据预览</span>
            <span>当前日期：{getNow()}</span>
          </div>
          <div className={classnames(styles['act-number-c'], 'layout-slide')}>
            {Object.keys(nowData).map(item => {
              return (
                <div className={styles['act-number-item']} key={item}>
                  <img src={TxtIcons[item].icon} alt="" />
                  <div className={styles['num-c']}>
                    <span>{nowData[item]}</span>
                    <p>{TxtIcons[item].name}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* 人流趋势 */}
        <Row gutter={20}>
          <Col span={16}>
            <div
              className={classnames(styles['act-people-c'], styles['act-card'])}
            >
              <div
                className={classnames(styles['act-rank-title'], 'layout-slide')}
              >
                <span>人流量分支趋势</span>
                <span className={styles['act-people-tag']}>近7天</span>
              </div>
              {/* 柱状图 */}
              <ReactEcharts
                option={getChartOpt()}
                style={{ height: '300px' }}
              />
            </div>
          </Col>
          <Col span={8}>
            <div
              className={classnames(styles['act-rank-c'], styles['act-card'])}
            >
              <div className={styles['act-rank-title']}>近30天门禁使用排行</div>
              <div className={styles['act-rank-list']}>
                <div
                  className={classnames(
                    styles['act-rank-item'],
                    'layout-slide',
                  )}
                >
                  <span>排序</span>
                  <span>门禁名称</span>
                  <span>开门次数</span>
                </div>
                {rankList.map((item, idx) => {
                  return (
                    <div
                      key={item.name}
                      className={classnames(
                        styles['act-rank-item'],
                        'layout-slide',
                      )}
                    >
                      <span>{idx + 1}</span>
                      <span>{item.name || ''}</span>
                      <span>{item.value || 0}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Col>
        </Row>
        <div
          className={classnames(
            styles['act-table-container'],
            styles['act-card'],
          )}
        >
          <div className={styles['act-query-group']}>
            <div className={styles['act-query-title']}>出入明细查询</div>
            <Form
              form={form}
              name="querygroup"
              layout="inline"
              initialValues={{
                beginTime: moment(getDate('start')),
                endTime: moment(getDate('now')),
              }}
              onFinish={onFinish}
            >
              <Form.Item label="进出状态" name="inOrOut">
                <Select style={{ width: selectWidt }} placeholder="进出状态">
                  <Option value="" key="">
                    全部
                  </Option>
                  {inOrOutTypes.map(item => {
                    return (
                      <Option value={item.id} key={item.id}>
                        {item.name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item label="异常状态" name="errorFlag">
                <Select style={{ width: selectWidt }} placeholder="异常状态">
                  <Option value="" key="">
                    全部
                  </Option>
                  {errorTypes.map(item => {
                    return (
                      <Option value={item.id} key={item.id}>
                        {item.name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item label="识别类型" name="recType">
                <Select style={{ width: selectWidt }} placeholder="识别类型">
                  <Option value="" key="">
                    全部
                  </Option>
                  {recTypes.map(item => {
                    return (
                      <Option value={item.id} key={item.id}>
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
            </Form>
          </div>
          <div className={styles['act-table']}>
            <Row gutter={30}>
              <Col span={20}>
                <JjzTable
                  columns={columns}
                  loading={loading}
                  rowKey="id"
                  pageSize={pageSize}
                  datasource={faceList}
                  totalNum={faceRecTotal}
                  pageIndexChange={(page: number) => {
                    setpageIndex(page);
                  }}
                  pageSizeChange={(size: number) => {
                    setPageSize(size);
                  }}
                />
              </Col>
              <Col span={4}>
                <div className={styles['act-total-alis']}>
                  <p>
                    进门：<span>{faceAlias.in}</span>
                  </p>
                  <p>
                    出门：<span>{faceAlias.out}</span>
                  </p>
                  <p>
                    合计：<span>{faceAlias.total}</span>
                  </p>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(({ global, act, loading }: ConnectState) => ({
  pageTitle: global.title,
  loading: loading.effects['act/queryFaceRecList'],
  nowData: act.nowData,
  rankList: act.rankList,
  faceList: act.faceRecList,
  peopleList: act.peopleList,
  TxtIcons: act.txtIcons,
  inOrOutTypes: act.inOrOutTypes,
  errorTypes: act.errorTypes,
  recTypes: act.recTypes,
  faceRecTotal: act.faceRecTotal,
  faceAlias: act.faceAlias,
}))(Act);
