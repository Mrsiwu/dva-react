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
} from 'antd';
import styles from './permission.less';
const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;
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
  }
];

@connect(({ global }) => ({ global }))
@Form.create()
export default class RoleList extends Component {
  state = {
    visibleAddRole: false,
    visibleModule: false,
    confirmLoading: false,
  };

  componentDidMount() {}
// ------ handle event-------
  handleQuery = () => {

  }

  handleReset = () => {

  }

  handleDelete = (e, item) => {

  }
  // ----- visibleModule --------
  showModal = (e, item) => {
    const { form } = this.props;

    // form.resetFields(['parentModule', 'moduleCode', 'chinaName', 'chinaExplain', 'engbName', 'engbExplain', 'moduleAddress']);
    //
    // form.setFields({
    //   parentModule: {
    //     value: '1'
    //   }
    // });

    this.setState({
      visibleAddRole: true,
    })

  }

  handleOk = () => {
    const { dispatch, form } = this.props;

    form.validateFields(['parentModule', 'moduleCode', 'chinaName', 'chinaExplain', 'engbName', 'engbExplain', 'moduleAddress'], (err, fieldsValue) => {

      if (err) return;

      this.setState({
        confirmLoading: true,
      })
      console.log(fieldsValue)
      setTimeout(() => {
        this.setState({
          visibleAddRole: false,
          confirmLoading: false,
        });
      }, 2000);

    })
  }

  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visibleAddRole: false,
    })
  }

  showEditModal = (e, item) => {
    const { form } = this.props;
    //
    // form.resetFields(['parentModule', 'moduleCode', 'chinaName', 'chinaExplain', 'engbName', 'engbExplain', 'moduleAddress']);
    //
    // form.setFields({
    //   parentModule: {
    //     value: '1'
    //   }
    // });

    this.setState({
      visibleAddRole: true,
    })

  }
  // ------ visibleModule -------
  showModule = (e, item) => {
    console.log(e, item)
    const { form } = this.props;

    // form.resetFields(['parentModule', 'moduleCode', 'chinaName', 'chinaExplain', 'engbName', 'engbExplain', 'moduleAddress']);
    //
    // form.setFields({
    //   parentModule: {
    //     value: '1'
    //   }
    // });

    this.setState({
      visibleModule: true,
    })

  }

  handleModuleOk = () => {
    const { dispatch, form } = this.props;

    form.validateFields(['parentModule', 'moduleCode', 'chinaName', 'chinaExplain', 'engbName', 'engbExplain', 'moduleAddress'], (err, fieldsValue) => {

      if (err) return;

      this.setState({
        confirmLoading: true,
      })
      console.log(fieldsValue)
      setTimeout(() => {
        this.setState({
          visibleModule: false,
          confirmLoading: false,
        });
      }, 2000);

    })
  }

  handleModuleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visibleModule: false,
    })
  }
// ------ render module Dom -------
  // 搜索栏
  renderSearchForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form layout="inline" style={{ marginBottom: 15 }}>
        <Row className={styles.rowForm}>
          <Col xl={8} lg={10} md={12} sm={24}>
            <FormItem label="关键词">
              {getFieldDecorator('keywords')(<Input placeholder="搜索角色" className={styles.inputbox} />)}
            </FormItem>
          </Col>
          <Col xl={8} lg={10} md={12} sm={24}>
            <span className={styles.buttonBox}>
              <Button onClick={this.handleQuery} type="primary" htmlType="submit">查询</Button>
              <Button onClick={this.handleReset} style={{ marginLeft: 8 }}>重置</Button>
            </span>
          </Col>
          <Col sm={24}>
            <Button
              type="primary"
              icon="plus"
              className={styles.addmodule}
              onClick={this.showModal}
            >
              新增角色
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
  // 模块列表
  renderTableList() {
    // const { global } = this.props;
    // const { lang = 'zhCN' } = global;
    // let language;
    // switch (lang) {
    //   case 'zhCN':
    //     language = {};
    //     break;
    //   case 'enGB':
    //     language = {};
    //     break;
    //   default:
    // }
    const rendermenu = (item) => {
      return (
        <Menu>
          <Menu.Item>
            <a onClick={(e) => this.showModule(e, item)}>权限设置</a>
          </Menu.Item>
          <Menu.Item style={{textAlign:'center'}}>
            <a onClick={(e) => this.handleDelete(e, item)}>查看</a>
          </Menu.Item>
          <Menu.Item style={{textAlign:'center'}}>
            <a onClick={(e) => this.handleDelete(e, item)}>删除</a>
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

    const columns = [
      {
        title: '角色',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '人数',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: '最新修改',
        dataIndex: 'address',
        key: 'address2',
      },
      {
        title: '操作',
        key: 'action',
        width: '150px',
        render: (text, record) => (
          <span>
            <a onClick={(e) => this.showEditModal(e, record)}  href="javascript:;">编辑</a>
            <Divider type="vertical" />
            {renderMoreBtn(record)}
          </span>
        ),
      },
    ];

    return <Table columns={columns} dataSource={data} pagination={false} />;
  }
  // 新增/编辑模块
  renderAddModal() {
    const { visibleAddRole, confirmLoading } = this.state;
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
        title="新增角色"
        visible={visibleAddRole}
        onOk={this.handleOk}
        confirmLoading={confirmLoading}
        onCancel={this.handleCancel}
        className={styles.addmodule}
      >
        <Form layout="inline" hideRequiredMark className={styles.formCol}>
        <FormItem
          {...formItemLayout}
          label="角色名称">
            {getFieldDecorator('realname', {
              rules: [{
                required: true, message: '请输入角色名称!',
              }],
            })(
              <Input placeholder="请输入角色名称"  />
            )}
            </FormItem>

        </Form>
      </Modal>
    );
  }
  // 模块设置
  renderModuleSearch() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form layout="inline" style={{ marginBottom: 15 }}>
        <Row className={styles.rowForm}>
          <Col md={12} sm={24}>
            <FormItem label="关键词">
              {getFieldDecorator('keywords')(<Input placeholder="搜索模块名称、模块地址查询" className={styles.inputbox} />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <span className={styles.buttonBox}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }}>重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    )
  }
  // 模块列表
  renderModuleTable() {
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
        width: '45%'
      }
    ];

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

    return <Table columns={columns} dataSource={data} rowSelection={rowSelection} pagination={false} />;
  }
  // 模块弹出框
  renderModuleSetting() {
    const { visibleModule, confirmLoading } = this.state;
    return (
      <Modal
        title="模块设置"
        visible={visibleModule}
        onOk={this.handleModuleOk}
        confirmLoading={confirmLoading}
        onCancel={this.handleModuleCancel}
        className={styles.editModule}
        width={880}
      >
        {this.renderModuleSearch()}
        {this.renderModuleTable()}
      </Modal>
    );
  }
// ------ main Dom -------
  render() {
    return (
      <Fragment>
        <Card>
          {this.renderSearchForm()}

          {this.renderTableList()}

          {this.renderAddModal()}

          {this.renderModuleSetting()}
        </Card>
      </Fragment>
    );
  }
}
