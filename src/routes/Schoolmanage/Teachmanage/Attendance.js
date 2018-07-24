import React, { Component } from 'react';
import { routerRedux, Redirect, Route, Switch } from 'dva/router';
import { connect } from 'dva';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import { getRoutes } from '../../../utils/utils';

@connect(({ global }) => ({
  global,
}))
export default class ModuleMenu extends Component {
	handleTabChange = key => {
    const { dispatch, match } = this.props;
    switch (key) {
      case 'course-list':
        dispatch(routerRedux.push(`${match.url}/course-list`));
        break;
      case 'class-list':
        dispatch(routerRedux.push(`${match.url}/class-list`));
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
          title: '考勤统计',
          content: '表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。',
          tabList: [
            {
              key: 'course-list',
              tab: '课件列表',
            },
            {
              key: 'class-list',
              tab: '班级列表',
            },
          ],
        };
        break;
      case 'enGB':
        language = {
          title: 'Attendance',
          content:
            'Form pages are used to collect or verify information from users, and basic forms are common in form forms with fewer data items.',
          tabList: [
            {
              key: 'course-list',
              tab: 'Courselist',
            },
            {
              key: 'class-list',
              tab: 'Classlist',
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
            key="/school-manage/teach-manage/attendance"
            exact
            from="/school-manage/teach-manage/attendance"
            to="/school-manage/teach-manage/attendance/course-list"
          />
          {routes.map(item => (
            <Route key={item.key} path={item.path} component={item.component} exact={item.exact} />
          ))}
        </Switch>
      </PageHeaderLayout>
    );
  }
}
