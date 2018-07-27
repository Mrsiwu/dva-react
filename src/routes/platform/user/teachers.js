import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Input,
  Table,
  Divider,
  Dropdown,
  Menu,
  Icon,
  Row,
  Col,
  Button,
  Modal,
  Select,
  Badge,
  Avatar,
} from 'antd';
import TableVirtualized from '../../../components/TableVirtualized';
import styles from './user.less';

const FormItem = Form.Item;
const Option = Select.Option;

@connect(({ global, userlist }) => ({ global, userlist }))
@Form.create()
export default class UserTeachers extends Component {
  state = {
    visible: false,
    confirmLoading: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'userlist/fetch',
      payload: {
        currentPage: 1,
        pageSize: 100,
      }
    });
  }
	componentWillUnmount() {	}

  showModal = (e, item) => {
    const { form } = this.props;

    this.setState({
      visible: true,
    })

  }

  handleOk = () => {
    this.setState({
      ModalText: 'The modal will be closed after two seconds',
      confirmLoading: true,
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
      });
    }, 2000);
  };

  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visible: false,
    });
  };

  // 搜索栏表单控件 封装好的媒体查询  xl={4} lg={4} md={4} sm={4} xs={4}
  renderSearchForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form layout="inline" style={{ marginBottom: 15 }}>
        <Row className={styles.rowForm}>
          <Col xl={6} lg={12} md={12} sm={12}>
            <FormItem label="选择平台">
              {getFieldDecorator('platform')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">全部</Option>
                  <Option value="1">已处理</Option>
                  <Option value="2">未处理</Option>
                  <Option value="3">已删除</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xl={6} lg={12} md={12} sm={12}>
            <FormItem label="选择网校">
              {getFieldDecorator('school')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">全部</Option>
                  <Option value="1">已处理</Option>
                  <Option value="2">未处理</Option>
                  <Option value="3">已删除</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xl={6} lg={10} md={12} sm={12}>
            <FormItem label="关键词">
              {getFieldDecorator('keywords')(<Input placeholder="搜索账号、姓名" className={styles.inputbox} />)}
            </FormItem>
          </Col>
          <Col xl={6} lg={10} md={12} sm={12}>
            <span className={styles.buttonBox}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }}>重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }
  // 模块列表
  renderTableList() {
    const { userlist, global } = this.props;
		const { isMobile, isMobile2, isMobile3, isMobile4 } = this.state;
    const { collapsed } = global
		const { list: data } = userlist
		console.log('data',data)
    const rendermenu = (item) => {
      return (
        <Menu>
          <Menu.Item>
            <a onClick={(e) => this.showEditPassWordModal(e, item)}>修改密码</a>
          </Menu.Item>
          <Menu.Item style={{textAlign:'center'}}>
            <a onClick={(e) => this.handleDelete(e, item)}>删除</a>
          </Menu.Item>
          <Menu.Item style={{textAlign:'center'}}>
            <a onClick={(e) => this.handleDelete(e, item)}>锁定</a>
          </Menu.Item>
        </Menu>
      )
    };

    const renderMoreBtn = (item) => {
      return (
        <Dropdown overlay={rendermenu(item)}>
          <a>
            更多 <Icon type="down" />
          </a>
        </Dropdown>
      )
    }
    const statusMap = ['default', 'processing', 'success', 'error'];
    const status = ['关闭', '运行中', '已上线', '异常'];
    const columns = [
      {
        title: '账户',
        key: 'account',
        width:{
          xl: 4,
          lg: 6,
          md: 8,
          sm: 8,
          xs: 12
        },
        render: (record) => (
          <span>
            <Avatar src={record.Avatar} size="large" style={{float:'left',marginRight:'8px'}}/>
            <span style={{float:'left'}}>{record.name}</span><Icon type="question" style={{ fontSize: 16, color: record.sex == '1'?'red':'#08c', float:'left'}} /><br/>
            <span style={{float:'left'}}>{record.account}</span>
          </span>
        )
      },
      {
        title: '所属平台',
        key: 'platform',
        width:{
          xl: 3,
          lg: 6,
          md: 8,
          sm: 7,
          xs: 12
        },
        render: (record) => (
          <span style={{lineHeight: '42px'}}>
            {record.platform}
          </span>
        )
      },
      {
        title: '所属网校',
        key: 'school',
        width:{
          xl: 4,
          lg: 7,
          md: 8,
          sm: 9,
          xs: 24
        },
        render: (record) => (
          <span>
            <Avatar src={record.logo} size="large" style={{float:'left',marginRight:'8px'}}/>
            <span style={{float:'left'}}>{record.school}</span><br/>
            <span style={{float:'left'}}>{record.location}|独立域名：{record.domain?record.domain: '无'}</span>
          </span>
        )
      },
      {
        title: '注册时间',
        key: 'startTime',
        width:{
          xl: 2,
          lg: 5,
          md: 8,
          sm: 8,
          xs: 12
        },
        render: (record) => (
          <span>
            <span>{record.startTime}</span><br/>
            <span>{record.time}</span>
          </span>
        )
      },
      {
        title: '注册地',
        key: 'age1',
        width:{
          xl: 3,
          lg: 6,
          md: 8,
          sm: 7,
          xs: 12
        },
        render: (record) => (
          <span>
            <span>{record.address}</span><br/>
            <span>{record.ip}</span>
          </span>
        )
      },
      {
        title: '联系方式',
        key: 'contact',
        width:{
          xl: 3,
          lg: 6,
          md: 8,
          sm: 9,
          xs: 12
        },
        render: (record) => (
          <span style={{lineHeight: '42px'}}>
            {record.contact}
          </span>
        )
      },
      {
        title: '状态',
        key: 'status',
        width:{
          xl: 2,
          lg: 7,
          md: 8,
          sm: 8,
          xs: 12
        },
        render: (record) => (
          <span style={{lineHeight: '42px'}}>
            <Badge status={statusMap[record.status]} text={status[record.status]} />
          </span>
        )
      },
      {
        title: '操作',
        key: 'action',
        width: {
          xl: 3,
          lg: 5,
          md: 8,
          sm: 8,
          xs: 12
        },
        render: (record) => (
          <span style={{lineHeight: '42px'}}>
            <a onClick={(e) => this.showModal(e, record)}  href="javascript:;">编辑</a>
            <Divider type="vertical" />
            {renderMoreBtn(record)}
          </span>
        ),
      },
    ];

    return (
      <div >
        <TableVirtualized columns={columns} dataSource={data} rowHeight={[430,190,190,130,76]} />
      </div>
    )
  }
  // 新增/编辑模块
  renderAddModal() {
    const { visible, confirmLoading } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      style: {
        width: '100%',
        marginBottom: 24,
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <Modal
        title="新增模块"
        visible={visible}
        onOk={this.handleOk}
        confirmLoading={confirmLoading}
        onCancel={this.handleCancel}
      >
        <Form layout="inline" className={styles.formCol}>
          <FormItem {...formItemLayout} label="上级模块">
            {getFieldDecorator('parentModule')(
              <Input type="text" placeholder="由6-20位英文、数字且字母开头组成" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="代码">
            {getFieldDecorator('code')(<Input type="password" placeholder="请输入6-18位密码" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="中文名称">
            {getFieldDecorator('chinaName')(
              <Input type="password" placeholder="再次输入密码" onBlur={this.handleConfirmBlur} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="中文说明">
            {getFieldDecorator('chinaExplain')(
              <Input placeholder="填写用户真实姓名" onBlur={this.handleConfirmBlur} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="英文名称">
            {getFieldDecorator('company')(<Input placeholder="公司或代理商名称" />)}
          </FormItem>

          <FormItem {...formItemLayout} label="英文说明">
            {getFieldDecorator('mobile')(<Input placeholder="11位手机号,用于提现安全验证" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }

  // -------- 主板 ---------------
  render() {
    return (
      <Fragment>
        <Card>
          {this.renderSearchForm()}

          {this.renderTableList()}

          {this.renderAddModal()}
        </Card>
      </Fragment>
    );
  }
}
