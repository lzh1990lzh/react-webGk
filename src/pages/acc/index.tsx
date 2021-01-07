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
import { CarFaceAliasType, carChangeTypes } from '@/models/acc';
import { inOrOutParamsTypes } from '@/services/act';
import '@/base/less/common.less';
import styles from './index.less';

interface objType {
  type: string;
  typeName: string;
}

interface AccProps {
  dispatch: Dispatch;
  loading?: boolean;
  nowData: IconsType;
  rankList: {
    name: string;
    value: number;
  }[];
  inOutList: [];
  faceRecTotal: number;
  carChangeList: carChangeTypes[];
  inOrOutTypes: objType[];
  faceAlias: CarFaceAliasType;
  TxtIcons: {
    [index: string]: {
      [index: string]: string;
    };
  };
}

const { Option } = Select;
const selectWidt = 120;

const Acc: React.FC<AccProps> = props => {
  const {
    dispatch,
    loading = false,
    nowData = {},
    rankList = [],
    inOutList = [],
    carChangeList = [],
    inOrOutTypes = [],
    TxtIcons,
    faceAlias,
    faceRecTotal = 0,
  } = props;

  const [form] = Form.useForm();
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);

  const columns = [
    {
      title: '进出状态',
      dataIndex: 'statusName',
      key: 'statusName',
    },
    {
      title: '车辆类型',
      dataIndex: 'carType',
      key: 'carType',
    },
    {
      title: '车牌号',
      dataIndex: 'carNo',
      key: 'carNo',
    },
    {
      title: '停车时长',
      dataIndex: 'staySpan',
      key: 'staySpan',
    },
    {
      title: '通道名称',
      dataIndex: 'channelName',
      key: 'channelName',
    },
    {
      title: '操作员姓名',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '进/出时间',
      dataIndex: 'crossTime',
      key: 'crossTime',
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
    if (carChangeList.length > 0) {
      opt.xAxis[0].data = [];
      opt.series[0].data = [];
      opt.series[1].data = [];
      carChangeList.forEach(item => {
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
    setPageNum(1);

    let params = {
      pageSize,
      pageNum,
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
      type: 'acc/queryInOutList',
      payload: params,
    });
    dispatch({
      type: 'acc/queryTotalNum',
      payload: params,
    });
  }

  useEffect(() => {
    dispatch({
      type: 'acc/queryNowData',
      payload: {
        beginTime: getDate('start'),
        endTime: getDate('end'),
      },
    });

    dispatch({
      type: 'acc/querycarChangeList',
      payload: {
        beginTime: getDate('now', 7),
        endTime: getDate('now'),
      },
    });

    dispatch({
      type: 'acc/queryRankList',
      payload: {
        beginTime: getDate('start', 30),
        endTime: getDate('end'),
      },
    });

    dispatch({
      type: 'acc/queryTypes',
    });
  }, []);

  useEffect(() => {
    queryList({
      pageSize,
      pageNum,
      beginTime: getDate('start'),
      endTime: getDate('now'),
    });
  }, [pageNum, pageSize]);

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
                <span>车流量分支趋势</span>
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
              <div className={styles['act-rank-title']}>本月道闸使用排行</div>
              <div className={styles['act-rank-list']}>
                <div
                  className={classnames(
                    styles['act-rank-item'],
                    'layout-slide',
                  )}
                >
                  <span>排序</span>
                  <span>通道名称</span>
                  <span>进/出车数量</span>
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
                      <Option value={item.type} key={item.type}>
                        {item.typeName}
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
                  datasource={inOutList}
                  totalNum={faceRecTotal}
                  pageNumChange={(page: number) => {
                    setPageNum(page);
                  }}
                  pageSizeChange={(size: number) => {
                    setPageSize(size);
                  }}
                />
              </Col>
              <Col span={4}>
                <div className={styles['act-total-alis']}>
                  <p>
                    进门：<span>{faceAlias.inTotalCount}</span>
                  </p>
                  <p>
                    出门：<span>{faceAlias.outTotalCount}</span>
                  </p>
                  <p>
                    合计：<span>{faceAlias.sumCount}</span>
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

export default connect(({ global, acc, loading }: ConnectState) => ({
  pageTitle: global.title,
  loading: loading.effects['acc/queryInOutList'],
  nowData: acc.nowData,
  rankList: acc.rankList,
  inOutList: acc.inOutList,
  carChangeList: acc.carChangeList,
  TxtIcons: acc.txtIcons,
  inOrOutTypes: acc.inOrOutTypes,
  faceRecTotal: acc.faceRecTotal,
  faceAlias: acc.faceAlias,
}))(Acc);
