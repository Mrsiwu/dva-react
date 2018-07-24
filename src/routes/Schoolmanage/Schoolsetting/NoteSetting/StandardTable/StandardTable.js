import React, { PureComponent } from 'react';
import { Table } from 'antd';
import styles from './index.less';

class StandardTable extends PureComponent {
  constructor(props) {
    super(props);
  }

  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    onChange(pagination, filters, sorter);
  };

  render() {
    const {
      data: { list, pagination },
      loading,
      columns,
    } = this.props; 

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    return (
      <div className={styles.standardTable}>
        <Table
          loading={loading}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default StandardTable;
