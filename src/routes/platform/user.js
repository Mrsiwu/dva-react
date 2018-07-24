import React, { Component } from 'react';
import { routerRedux, Redirect, Route, Switch } from 'dva/router';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getRoutes } from '../../utils/utils';

@connect(({ global }) => ({
  global,
}))
export default class UserList extends Component {
  handleTabChange = key => {
    const { dispatch, match } = this.props;
    switch (key) {
      case 'teachers':
        dispatch(routerRedux.push(`${match.url}/teachers`));
        break;
      case 'student':
        dispatch(routerRedux.push(`${match.url}/student`));
        break;
      default:
        break;
    }
  };
  render() {
    const { match, routerData, location, global } = this.props;
    const routes = getRoutes(match.path, routerData);
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
          title: '网校用户列表',
          content: '表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。',
		  tabList: [
            {
              key: 'teachers',
              tab: '教师列表',
            },
            {
              key: 'student',
              tab: '学生管理',
            },
          ],
        };
        break;
      case 'enGB':
        texts = {
          title: 'User list',
          content:
            'Form pages are used to collect or verify information from users, and basic forms are common in form forms with fewer data items.',
          tabList: [
            {
              key: 'teachers',
              tab: 'Teachers list',
            },
            {
              key: 'student',
              tab: 'Student list',
            },
          ],
        };
        break;
      default:
    }
    return (
      <PageHeaderLayout
        title={texts.title}
        content={texts.content}
        lang={lang}
        home={home}
        tabList={texts.tabList}
        tabActiveKey={location.pathname.replace(`${match.path}/`, '')}
        onTabChange={this.handleTabChange}
      >
        <Switch>
          <Redirect
            key="/platform/user-list"
            exact
            from="/platform/user-list"
            to="/platform/user-list/teachers"
          />
          {routes.map(item => (
            <Route key={item.key} path={item.path} component={item.component} exact={item.exact} />
          ))}
        </Switch>
      </PageHeaderLayout>
    );
  }
}
