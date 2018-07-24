import React, { createElement } from 'react';
import { Spin } from 'antd';
import pathToRegexp from 'path-to-regexp';
import Loadable from 'react-loadable';
import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // register models
  models.forEach(model => {
    if (modelNotExisted(app, model)) {
      // eslint-disable-next-line
      app.model(require(`../models/${model}`).default);
    }
  });

  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    return props => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return Loadable({
    loader: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache,
          });
      });
    },
    loading: () => {
      return <Spin size="large" className="global-spin" />;
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach(item => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = app => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    },
    '/platform/module-menu': {
      component: dynamicWrapper(app, [], () => import('../routes/platform/module')),
    },
    '/platform/module-menu/list': {
      component: dynamicWrapper(app, [], () => import('../routes/platform/module/list')),
    },
    '/platform/module-menu/version': {
      component: dynamicWrapper(app, [], () => import('../routes/platform/module/version')),
    },
    '/platform/system-setting': {
      component: dynamicWrapper(app, [], () => import('../routes/platform/system')),
    },
    '/platform/user-permission': {
      component: dynamicWrapper(app, [], () => import('../routes/platform/permission')),
    },
    '/platform/user-permission/ruler': {
      component: dynamicWrapper(app, [], () => import('../routes/platform/permission/ruler')),
    },
    '/platform/user-permission/role': {
      component: dynamicWrapper(app, [], () => import('../routes/platform/permission/role')),
    },
    '/platform/platform-manage': {
      component: dynamicWrapper(app, ['netschool'], () => import('../routes/platform/manage')),
    },
    '/platform/school-list': {
      component: dynamicWrapper(app, ['netschool'], () => import('../routes/platform/school')),
    },
    '/platform/user-list': {
      component: dynamicWrapper(app, [], () => import('../routes/platform/user')),
    },
    '/platform/user-list/teachers': {
      component: dynamicWrapper(app, [], () => import('../routes/platform/user/teachers')),
    },
    '/platform/user-list/student': {
      component: dynamicWrapper(app, [], () => import('../routes/platform/user/student')),
    },
    // 运营中心
    '/operating/Operation-log': {
      component: dynamicWrapper(app, [], () => import('../routes/Operating/Operation')),
    },
    '/operating/System-environment': {
      component: dynamicWrapper(app, [], () => import('../routes/Operating/System')),
    },
    '/operating/Add-users': {
      component: dynamicWrapper(app, [], () => import('../routes/Operating/Add')),
    },
    '/operating/Flow-analysis': {
      component: dynamicWrapper(app, [], () => import('../routes/Operating/Flow')),
    },
    '/operating/Login-log': {
      component: dynamicWrapper(app, [], () => import('../routes/Operating/Login')),
    },
    '/dashboard/analysis': {
      component: dynamicWrapper(app, ['chart'], () => import('../routes/Dashboard/Analysis')),
    },
    '/dashboard/monitor': {
      component: dynamicWrapper(app, ['monitor'], () => import('../routes/Dashboard/Monitor')),
    },
    '/dashboard/workplace': {
      component: dynamicWrapper(app, ['project', 'activities', 'chart'], () =>
        import('../routes/Dashboard/Workplace')
      ),
      // hideInBreadcrumb: true,
      // name: '工作台',
      // authority: 'admin',
   },
    //网校管理
    '/school-manage/teach-manage/class-manage': {
      component: dynamicWrapper(app, [], () => import('../routes/Schoolmanage/Teachmanage/Classmanage')),
    },
    '/school-manage/teach-manage/pushwork': {
      component: dynamicWrapper(app, [], () => import('../routes/Schoolmanage/Teachmanage/Pushwork')),
    },
    '/school-manage/teach-manage/questions': {
      component: dynamicWrapper(app, [], () => import('../routes/Schoolmanage/Teachmanage/Questions')),
    },
    '/school-manage/teach-manage/attendance': {
      component: dynamicWrapper(app, [], () => import('../routes/Schoolmanage/Teachmanage/Attendance')),
    },
    '/school-manage/teach-manage/attendance/course-list': {
      component: dynamicWrapper(app, [], () => import('../routes/Schoolmanage/Teachmanage/Attendance/Courselist')),
    },
    '/school-manage/teach-manage/attendance/class-list': {
      component: dynamicWrapper(app, [], () => import('../routes/Schoolmanage/Teachmanage/Attendance/Classlist')),
    },
    '/school-manage/teach-manage/data-analyse': {
      component: dynamicWrapper(app, [], () => import('../routes/Schoolmanage/Teachmanage/Dataanalyse')),
    },
    //短信设置
    '/school-manage/school-setting/note-setting': {
      component: dynamicWrapper(app, ['chart','rule','form'], () =>
        import('../routes/Schoolmanage/Schoolsetting/NoteSetting/NoteSettingCharge.js')
      ),
    },
    //黑名单
    '/school-manage/school-setting/filter-blacklist': {
    	component: dynamicWrapper(app, [], () => import('../routes/Schoolmanage/Schoolsetting/Blacklist')),
    },
    '/form/basic-form': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/BasicForm')),
    },
    '/form/step-form': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm')),
    },
    '/form/step-form/info': {
      name: '分步表单（填写转账信息）',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step1')),
    },
    '/form/step-form/confirm': {
      name: '分步表单（确认转账信息）',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step2')),
    },
    '/form/step-form/result': {
      name: '分步表单（完成）',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step3')),
    },
    '/form/advanced-form': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/AdvancedForm')),
    },
    '/list/table-list': {
      component: dynamicWrapper(app, ['rule'], () => import('../routes/List/TableList')),
    },
    '/list/basic-list': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/BasicList')),
    },
    '/list/card-list': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/CardList')),
    },
    '/list/search': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/List')),
    },
    '/list/search/projects': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Projects')),
    },
    '/list/search/applications': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Applications')),
    },
    '/list/search/articles': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Articles')),
    },
    '/profile/basic': {
      component: dynamicWrapper(app, ['profile'], () => import('../routes/Profile/BasicProfile')),
    },
    '/profile/advanced': {
      component: dynamicWrapper(app, ['profile'], () =>
        import('../routes/Profile/AdvancedProfile')
      ),
    },
    '/result/success': {
      component: dynamicWrapper(app, [], () => import('../routes/Result/Success')),
    },
    '/result/fail': {
      component: dynamicWrapper(app, [], () => import('../routes/Result/Error')),
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/exception/trigger': {
      component: dynamicWrapper(app, ['error'], () =>
        import('../routes/Exception/triggerException')
      ),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    },
    '/user/register': {
      component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
    },
    '/user/register-result': {
      component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
    },
    '/Customer/userservice': {
      component: dynamicWrapper(app, [], () => import('../routes/Customer/Userservice')),
    },
    '/Customer/schoolservice': {
      component: dynamicWrapper(app, [], () => import('../routes/Customer/Schoolservice')),
    },
    '/Customer/dataaudit': {
      component: dynamicWrapper(app, [], () => import('../routes/Customer/Dataaudit')),
    },
    '/Customer/summary': {
      component: dynamicWrapper(app, [], () => import('../routes/Customer/Summary')),
    },
    '/Customer/feedback': {
      component: dynamicWrapper(app, [], () => import('../routes/Customer/Feedback')),
    },
    //  '/user/:id': {
    //    component: dynamicWrapper(app, [], () => import('../routes/User/SomeComponent')),
    //  },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());

  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach(path => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      ...menuItem,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
      hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
    };
    routerData[path] = router;
  });
  return routerData;
};
