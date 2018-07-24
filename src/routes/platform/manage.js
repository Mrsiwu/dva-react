import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  List,
  Form,
  Input,
  Button,
  Radio,
  Checkbox,
  Select,
  Upload,
  Icon,
  DatePicker,
  Avatar,
  Pagination,
  Spin,
  Badge,
  Divider,
  Popover,
  Modal,
  InputNumber,
  Slider,
  Table,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { enquireScreen, onlyenquireScreen, unenquireScreen } from 'enquire-js';
import { getTimeString, getTimeDay } from '../../utils/utils';
import Ellipsis from 'components/Ellipsis';
import WindowScroller from 'react-virtualized/dist/commonjs/WindowScroller';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import VList from 'react-virtualized/dist/commonjs/List';
import InfiniteLoader from 'react-virtualized/dist/commonjs/InfiniteLoader';
import styles from './style.less';
const FormItem = Form.Item;
const { Meta } = Card;
const { Option } = Select;
const { RangePicker } = DatePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
let isMobile;
enquireScreen(b => {
  isMobile = b;
});
@connect(({ global, netschool, loading }) => ({
  global,
  netschool,
  loading: loading.effects['netschool/fetchNetschoolLists'],
}))
@Form.create()
export default class PlatformManage extends PureComponent {
  state = {
    isMobile,
    isdefault: 0,
    paymentmethod: 0,
    paysetvisible: false,
    modulevisible: false,
    addeditplatformvisible: false,
    data: [],
    page: 1,
    pagesize: 50,
  };
  loadedRowsMap = {};
  componentDidMount() {
    this.enquireHandler = onlyenquireScreen(mobile => {
      this.setState({
        isMobile: mobile,
      });
    });

    const { dispatch } = this.props;
    dispatch({
      type: 'netschool/fetchNetschoolLists',
      payload: {
        page: 1,
      },
      callback: data => {
        this.setState({
          data: data,
        });
      },
    });
  }

  componentWillUnmount() {
    unenquireScreen(this.enquireHandler);
  }

  handleInfiniteOnLoad = ({ startIndex, stopIndex }) => {
    const { netschool } = this.props;
    let data = this.state.data;
    for (let i = startIndex; i <= stopIndex; i++) {
      // 1 means loading
      this.loadedRowsMap[i] = 1;
    }
    let len =
      parseInt(netschool.total) / 50 > this.state.page ? 50 : parseInt(netschool.total) % 50;
    if (data.length > len) {
      return;
    }
  };
  isRowLoaded = ({ index }) => {
    return !!this.loadedRowsMap[index];
  };

  showModal = (e, item) => {
    console.log(item);
    this.setState({
      paysetvisible: true,
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      paysetvisible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      paysetvisible: false,
    });
  };
  paymentmethodChange = e => {
    this.setState({
      paymentmethod: e.target.value,
    });
    console.log(e);
  };
  paymentinterfaceChange = e => {
    this.setState({
      isdefault: e.target.value,
    });
    console.log(e);
  };
  renderpaysetmodal() {
    const { getFieldDecorator } = this.props.form;
    const { isdefault, paymentmethod } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    let paymentmethodfrom = (
      <FormItem {...formItemLayout} label="支付方式">
        {getFieldDecorator('paymentmethod', {
          initialValue: '0',
        })(
          <RadioGroup onChange={this.paymentmethodChange}>
            <RadioButton value="0">支付宝</RadioButton>
            <RadioButton value="1">微信</RadioButton>
          </RadioGroup>
        )}
      </FormItem>
    );

    let appidfrom = (
      <FormItem {...formItemLayout} label="appid">
        {getFieldDecorator('appid', {
          rules: [
            {
              required: true,
              message: '请输入',
            },
          ],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    );
    let mchidfrom = (
      <FormItem {...formItemLayout} label="mchid">
        {getFieldDecorator('mchid', {
          rules: [
            {
              required: true,
              message: '请输入',
            },
          ],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    );
    let wechartkeyfrom = (
      <FormItem {...formItemLayout} label="wechartkey">
        {getFieldDecorator('wechartkey', {
          rules: [
            {
              required: true,
              message: '请输入',
            },
          ],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    );
    let secretfrom = (
      <FormItem {...formItemLayout} label="secret">
        {getFieldDecorator('secret', {
          rules: [
            {
              required: true,
              message: '请输入',
            },
          ],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    );
    let privatekeyfrom = (
      <FormItem {...formItemLayout} label="商户的私钥">
        {getFieldDecorator('privatekey', {
          rules: [
            {
              required: true,
              message: '请输入商户的私钥',
            },
          ],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    );
    let publickeyfrom = (
      <FormItem {...formItemLayout} label="支付宝公钥">
        {getFieldDecorator('publickey', {
          rules: [
            {
              required: true,
              message: '请输入支付宝公钥',
            },
          ],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    );
    let ifsandboxfrom = (
      <FormItem {...formItemLayout} label="是否沙箱环境" extra="仅测试勾选，需要对应账号">
        {getFieldDecorator('ifsandbox', {
          valuePropName: 'checked',
          initialValue: true,
        })(<Checkbox />)}
      </FormItem>
    );
    return (
      <Modal
        title="支付设置"
        visible={this.state.paysetvisible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form>
          <FormItem {...formItemLayout} label="支付接口">
            {getFieldDecorator('paymentinterface', {
              initialValue: '0',
            })(
              <RadioGroup onChange={this.paymentinterfaceChange}>
                <Radio value="0">默认</Radio>
                <Radio value="1">自定义</Radio>
              </RadioGroup>
            )}
          </FormItem>
          {isdefault == 1 ? paymentmethodfrom : ''}
          {paymentmethod == 0 && isdefault == 1 ? appidfrom : ''}
          {paymentmethod == 0 && isdefault == 1 ? privatekeyfrom : ''}
          {paymentmethod == 0 && isdefault == 1 ? publickeyfrom : ''}
          {paymentmethod == 0 && isdefault == 1 ? ifsandboxfrom : ''}

          {paymentmethod == 1 && isdefault == 1 ? appidfrom : ''}
          {paymentmethod == 1 && isdefault == 1 ? mchidfrom : ''}
          {paymentmethod == 1 && isdefault == 1 ? wechartkeyfrom : ''}
          {paymentmethod == 1 && isdefault == 1 ? secretfrom : ''}
          {paymentmethod == 1 && isdefault == 1 ? ifsandboxfrom : ''}
        </Form>
      </Modal>
    );
  }

  showmoduleset = (e, item) => {
    console.log(item);
    this.setState({
      modulevisible: true,
    });
  };

  handleOkmoduleset = e => {
    console.log(e);
    this.setState({
      modulevisible: false,
    });
  };

  handleCancelmoduleset = e => {
    console.log(e);
    this.setState({
      modulevisible: false,
    });
  };
  rendermoduleset() {
    const { getFieldDecorator } = this.props.form;
    const columns = [
      {
        title: '模块名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '模块地址',
        dataIndex: 'address',
        key: 'address',
        width: '40%',
      },
    ];

    const data = [
      {
        key: 1,
        name: 'John Brown sr.',
        age: 60,
        address: 'New York No. 1 Lake Park',
        children: [
          {
            key: 11,
            name: 'John Brown',
            age: 42,
            address: 'New York No. 2 Lake Park',
          },
          {
            key: 12,
            name: 'John Brown jr.',
            age: 30,
            address: 'New York No. 3 Lake Park',
            children: [
              {
                key: 121,
                name: 'Jimmy Brown',
                age: 16,
                address: 'New York No. 3 Lake Park',
              },
            ],
          },
          {
            key: 13,
            name: 'Jim Green sr.',
            age: 72,
            address: 'London No. 1 Lake Park',
            children: [
              {
                key: 131,
                name: 'Jim Green',
                age: 42,
                address: 'London No. 2 Lake Park',
                children: [
                  {
                    key: 1311,
                    name: 'Jim Green jr.',
                    age: 25,
                    address: 'London No. 3 Lake Park',
                  },
                  {
                    key: 1312,
                    name: 'Jimmy Green sr.',
                    age: 18,
                    address: 'London No. 4 Lake Park',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        key: 2,
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
      },
    ];

    // rowSelection objects indicates the need for row selection
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      onSelect: (record, selected, selectedRows) => {
        console.log(record, selected, selectedRows);
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows);
      },
    };
    return (
      <Modal
        title="模块设置"
        width={880}
        visible={this.state.modulevisible}
        onOk={this.handleOkmoduleset}
        onCancel={this.handleCancelmoduleset}
      >
        <Form layout="inline" className={styles.formCol}>
          <Row gutter={24}>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <FormItem label="关键词">
                {getFieldDecorator('modulekeyword')(
                  <Input placeholder="搜索模块名称、模块地址查询" />
                )}
              </FormItem>
            </Col>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <FormItem>
                <Button style={{ marginRight: 10 }} type="primary" htmlType="submit">
                  查询
                </Button>
                <Button>重置</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Table columns={columns} rowSelection={rowSelection} dataSource={data} />
      </Modal>
    );
  }

  showaddeditplatformModal = e => {
    console.log(e);
    console.log('11');
    this.setState({
      addeditplatformvisible: true,
    });
  };

  handleaddeditplatformOk = e => {
    console.log(e);
    this.setState({
      addeditplatformvisible: false,
    });
  };

  handleaddeditplatformCancel = e => {
    console.log(e);
    this.setState({
      addeditplatformvisible: false,
    });
  };
  rendereditset() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Modal
        title="新增平台"
        visible={this.state.addeditplatformvisible}
        onOk={this.handleaddeditplatformOk}
        onCancel={this.handleaddeditplatformCancel}
      >
        <Form>
          <FormItem {...formItemLayout} label="支付接口">
            {getFieldDecorator('platformname')(<Input placeholder="请输入平台名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="主域名">
            {getFieldDecorator('maindomainname')(<Input placeholder="请输入主域名" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="主目录">
            {getFieldDecorator('homedirectory')(<Input placeholder="请输入主目录" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="管理员账号">
            {getFieldDecorator('username', {
              rules: [{ required: true, message: 'Please input your username!' }],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Username"
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="姓名">
            {getFieldDecorator('realname', {
              rules: [{ required: true, message: 'Please input your username!' }],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Username"
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="密码">
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="Password"
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="分成比例">
            <div>
              <span style={{ paddingRight: '22px' }} className="ant-form-text">
                {' '}
                公司
              </span>
              {getFieldDecorator('companyproportions')(<InputNumber min={0} />)}
              <span className="ant-form-text"> %</span>
            </div>
          </FormItem>
          <FormItem className={styles.labelvisble} {...formItemLayout} label="&nbsp;&nbsp;">
            <div>
              <span className="ant-form-text"> 平台方</span>
              {getFieldDecorator('platformproportions')(<InputNumber min={0} />)}
              <span className="ant-form-text"> %</span>
            </div>
          </FormItem>
          <FormItem {...formItemLayout} label="模块版本">
            {getFieldDecorator('moduleedition')(
              <Select allowClear={true} placeholder="请选择">
                <Option value="1">模块版本1</Option>
                <Option value="-1">模块版本2</Option>
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }

  renderItem = ({ index, key, style }) => {
    const { data } = this.state;
    const item = data[index];
    const content = (
      <div style={{ textAlign: 'center' }}>
        <a onClick={e => this.showmoduleset(e, item)}>模块设置</a>
        <br />
        <a onClick={e => this.showModal(e, item)}>支付设置</a>
        <br />
        <a>进入平台</a>
        <br />
        <a>删除</a>
        <br />
        <a>关闭/启用</a>
      </div>
    );
    return (
      <List.Item key={key} style={style}>
        <Row gutter={12} style={{ width: '100%' }}>
          <Col className={styles.orderhidden} xl={2} lg={2} md={2} sm={2} xs={2}>
            <List.Item.Meta description="1" />
          </Col>
          <Col className={styles.orderhidden} xl={3} lg={3} md={3} sm={3} xs={3}>
            <List.Item.Meta description="e板会云技术平台" />
          </Col>
          <Col className={styles.orderhidden} xl={4} lg={4} md={4} sm={4} xs={4}>
            <List.Item.Meta
              description={
                <div>
                  <p
                    style={{
                      margin: 0,
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      width: '100%',
                    }}
                  >
                    {item.realname}
                  </p>
                  <p
                    title={item.ordernumber}
                    style={{
                      margin: 0,
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      width: '100%',
                    }}
                  >
                    {item.username}
                  </p>
                </div>
              }
            />
          </Col>
          <Col className={styles.orderhidden} xl={3} lg={3} md={3} sm={3} xs={3}>
            <List.Item.Meta description="http://www.ebh.net" />
          </Col>
          <Col className={styles.orderhidden} xl={3} lg={3} md={3} sm={3} xs={3}>
            <List.Item.Meta description="/ebh" />
          </Col>
          <Col className={styles.orderhidden} xl={3} lg={3} md={3} sm={3} xs={3}>
            <List.Item.Meta
              description={
                <div>
                  <p
                    style={{
                      margin: 0,
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      width: '100%',
                    }}
                  >
                    2018-12-01
                  </p>
                  <p
                    title={item.ordernumber}
                    style={{
                      margin: 0,
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      width: '100%',
                    }}
                  >
                    00:00:00
                  </p>
                </div>
              }
            />
          </Col>
          <Col xl={3} lg={3} md={3} sm={3} xs={3}>
            <List.Item.Meta
              description={
                <div>
                  <Badge status="processing" text="运行中" />
                </div>
              }
            />
          </Col>
          <Col xl={3} lg={3} md={3} sm={3} xs={3}>
            <List.Item.Meta
              description={
                <div>
                  <a onClick={e => this.handleOpenSchool(e, item)}>编辑</a>
                  <Divider type="vertical" />
                  <Popover placement="bottom" content={content} trigger="hover">
                    <a>
                      更多<Icon type="down" />
                    </a>
                  </Popover>
                </div>
              }
            />
          </Col>
        </Row>
      </List.Item>
    );
  };

  renderItems = ({ index, key, style }) => {
    const { data } = this.state;
    const item = data[index];
    return (
      <List.Item
        key={key}
        style={style}
        actions={[
          <a onClick={e => this.handleOpenSchool(e, item)}>学校后台</a>,
          <a onClick={e => this.handleOpenModelTeacher(e, item)}>教师后台</a>,
          <a onClick={e => this.handleOpenModelStudent(e, item)}>学生后台</a>,
        ]}
      >
        <Row gutter={12} style={{ width: '100%' }}>
          <Col xl={6} lg={12} md={12} sm={24} xs={24}>
            <List.Item.Meta
              avatar={
                <Avatar
                  size="large"
                  src={item.cface || '//static.ebanhui.com/ebh/tpl/2012/images/face/1.jpg'}
                />
              }
              title={
                <span title={item.crname}>
                  <Ellipsis lines={1}>{item.crname}</Ellipsis>
                </span>
              }
              description={
                <span title={item.domain + '  | 独立域名：' + item.fulldomain || '无'}>
                  <Ellipsis lines={1}>
                    {item.domain} | 独立域名：{item.fulldomain || '无'}
                  </Ellipsis>
                </span>
              }
            />
          </Col>
          <Col className={styles.orderhidden} xl={24} lg={24} md={24} sm={24} xs={24}>
            <List.Item.Meta
              description={
                <div>
                  <p
                    style={{
                      margin: 0,
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      width: '100%',
                    }}
                  >
                    {item.realname}
                  </p>
                </div>
              }
            />
          </Col>
          <Col xl={5} lg={12} md={12} sm={24} xs={24}>
            <List.Item.Meta
              title="管理员信息"
              description={
                <div>
                  {item.realname}（{item.username}）<br />
                  {item.mobile} ({item.location})
                </div>
              }
            />
          </Col>
          <Col xl={1} lg={4} md={4} sm={4} xs={4} style={{ paddingRight: 0 }}>
            <List.Item.Meta title="学生" description={item.stunum} />
          </Col>
          <Col xl={1} lg={4} md={4} sm={4} xs={4} style={{ paddingRight: 0 }}>
            <List.Item.Meta title="教师" description={item.teanum} />
          </Col>
          <Col xl={1} lg={4} md={4} sm={4} xs={4} style={{ paddingRight: 0 }}>
            <List.Item.Meta title="课件" description={item.coursenum} />
          </Col>
          <Col xl={1} lg={4} md={4} sm={4} xs={4} style={{ paddingRight: 0 }}>
            <List.Item.Meta title="作业" description={item.examcount} />
          </Col>
          <Col xl={1} lg={4} md={4} sm={4} xs={4} style={{ paddingRight: 0 }}>
            <List.Item.Meta title="答疑" description={item.asknum} />
          </Col>
          <Col xl={1} lg={4} md={4} sm={4} xs={4} style={{ paddingRight: 0 }}>
            <List.Item.Meta title="登录" description={item.logincount} />
          </Col>
          <Col xl={3} lg={12} md={12} sm={12} xs={12}>
            <List.Item.Meta title="最后登录" description={getTimeString(item.lastlogintime)} />
          </Col>
          <Col xl={4} lg={12} md={12} sm={12} xs={12}>
            <List.Item.Meta
              title="有效期"
              description={
                <div>
                  {getTimeDay(item.begindate)}
                  <br />
                  {getTimeDay(item.enddate)}
                </div>
              }
            />
          </Col>
          <Col xl={4} lg={24} md={24} sm={24} xs={24}>
            <List.Item.Meta
              description={
                <div>
                  <Badge status="processing" text="正常" />
                </div>
              }
            />
          </Col>
        </Row>
      </List.Item>
    );
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { times, status, keywords } = fieldsValue;
      let startTime = '';
      let endTime = '';
      if (times && times != 'undefined' && times.length > 0) {
        startTime = Date.parse(times[0]._d) / 1000;
        endTime = Date.parse(times[1]._d) / 1000;
      }

      const values = {
        page: 1,
        startdate: startTime,
        enddate: endTime,
        status: status,
        q: keywords,
      };

      this.setState({
        page: 1,
      });

      dispatch({
        type: 'netschool/fetchNetschoolLists',
        payload: values,
        callback: data => {
          this.setState({
            data: [],
          });
          this.setState({
            data: data,
          });
        },
      });
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();

    this.setState({
      page: 1,
    });

    dispatch({
      type: 'netschool/fetchNetschoolLists',
      payload: {
        page: 1,
      },
      callback: data => {
        this.setState({
          data: [],
        });
        this.setState({
          data: data,
        });
      },
    });
  };

  handleSchoolPage = (page, pagesize) => {
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { times, status, keywords } = fieldsValue;
      let startTime = '';
      let endTime = '';
      if (times && times != 'undefined' && times.length > 0) {
        startTime = Date.parse(times[0]._d) / 1000;
        endTime = Date.parse(times[1]._d) / 1000;
      }
      const values = {
        page: page,
        startdate: startTime,
        enddate: endTime,
        status: status,
        q: keywords,
      };

      this.setState({
        page: page,
      });

      dispatch({
        type: 'netschool/fetchNetschoolLists',
        payload: values,
        callback: data => {
          this.setState({
            data: [],
          });
          this.setState({
            data: data,
          });
        },
      });
    });
  };

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline" className={styles.formCol}>
        <Row gutter={24}>
          <Col xl={6} lg={12} md={12} sm={24} xs={24}>
            <FormItem label="关 键 词">
              {getFieldDecorator('keywords')(
                <Input placeholder="搜索购买人账号/姓名、归属地等信息" />
              )}
            </FormItem>
          </Col>
          <Col xl={4} lg={12} md={12} sm={24} xs={24}>
            <span style={{ float: 'right', marginBottom: 24 }}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <span style={{ marginBottom: 24 }}>
              <Button onClick={e => this.showaddeditplatformModal(e)} type="primary" icon="plus">
                新增平台
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }
  renderSchoolList() {
    const { netschool, loading } = this.props;
    const { data } = this.state;
    const vlist = ({ height, isScrolling, onChildScroll, scrollTop, onRowsRendered, width }) => (
      <VList
        autoHeight
        height={height}
        isScrolling={isScrolling}
        onScroll={onChildScroll}
        overscanRowCount={2}
        rowCount={data.length}
        rowHeight={!this.state.isMobile ? 72 : 320}
        rowRenderer={!this.state.isMobile ? this.renderItem : this.renderItems}
        onRowsRendered={onRowsRendered}
        scrollTop={scrollTop}
        width={width}
      />
    );
    const autoSize = ({ height, isScrolling, onChildScroll, scrollTop, onRowsRendered }) => (
      <AutoSizer disableHeight>
        {({ width }) =>
          vlist({ height, isScrolling, onChildScroll, scrollTop, onRowsRendered, width })
        }
      </AutoSizer>
    );
    const infiniteLoader = ({ height, isScrolling, onChildScroll, scrollTop }) => (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.handleInfiniteOnLoad}
        rowCount={data.length}
      >
        {({ onRowsRendered }) =>
          autoSize({ height, isScrolling, onChildScroll, scrollTop, onRowsRendered })
        }
      </InfiniteLoader>
    );
    let headerhtml = (
      <Row gutter={12} style={{ width: '100%', display: 'flex' }}>
        <Col xl={2} lg={2} md={2} sm={2} xs={2}>
          <span style={{ color: '#000000', fontSize: 16 }}>编号</span>
        </Col>
        <Col xl={3} lg={3} md={3} sm={3} xs={3}>
          <span style={{ color: '#000000', fontSize: 16 }}>平台名称</span>
        </Col>
        <Col xl={4} lg={4} md={4} sm={4} xs={4}>
          <span style={{ color: '#000000', fontSize: 16 }}>管理员</span>
        </Col>
        <Col xl={3} lg={3} md={3} sm={3} xs={3}>
          <span style={{ color: '#000000', fontSize: 16 }}>主域名</span>
        </Col>
        <Col xl={3} lg={3} md={3} sm={3} xs={3}>
          <span style={{ color: '#000000', fontSize: 16 }}>主目录</span>
        </Col>
        <Col xl={3} lg={3} md={3} sm={3} xs={3}>
          <span style={{ color: '#000000', fontSize: 16 }}>创建时间</span>
        </Col>
        <Col xl={3} lg={3} md={3} sm={3} xs={3}>
          <span style={{ color: '#000000', fontSize: 16 }}>状态</span>
        </Col>
        <Col xl={3} lg={3} md={3} sm={3} xs={3}>
          <span style={{ color: '#000000', fontSize: 16 }}>操作</span>
        </Col>
      </Row>
    );
    return (
      <div>
        <List header={!this.state.isMobile ? headerhtml : ''}>
          {loading && (
            <div
              style={{ position: 'absolute', top: '40px', width: '100%', textAlign: 'center' }}
              className="demo-loading-container"
            >
              <Spin />
            </div>
          )}
          {data.length > 0 && <WindowScroller>{infiniteLoader}</WindowScroller>}
        </List>
        <Pagination
          className={styles.pagination}
          defaultPageSize={50}
          current={this.state.page}
          total={parseInt(netschool.total)}
          onChange={this.handleSchoolPage}
        />
      </div>
    );
  }

  render() {
    const { global } = this.props;
    const { lang = 'zhCN', home } = global;
    const { isedit } = this.state;

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
          title: '平台列表',
          content: '表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。',
        };
        break;
      case 'enGB':
        texts = {
          title: 'School List',
          content:
            'Form pages are used to collect or verify information from users, and basic forms are common in form forms with fewer data items.',
        };
        break;
      default:
    }
    return (
      <PageHeaderLayout title={texts.title} content={texts.content} lang={lang} home={home}>
        <Card bordered={false} className={styles.card}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderAdvancedForm()}</div>
          </div>
          {this.renderSchoolList()}
          {this.renderpaysetmodal()}
          {this.rendermoduleset()}
          {this.rendereditset()}
        </Card>
      </PageHeaderLayout>
    );
  }
}
