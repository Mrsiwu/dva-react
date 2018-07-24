import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './style.less';

@connect(({ global }) => ({
  global,
}))
export default class UserPermission extends Component {
  state = {};

  render() {
    const { global } = this.props;
    const { lang = 'zhCN', home } = global;

    // const formItemLayout = {
    //   labelCol: {
    //     xs: { span: 24 },
    //     sm: { span: 7 },
    //   },
    //   wrapperCol: {
    //     xs: { span: 24 },
    //     sm: { span: 12 },
    //     md: { span: 10 },
    //   },
    // };
    let texts;
    switch (lang) {
      case 'zhCN':
        texts = {
          title: '平台管理',
          content: '表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。',
        };
        break;
      case 'enGB':
        texts = {
          title: 'User Ppermission',
          content:
            'Form pages are used to collect or verify information from users, and basic forms are common in form forms with fewer data items.',
        };
        break;
      default:
    }
    return (
      <PageHeaderLayout title={texts.title} content={texts.content} lang={lang} home={home}>
        <Card bordered={false} className={styles.card} />
      </PageHeaderLayout>
    );
  }
}
