import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
// import styles from './module.less';

@connect(({ loading }) => ({
  loading: loading.models.list,
}))
export default class ModuleVersion extends Component {
  componentDidMount() {}

  render() {
    // const { loading } = this.props;
    // const formItemLayout = {
    //   wrapperCol: {
    //     xs: { span: 24 },
    //     sm: { span: 24 },
    //     md: { span: 12 },
    //   },
    // };

    return (
      <Fragment>
        <Card bordered={false} />
      </Fragment>
    );
  }
}
