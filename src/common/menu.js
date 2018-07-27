import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: '平台总管理',
    zhCN: '平台总管理',
    enGB: 'Platform',
    icon: 'dashboard',
    path: 'platform',
    children: [
      {
        name: '模块菜单',
        zhCN: '模块菜单',
        enGB: 'Module Menu',
        path: 'module-menu',
      },
      {
        name: '系统功能',
        zhCN: '系统功能',
        enGB: 'System Setting',
        path: 'system-setting',
      },
      {
        name: '用户权限',
        zhCN: '用户权限',
        enGB: 'User Permission',
        path: 'user-permission',
      },
      {
        name: '平台管理',
        zhCN: '平台管理',
        enGB: 'Platform Manage',
        path: 'platform-manage',
      },
      {
        name: '网校列表',
        zhCN: '网校列表',
        enGB: 'School List',
        path: 'school-list',
      },
      {
        name: '用户列表',
        zhCN: '用户列表',
        enGB: 'User List',
        path: 'user-list',
      },
    ],
  },
  {
    name: '网校管理',
    zhCN: '网校管理',
    enGB: 'School Manage',
    icon: 'tool',
    path: 'school-manage',
    children: [
      {
        name: '教学管理',
        zhCN: '教学管理',
        enGB: 'Teach Manage',
        path: 'teach-manage',
        children:[
        	{
        		name:'授课管理',
        		zhCN: '授课管理',
        		enGB: 'Class Manage',
        		path:'class-manage'
        	},
        	{
        		name:'布置作业',
        		zhCN:'布置作业',
        		enGB: 'Pushwork',
        		path:'pushwork'
        	},
        	{
        		name:'互动答疑',
        		zhCN:'互动答疑',
        		enGB: 'Questions',
        		path:'questions'
        	},
        	{
        		name:'考勤统计',
        		zhCN:'考勤统计',
        		enGB:'Attendance',
        		path:'attendance'
        	},
        	{
        		name:'数据分析',
        		zhCN:'数据分析',
        		enGB:'Data Analyse',
        		path:'data-analyse'
        	}
        ]
      },
      {
        name: '网校设置',
        zhCN: '网校设置',
        enGB: 'school-setting',
        path: 'school-setting',
        children: [
          {
            name: '推广设置',
            path: 'seo-setting',
          },
          {
            name: '短信设置',
            enGb: 'Note Setting',
            path: 'note-setting',
          },
          {
        	  name:'黑名单过滤',
       		  zhCN: '黑名单过滤',
       		  enGB: 'Filter BlackList',
       		  path:'filter-blacklist'
           }
        ],
      },
      {
        name: '用户管理',
        zhCN: '用户管理',
        enGB: 'User Manage',
        path: 'user-manage',
      },
    ],
  },
  {
    name: '运营中心',
    zhCN: '运营中心',
    enGB: 'operating',
    icon: 'dashboard',
    path: 'operating',
    children: [
      {
        name: '操作日志',
        enGB: 'Operation Log',
        path: 'Operation-log',
      },
      {
        name: '系统环境',
        enGB: 'System Environment',
        path: 'System-environment',
      },
      {
        name: '新增用户',
        enGB: 'Add Users',
        path: 'Add-users',
      },
      {
        name: '流量分析',
        enGB: 'Flow Analysis',
        path: 'Flow-analysis',
      },
      {
        name: '登录日志',
        enGB: 'Login Log',
        path: 'Login-log',
      },
    ],
  },
  {
    name: 'dashboard',
    icon: 'dashboard',
    path: 'dashboard',
    children: [
      {
        name: '分析页',
        path: 'analysis',
      },
      {
        name: '监控页',
        path: 'monitor',
      },
      {
        name: '工作台',
        path: 'workplace',
        // hideInBreadcrumb: true,
        // hideInMenu: true,
      },
    ],
  },
  {
    name: '表单页',
    icon: 'form',
    path: 'form',
    children: [
      {
        name: '基础表单',
        path: 'basic-form',
      },
      {
        name: '分步表单',
        path: 'step-form',
      },
      {
        name: '高级表单',
        authority: 'admin',
        path: 'advanced-form',
      },
    ],
  },
  {
    name: '列表页',
    icon: 'table',
    path: 'list',
    children: [
      {
        name: '查询表格',
        path: 'table-list',
      },
      {
        name: '标准列表',
        path: 'basic-list',
      },
      {
        name: '卡片列表',
        path: 'card-list',
      },
      {
        name: '搜索列表',
        path: 'search',
        authority: 'admin',
        // children: [
        //   {
        //     name: '搜索列表（文章）',
        //     path: 'articles',
        //   },
        //   {
        //     name: '搜索列表（项目）',
        //     path: 'projects',
        //   },
        //   {
        //     name: '搜索列表（应用）',
        //     path: 'applications',
        //   },
        // ],
      },
    ],
  },
  {
    name: '详情页',
    icon: 'profile',
    path: 'profile',
    children: [
      {
        name: '基础详情页',
        path: 'basic',
      },
      {
        name: '高级详情页',
        path: 'advanced',
        authority: 'admin',
      },
    ],
  },
  {
    name: '结果页',
    icon: 'check-circle-o',
    path: 'result',
    children: [
      {
        name: '成功',
        path: 'success',
      },
      {
        name: '失败',
        path: 'fail',
      },
    ],
  },
  {
    name: '异常页',
    icon: 'warning',
    path: 'exception',
    children: [
      {
        name: '403',
        path: '403',
      },
      {
        name: '404',
        path: '404',
      },
      {
        name: '500',
        path: '500',
      },
      {
        name: '触发异常',
        path: 'trigger',
        hideInMenu: true,
      },
    ],
  },
  {
    name: '账户',
    icon: 'user',
    path: 'user',
    authority: 'guest',
    children: [
      {
        name: '登录',
        path: 'login',
      },
      {
        name: '注册',
        path: 'register',
      },
      {
        name: '注册结果',
        path: 'register-result',
      },
    ],
  },
  {
    name: '客户服务',
    icon: 'customer-service',
    path: 'customer',
    zhCN: '客户服务',
    enGB: 'customer service',
    children: [
      {
        name: '用户服务',
        enGB: 'User service',
        path: 'userservice',
      },
      {
        name: '网校服务',
        enGB: 'Network school service',
        path: 'schoolservice',
      },
      {
        name: '数据审核',
        enGB: 'Data audit',
        path: 'dataaudit',
      },
      {
        name: '审核汇总',
        enGB: 'Review and summary',
        path: 'summary',
      },
      {
        name: '用户反馈',
        enGB: 'User feedback',
        path: 'feedback',
      },
    ],
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
