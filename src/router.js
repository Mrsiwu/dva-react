import React from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import enGB from 'antd/lib/locale-provider/en_GB';
import { getRouterData } from './common/router';
import Authorized from './utils/Authorized';
import { getQueryPath } from './utils/utils';

const { ConnectedRouter } = routerRedux;
const { AuthorizedRoute } = Authorized;

function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);
  const UserLayout = routerData['/user'].component;
  const BasicLayout = routerData['/'].component;

  let lang = zhCN;
  switch (
    window.location.pathname // 域名来区分中英文版
  ) {
    case '/zh_CN/':
      lang = zhCN;
      break;
    case '/en_GB/':
      lang = enGB;
      break;
    default:
  }
  return (
    <LocaleProvider locale={lang}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route path="/user" component={UserLayout} />
          <AuthorizedRoute
            path="/"
            render={props => <BasicLayout {...props} />}
            authority={['admin', 'user']}
            redirectPath={getQueryPath('/user/login', {
              redirect: window.location.href,
            })}
          />
        </Switch>
      </ConnectedRouter>
    </LocaleProvider>
  );
}

export default RouterConfig;
