import React, { Component } from 'react';
import { routerRedux, Redirect, Route, Switch } from 'dva/router';
import { connect } from 'dva';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import { getRoutes } from '../../../utils/utils';

@connect(({ global }) => ({
  global,
}))
export default class ManageMenu extends Component {
	handleTabChange = key => {
    const { dispatch, match } = this.props;
    switch (key) {
      case 'teaher':
        dispatch(routerRedux.push(`${match.url}/teaher`));
        break;
      case 'student':
        dispatch(routerRedux.push(`${match.url}/student`));
        break;
      case 'class':
        dispatch(routerRedux.push(`${match.url}/class`));
        break;
      default:
        break;
    }
  };

  render() {
    const { match, routerData, location, global } = this.props;
    const routes = getRoutes(match.path, routerData);
    const { lang = 'zhCN', home } = global;
    let language;
    switch (lang) {
      case 'zhCN':
        language = {
          title: '用户管理',
          content: '表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。',
          tabList: [
            {
              key: 'teaher',
              tab: '教师管理',
            },
            {
              key: 'student',
              tab: '学生管理',
            },
            {
              key: 'class',
              tab: '班级管理',
            },
          ],
        };
        break;
      case 'enGB':
        language = {
          title: 'User management',
          content:
            'Form pages are used to collect or verify information from users, and basic forms are common in form forms with fewer data items.',
          tabList: [
            {
              key: 'teaher',
              tab: 'Teaher management',
            },
            {
              key: 'student',
              tab: 'Student management',
            },
            {
              key: 'class',
              tab: 'Class management',
            },
          ],
        };
        break;
      default:
    }
    return (
      <PageHeaderLayout
        title={language.title}
        content={language.content}
        lang={lang}
        home={home}
        tabList={language.tabList}
        tabActiveKey={location.pathname.replace(`${match.path}/`, '')}
        onTabChange={this.handleTabChange}
      >
        <Switch>
          <Redirect
            key="/school-manage/user-manage"
            exact
            from="/school-manage/user-manage" 
            to="/school-manage/user-manage/teaher"
          />
          {routes.map(item => (
            <Route key={item.key} path={item.path} component={item.component} exact={item.exact} />
          ))}
        </Switch>
      </PageHeaderLayout>
    );
  }
}
