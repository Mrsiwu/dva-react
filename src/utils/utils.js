import moment from 'moment';
import { parse, stringify } from 'qs';

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeString(time) {
  if (
    new Date(parseInt(time)) == 'Invalid Date' &&
    new Date(parseInt(time) * 1000) == 'Invalid Date'
  )
    return '--';
  let now;
  if ((time + '').length == 10) {
    now = new Date(parseInt(time) * 1000);
  } else if ((time + '').length == 13) {
    now = new Date(parseInt(time));
  } else {
    return '--';
  }
  let month = parseInt(now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
  let day = parseInt(now.getDate()) < 10 ? '0' + now.getDate() : now.getDate();
  let hours = parseInt(now.getHours()) < 10 ? '0' + now.getHours() : now.getHours();
  let minute = parseInt(now.getMinutes()) < 10 ? '0' + now.getMinutes() : now.getMinutes();
  return `${now.getFullYear()}-${month}-${day} ${hours}:${minute}`;
}

export function getTimeDay(time) {
  if (
    new Date(parseInt(time)) == 'Invalid Date' &&
    new Date(parseInt(time) * 1000) == 'Invalid Date'
  )
    return '--';
  let now;
  if ((time + '').length == 10) {
    now = new Date(parseInt(time) * 1000);
  } else if ((time + '').length == 13) {
    now = new Date(parseInt(time));
  } else {
    return '--';
  }
  let month = parseInt(now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
  let day = parseInt(now.getDate()) < 10 ? '0' + now.getDate() : now.getDate();
  return `${now.getFullYear()}-${month}-${day} `;
}

export function getDays(time) {
  if (
    new Date(parseInt(time)) == 'Invalid Date' &&
    new Date(parseInt(time) * 1000) == 'Invalid Date'
  )
    return '--';
  let now;
  let string = '';
  if ((time + '').length == 10) {
    now = new Date(parseInt(time) * 1000);
  } else if ((time + '').length == 13) {
    now = new Date(parseInt(time));
  } else {
    return '--';
  }
  let month = parseInt(now.getMonth() + 1) < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
  let day = parseInt(now.getDate()) < 10 ? '0' + now.getDate() : now.getDate();
  string = `${now.getFullYear()}-${month}-${day} `;
  let newdate = new Date();
  if (Date.parse(newdate) - Date.parse(now) < 172800000) {
    if (now.getDate() == newdate.getDate()) {
      string = '今天';
    } else if (newdate.getDate() - now.getDate() == 1) {
      string = '昨天';
    }
  }
  return string;
}

export function getTimes(time) {
  if (
    new Date(parseInt(time)) == 'Invalid Date' &&
    new Date(parseInt(time) * 1000) == 'Invalid Date'
  )
    return '--';
  let now;
  if ((time + '').length == 10) {
    now = new Date(parseInt(time) * 1000);
  } else if ((time + '').length == 13) {
    now = new Date(parseInt(time));
  } else {
    return '--';
  }
  let hours = parseInt(now.getHours()) < 10 ? '0' + now.getHours() : now.getHours();
  let minute = parseInt(now.getMinutes()) < 10 ? '0' + now.getMinutes() : now.getMinutes();
  return `${hours}:${minute}`;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  if (type === 'year') {
    const year = now.getFullYear();

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  }
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

function accMul(arg1, arg2) {
  let m = 0;
  const s1 = arg1.toString();
  const s2 = arg2.toString();
  m += s1.split('.').length > 1 ? s1.split('.')[1].length : 0;
  m += s2.split('.').length > 1 ? s2.split('.')[1].length : 0;
  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / 10 ** m;
}

export function digitUppercase(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟', '万']];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(accMul(num, 10 * 10 ** index)) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s
    .replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}
