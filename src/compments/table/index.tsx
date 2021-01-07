import React, { useState } from 'react';
import { Table } from 'antd';
import styles from './index.less';

interface TableProps {
  columns: any[];
  datasource: any[];
  loading: boolean;
  pageSize: number;
  totalNum: number;
  rowKey: string;
  pageIndexChange: (n: number) => void;
  pageSizeChange: (n: number) => void;
}
const JjzTable: React.FC<TableProps> = props => {
  const {
    columns = [],
    datasource = [],
    loading = false,
    pageSize = 10,
    totalNum = 0,
    rowKey,
    pageIndexChange,
    pageSizeChange,
  } = props;

  return (
    <Table
      columns={columns}
      dataSource={datasource}
      bordered
      loading={loading}
      rowKey={rowKey}
      pagination={{
        pageSize,
        total: totalNum,
        showQuickJumper: true,
        onChange: (page: number) => {
          pageIndexChange(page);
        },
        onShowSizeChange: (current: number, size: number) => {
          pageSizeChange(size);
        },
      }}
    />
  );
};
export default JjzTable;
