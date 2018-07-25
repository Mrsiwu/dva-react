import React, { Component } from 'react';
import { routerRedux, Redirect, Route, Switch } from 'dva/router';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getRoutes } from '../../utils/utils';

@connect(({ global }) => ({
  global,
}))
export default class UserPermission extends Component {
  handleTabChange = key => {
    const { dispatch, match } = this.props;
    switch (key) {
      case 'ruler':
        dispatch(routerRedux.push(`${match.url}/ruler`));
        break;
      case 'role':
        dispatch(routerRedux.push(`${match.url}/role`));
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
          title: '用户权限',
          content: '表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。',
          tabList: [
            {
              key: 'ruler',
              tab: '用户列表',
            },
            {
              key: 'role',
              tab: '角色管理',
            },
          ],
        };
        break;
      case 'enGB':
        language = {
          title: 'User permission',
          content:
            'Form pages are used to collect or verify information from users, and basic forms are common in form forms with fewer data items.',
          tabList: [
            {
              key: 'ruler',
              tab: 'User list',
            },
            {
              key: 'role',
              tab: 'Role management',
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
            key="/platform/user-permission"
            exact
            from="/platform/user-permission"
            to="/platform/user-permission/ruler"
          />
          {routes.map(item => (
            <Route key={item.key} path={item.path} component={item.component} exact={item.exact} />
          ))}
        </Switch>
      </PageHeaderLayout>
    );
  }
}
