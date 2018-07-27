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
  notification
} from 'antd';
import debounce from 'lodash/debounce';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import { getTimeString, getTimeDay } from '../../utils/utils';
import Ellipsis from 'components/Ellipsis';
import WindowScroller from 'react-virtualized/dist/commonjs/WindowScroller';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import VList from 'react-virtualized/dist/commonjs/List';
import InfiniteLoader from 'react-virtualized/dist/commonjs/InfiniteLoader';
import styles from './style.less';
const FormItem = Form.Item;
const confirm = Modal.confirm;
const { Meta } = Card;
const { Option } = Select;
const { RangePicker } = DatePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
let isMobile;
enquireScreen(b => {
  isMobile = b;
},['only screen and (max-width: 500px)']);
@connect(({ global, netschool, loading }) => ({
  global,
  netschool,
  loading: loading.effects['netschool/fetchNetschoolLists'],
}))
@Form.create()
export default class SchoolList extends PureComponent {
  state = {
    isMobile,
    isdefault: 0,
    paymentmethod: 0,
    paysetvisible: false,
    modulevisible: false,
    data: [],
    page: 1,
    pagesize: 50,
    isedit: 0,
    editon:0,
    setlanguagevisible:false,
    platformlist:[],
    schoolvals:{},
    distributionScalenumber:0,
    fetching: false,
    searchplatformlist:[]
  };
  loadedRowsMap = {};
  getplatformlistAll = (callbacks) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'netschool/fetchplatformlistAll',
      payload: {
      },
      callback: data => {
        callbacks(data)
      },
    });
  }
  componentDidMount() {
    this.enquireHandler = enquireScreen(mobile => {
      this.setState({
        isMobile: mobile,
      });
    },['only screen and (max-width: 500px)']);

    const { dispatch } = this.props;
    dispatch({
      type: 'netschool/fetchNetschoolLists',
      payload: {
        currentPage: this.state.page,
        pageSize: this.state.pagesize
      },
      callback: data => {
        this.setState({
          data: data.data.rows || []
        });
      },
    });
    this.getplatformlistAll((res) => {
      if(res.success){
        this.setState({
          platformlist : res.data
        })
      }
      console.log(1,res)
    });
  }
  componentWillUnmount() {
    unenquireScreen(this.enquireHandler);
  }
  //支付设置start--------
  showModal = (e, item) => {
    const {form} = this.props
    let iszdy = 1;
    let iswx = 1;
    form.resetFields(['paymentinterface','paymentmethod','appid','mchid','wechartkey','secret','privatekey','publickey','ifsandbox']);
    if(iszdy){
      if(iswx){
        this.setState({
          isdefault:1,
          paymentmethod:1
        });
        form.setFields({
          paymentinterface: {
            value: '1'
          },
          paymentmethod: {
            value: '1'
          },
          appid: {
            value: '123456'
          },
          mchid: {
            value: '123456'
          },
          wechartkey: {
            value: '123456'
          },
          secret: {
            value: '123456'
          },
        });
      }else{
        this.setState({
          isdefault:1,
          paymentmethod:0
        });
        form.setFields({
          paymentinterface: {
            value: '1'
          },
          paymentmethod: {
            value: '0'
          },
          appid: {
            value: '123456'
          },
          privatekey: {
            value: '123456'
          },
          publickey: {
            value: '123456'
          },
        });
      }
    }else{
      this.setState({
        isdefault:0,
        paymentmethod:0
      });
    }
    this.setState({
      paysetvisible: true,
      schoolvals:item
    });
    
  };
  handleOk = e => {
    e.preventDefault();
    const {form ,dispatch} = this.props;
    const { schoolvals} = this.state
    let fields = ['paymentinterface','paymentmethod','appid','mchid','wechartkey','secret','privatekey','publickey','ifsandbox'];
    if(this.state.isdefault){
      if(this.state.paymentmethod){
        fields = ['paymentinterface','paymentmethod','appid','mchid','wechartkey','secret','ifsandbox']
      }else{
        fields = ['paymentinterface','paymentmethod','appid','privatekey','publickey','ifsandbox']
      }
    }else{
      fields = ['paymentinterface']
    }
    
    form.validateFields(fields,(err, fieldsValue) => {  
      if (err) return;

      const {paymentinterface, paymentmethod,appid,mchid,wechartkey,secret,privatekey,publickey,ifsandbox} = fieldsValue;
      let paymentSystem = {
        paymentinterface:paymentinterface,
        paymentmethod:paymentmethod,
        appid:appid,
        mchid:mchid,
        wechartkey:wechartkey,
        secret:secret,
        privatekey:privatekey,
        publickey:publickey,
        ifsandbox:ifsandbox
      }
      const values = {
        schoolId: schoolvals.schoolId || 1,
        paymentSystem:paymentSystem
      };
      console.log(values)
       dispatch({
        type: 'netschool/fetchsavePaymentSystem',
        payload: values,
        callback: data => {
          console.log(data)
        },
      });
    });

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
    const {form} =  this.props
    form.resetFields(['paymentinterface','paymentmethod']);
    form.setFields({
      paymentmethod: {
        value: '0'
      },
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
    let style1 = {
      display:'block'
    }

    let style2 = {
      display:'none'
    }
    
    let paymentmethodfrom = (
      <FormItem style={isdefault == 1 ?style1:style2} {...formItemLayout} label="支付方式">
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
      <FormItem style={isdefault == 1 ?style1:style2} {...formItemLayout} label="appid">
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
      <FormItem style={paymentmethod == 1 && isdefault == 1?style1:style2} {...formItemLayout} label="mchid">
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
      <FormItem style={paymentmethod == 1 && isdefault == 1?style1:style2} {...formItemLayout} label="wechartkey">
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
      <FormItem style={paymentmethod == 1 && isdefault == 1?style1:style2} {...formItemLayout} label="secret">
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
      <FormItem  style={paymentmethod == 0 && isdefault == 1?style1:style2} {...formItemLayout} label="商户的私钥">
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
      <FormItem style={paymentmethod == 0 && isdefault == 1?style1:style2} {...formItemLayout} label="支付宝公钥">
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
      <FormItem style={isdefault == 1?style1:style2} {...formItemLayout} label="是否沙箱环境" extra="仅测试勾选，需要对应账号">
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
          {paymentmethodfrom}
          {appidfrom}
          {privatekeyfrom}
          {publickeyfrom}
          {mchidfrom}
          {wechartkeyfrom}
          {secretfrom}
          {ifsandboxfrom}

          
        </Form>
      </Modal>
    );
  }
  //支付设置end---------------------

  //模块设置start-----------------
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
  //模块设置end------------------------

  //网校新增编辑start----------------
  addschool  = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;

    form.validateFields(['platformId','schoolName','schoolRealmName','logoURL','userId','personNumLimit','gmtExpire','versionType','netschoollanguage','distributionScale','freezingDay'],(err, fieldsValue) => {
      if (err) return;
      const { platformId,schoolName, schoolRealmName, logoURL,userId,personNumLimit,gmtExpire,versionType,netschoollanguage,distributionScale,freezingDay} = fieldsValue;
    
      const values = {
        
      };
      /* dispatch({
        type: 'netschool/fetchNetschoolLists',
        payload: values,
        callback: data => {
          console.log(data)
          this.setState({
            data: [],
          });
          this.setState({
            data: data.data.rows,
          });
        },
      }); */
    });
  };
  rendereditschool() {
    const {form} = this.props
    const { getFieldDecorator } = form;
    let that = this
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 8 },
    };
    function formatter(value) {
      return `${value}%`;
    }
    function distributionScaleChange (value) {
      form.setFields({
        distributionScale: {
          value: value
        },
      });
      that.setState({
        distributionScalenumber:value
      })
    }
    let showhide
    if(this.state.isedit){
      showhide = {
        display:'block'
      }
    }else{
      showhide = {
        display:'none'
      }
    }
    
    return (
      <Form onSubmit={this.addschool} style={showhide} >
        <FormItem {...formItemLayout} label="所属平台">
          {getFieldDecorator('platformId', {
            initialValue: '0',
          })(
            <Select placeholder="搜索选择">
              <Option value="0">111</Option>
              <Option value="1">222</Option>
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="网校名称">
          {getFieldDecorator('schoolName')(<Input placeholder="请输入网校名称" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="网校域名">
          {getFieldDecorator('schoolRealmName')(<Input placeholder="请输入域名" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="logo">
          {getFieldDecorator('logoURL')(
            <Upload name="avatar" listType="picture-card" action="/upload.do">
              <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传</div>
              </div>
            </Upload>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="管理员">
          <Row gutter={8}>
            <Col span={12}>
              <div>
                <a>选择</a>
                <Divider type="vertical" />
                <a>新建</a>
              </div>
            </Col>
            <Col span={12}>{getFieldDecorator('userId')(<Input type="hidden" />)}</Col>
          </Row>
        </FormItem>
        <FormItem {...formItemLayout} label="用户上限">
          {getFieldDecorator('personNumLimit', {
            initialValue: 0,
          })(<InputNumber min={0} precision={0.1} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="有效期">
          {getFieldDecorator('gmtExpire')(<DatePicker />)}
        </FormItem>
        <FormItem {...formItemLayout} label="网校类型">
          {getFieldDecorator('versionType', {
            initialValue: '0',
          })(
            <RadioGroup>
              <RadioButton value="0">学校</RadioButton>
              <RadioButton value="1">企业</RadioButton>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="默认语言">
          {getFieldDecorator('netschoollanguage', {
            initialValue: '0',
          })(
            <RadioGroup>
              <RadioButton value="0">中文</RadioButton>
              <RadioButton value="1">English</RadioButton>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="网校分成">
          <Row gutter={8}>
            <Col span={16}>
              {getFieldDecorator('distributionScale')(
                <Slider onChange={distributionScaleChange} tipFormatter={formatter} min={0} max={100} />
              )}
            </Col>
            <Col span={8}>
              <InputNumber value={this.state.distributionScalenumber}   onChange={distributionScaleChange} min={0} max={100} precision={0.1} /> %
            </Col>
          </Row>
        </FormItem>
        <FormItem {...formItemLayout} label="冻结金额时间">
          {getFieldDecorator('freezingDay')(<InputNumber min={0} precision={0.1} />)}
          <span className="ant-form-text"> 天</span>
        </FormItem>
        <Row>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Button onClick={e => this.setState({isedit :0}) }  style={{ marginRight: 38 }}>取消</Button>
            <Button type="primary" htmlType="submit">
              确定
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
  handleopensaveSchool= (e,item) => {
    e.preventDefault();
    const { form ,dispatch} = this.props;
    form.resetFields(['platformId', 'schoolName', 'schoolRealmName','logoURL','userId','personNumLimit','gmtExpire','versionType','netschoollanguage','distributionScale','freezingDay']);
    console.log(item)
    if(item){
      dispatch({
        type: 'netschool/fetchfindBySchoolId',
        payload: {
          schoolId:item.platformId
        },
        callback: datas => {
          console.log(datas)
          form.setFields({
            platformId: {
              value: 0
            },
            schoolName: {
              value: '啦啦啦'
            },
            schoolRealmName: {
              value: 'ss.ebh.net'
            },
          });
        },
      });
      
    }
    this.setState({
      isedit: 1
    }) 
  };
  //网校新增编辑end----------------

  //默认语言start------------------
  showaddeditplatformModal = (e,item) => {
    e.preventDefault();
    const {form} = this.props;
    form.resetFields(['defultlanguage']);
    if(item){
      form.setFields({
        defultlanguage: {
          value: '1'
        },
      }); 
    }
    this.setState({
      setlanguagevisible: true,
    });
  };
  handlesetlanguageformOk = (e) => {
    e.preventDefault();
    const {schoolvals} = this.state;
    const { dispatch, form } = this.props;
    form.validateFields(['defultlanguage'],(err, fieldsValue) => {  
      if (err) return;
      const {defultlanguage } = fieldsValue;
      const values = {
        languageVersion: defultlanguage,
        schoolId: schoolvals.schoolId || 1,
      };
      dispatch({
        type: 'netschool/fetchupdateLanguageVersion',
        payload: values,
        callback: data => {
          if(data.success){
            notification['success']({
              message: '提示',
              description: '更改网校语言成功',
            });
          }else{
            notification['warning']({
              message: '提示',
              description: '更改网校语言失败',
            });
          }
        },
      });
    });
    
    this.setState({
      setlanguagevisible: false,
    });
  };
  handlesetlanguageformCancel = e => {
    this.setState({
      setlanguagevisible: false,
    });
  };
  rendersetlanguage() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
      title="默认语言"
      visible={this.state.setlanguagevisible}
      onOk={this.handlesetlanguageformOk}
      onCancel={this.handlesetlanguageformCancel}
      >
        <Form layout="inline">
          <FormItem label="默认语言">
              {getFieldDecorator('defultlanguage', {
                initialValue: '0',
              })(
                <RadioGroup onChange={this.paymentinterfaceChange}>
                  <Radio value="0">中文</Radio>
                  <Radio value="1">English</Radio>
                </RadioGroup>
              )}
            </FormItem>
        </Form>
      </Modal>
    );
  }
  //默认语言end------------------

  //网校锁定删除start------------------
  handlenetschoolstate = (e,type,item) => {

    e.preventDefault();
    const { dispatch, form } = this.props;
    let that = this;
    let content;
    let states;
    let descriptionsuccess;
    let descriptionwarning;

    if(type){
      content = '确定删除此网校？'
      states = 2
      descriptionsuccess = '该网校删除成功'
      descriptionwarning = '该网校删除失败'
    }else{
      content = item.state=='1'?'确定解锁此网校？':'确定锁定此网校？'
      states = 3
      descriptionsuccess = item.state == '1'?'该网校解锁成功':'该网校锁定成功'
      descriptionwarning = item.state == '1'?'该网校解锁失败':'该网校锁定失败'
    }
    confirm({
      title: '确认框',
      cancelText:'取消',
      okText:'确定',
      content: content,
      onOk() {
        dispatch({
          type: 'netschool/fetchupdateSchoolState',
          payload: {
            schoolId: item.schoolId || 1,
            state:states
          },
          callback: data => {
            if(data.success){
              notification['success']({
                message: '提示',
                description: descriptionsuccess,
              });
            }else{
              notification['warning']({
                message: '提示',
                description: descriptionwarning,
              });
            }
          },
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  //网校锁定删除end------------------

  //网校列表start-----------------
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
  renderItem = ({ index, key, style }) => {
    const { data } = this.state;
    const item = data[index];
    const content = (
      <div style={{ textAlign: 'center' }}>
        <a>进入网校后台</a>
        <br />
        <a>进入教师后台</a>
        <br />
        <a>进入学生后台</a>
        <br />
        <a onClick={e => this.showModal(e, item)}>支付设置</a>
        <br />
        <a onClick={e => this.showmoduleset(e, item)}>模块设置</a>
        <br />
        <a onClick={e => this.showaddeditplatformModal(e, item)}>默认语言</a>
        <br />
        <a onClick={e => this.handlenetschoolstate(e,1, item)}>删除</a>
        <br />
        <a onClick={e => this.handlenetschoolstate(e,0,item)}>锁定</a>
      </div>
    );
    return (
      <List.Item key={key} style={style}>
        <Row gutter={12} style={{ width: '100%' }}>
          <Col xl={4} lg={4} md={4} sm={4} xs={4}>
            <List.Item.Meta
              avatar={
                <Avatar
                  size="large"
                  src={item.cface || '//static.ebanhui.com/ebh/tpl/2012/images/face/1.jpg'}
                />
              }
              title={
                <span title={item.schoolName}>
                  <Ellipsis lines={1}>{item.schoolName}</Ellipsis>
                </span>
              }
              description={
                <span title={item.firstDomainName + '  | 独立域名：' + item.secondDomainName || '无'}>
                  <Ellipsis lines={1}>
                    {item.firstDomainName} | 独立域名：{item.secondDomainName || '无'}
                  </Ellipsis>
                </span>
              }
            />
          </Col>
          <Col className={styles.orderhidden} xl={2} lg={2} md={2} sm={2} xs={2}>
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
                    {item.platformId}
                  </p>
                </div>
              }
            />
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
                    {item.realName}（{item.loginName}）
                  </p>
                  <p
                    style={{
                      margin: 0,
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      width: '100%',
                    }}
                  >
                    {item.mobilPhone} ({item.mobilPhoneAddress})
                  </p>
                </div>
              }
            />
          </Col>
          <Col xl={1} lg={1} md={1} sm={1} xs={1} style={{ paddingRight: 0 }}>
            <List.Item.Meta description={item.studentCount} />
          </Col>
          <Col xl={1} lg={1} md={1} sm={1} xs={1} style={{ paddingRight: 0 }}>
            <List.Item.Meta description={item.teacherCount} />
          </Col>
          <Col xl={1} lg={1} md={1} sm={1} xs={1} style={{ paddingRight: 0 }}>
            <List.Item.Meta description={item.coursewareCount} />
          </Col>
          <Col xl={1} lg={1} md={1} sm={1} xs={1} style={{ paddingRight: 0 }}>
            <List.Item.Meta description={item.taskCount} />
          </Col>
          <Col xl={1} lg={1} md={1} sm={1} xs={1} style={{ paddingRight: 0 }}>
            <List.Item.Meta description={item.answeringQuestionCount} />
          </Col>
          <Col xl={1} lg={1} md={1} sm={1} xs={1} style={{ paddingRight: 0 }}>
            <List.Item.Meta description={item.loginCount} />
          </Col>
          <Col xl={2} lg={2} md={2} sm={2} xs={2}>
            <List.Item.Meta description={getTimeString(item.gmtLastLogin)} />
          </Col>
          <Col className={styles.orderhidden} xl={2} lg={2} md={2} sm={2} xs={2}>
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
                    {getTimeDay(item.gmtCreate)}
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
                    {getTimeDay(item.gmtExpire)}
                  </p>
                </div>
              }
            />
          </Col>
          <Col xl={2} lg={2} md={2} sm={2} xs={2}>
            <List.Item.Meta
              description={
                <div>
                  {'1' == '1'?<Badge status="processing" text="正常" />:<Badge status="error" text="锁定" />}
                </div>
              }
            />
          </Col>
          <Col xl={2} lg={2} md={2} sm={2} xs={2}>
            <List.Item.Meta
              description={
                <div>
                  <a onClick={e => this.handleopensaveSchool(e,item)}>编辑</a>
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
                <span title={item.schoolName}>
                  <Ellipsis lines={1}>{item.schoolName}</Ellipsis>
                </span>
              }
              description={
                <span title={item.firstDomainName + '  | 独立域名：' + item.secondDomainName || '无'}>
                  <Ellipsis lines={1}>
                    {item.firstDomainName} | 独立域名：{item.secondDomainName || '无'}
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
                   {item.platformId}
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
                  {item.realName}（{item.loginName}）<br />
                  {item.mobilPhone} ({item.mobilPhoneAddress})
                </div>
              }
            />
          </Col>
          <Col xl={1} lg={4} md={4} sm={4} xs={4} style={{ paddingRight: 0 }}>
            <List.Item.Meta title="学生" description={item.studentCount} />
          </Col>
          <Col xl={1} lg={4} md={4} sm={4} xs={4} style={{ paddingRight: 0 }}>
            <List.Item.Meta title="教师" description={item.teacherCount} />
          </Col>
          <Col xl={1} lg={4} md={4} sm={4} xs={4} style={{ paddingRight: 0 }}>
            <List.Item.Meta title="课件" description={item.coursewareCount} />
          </Col>
          <Col xl={1} lg={4} md={4} sm={4} xs={4} style={{ paddingRight: 0 }}>
            <List.Item.Meta title="作业" description={item.taskCount} />
          </Col>
          <Col xl={1} lg={4} md={4} sm={4} xs={4} style={{ paddingRight: 0 }}>
            <List.Item.Meta title="答疑" description={item.answeringQuestionCount} />
          </Col>
          <Col xl={1} lg={4} md={4} sm={4} xs={4} style={{ paddingRight: 0 }}>
            <List.Item.Meta title="登录" description={item.loginCount} />
          </Col>
          <Col xl={3} lg={12} md={12} sm={12} xs={12}>
            <List.Item.Meta title="最后登录" description={getTimeString(item.gmtLastLogin)} />
          </Col>
          <Col xl={4} lg={12} md={12} sm={12} xs={12}>
            <List.Item.Meta
              title="有效期"
              description={
                <div>
                  {getTimeDay(item.gmtCreate)}
                  <br />
                  {getTimeDay(item.gmtExpire)}
                </div>
              }
            />
          </Col>
          <Col xl={4} lg={24} md={24} sm={24} xs={24}>
            <List.Item.Meta
              description={
                <div>
                  {'1' != '1'?<Badge status="processing" text="正常" />:<Badge status="error" text="锁定" />}
                </div>
              }
            />
          </Col>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <List.Item.Meta 
              description={
                <div>
                  <a>进入网校后台</a>
                  <Divider type="vertical" />
                  <a>进入教师后台</a>
                  <Divider type="vertical" />
                  <a>进入学生后台</a>
                  <Divider type="vertical" />
                  <a onClick={e => this.showModal(e, item)}>支付设置</a>
                  <Divider type="vertical" />
                  <a onClick={e => this.showmoduleset(e, item)}>模块设置</a>
                  <Divider type="vertical" />
                  <a onClick={e => this.showaddeditplatformModal(e, item)}>默认语言</a>
                  <Divider type="vertical" />
                  <a onClick={e => this.handlenetschoolstate(e,1, item)}>删除</a>
                  <Divider type="vertical" />
                  <a onClick={e => this.handlenetschoolstate(e,0, item)}>锁定</a>
                </div>
              } />
          </Col>
        </Row>
      </List.Item>
    );
  };
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;

    form.validateFields(['times','status1','status','keywords'],(err, fieldsValue) => {
      if (err) return;
      const { times,status1, status, keywords } = fieldsValue;
      let startTime = '';
      let endTime = '';
      if (times && times != 'undefined' && times.length > 0) {
        startTime = Date.parse(times[0]._d) / 1000;
        endTime = Date.parse(times[1]._d) / 1000;
      }

      const values = {
        currentPage: 1,
        pageSize:this.state.pagesize,
        gmtCreate: startTime,
        gmtEnd: endTime,
        platformId:status1,
        state: status,
        keywords: keywords,
      };

      this.setState({
        page: 1,
      });

      dispatch({
        type: 'netschool/fetchNetschoolLists',
        payload: values,
        callback: data => {
          console.log(data)
          this.setState({
            data: [],
          });
          this.setState({
            data: data.data.rows,
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
          data: data.data.rows,
        });
      },
    });
  };
  handleSchoolPage = (page, pagesize) => {
    const { dispatch, form } = this.props;

    form.validateFields(['times','status1','status','keywords'],(err, fieldsValue) => {
      if (err) return;
      const { times,status1, status, keywords } = fieldsValue;
      let startTime = '';
      let endTime = '';
      if (times && times != 'undefined' && times.length > 0) {
        startTime = Date.parse(times[0]._d) / 1000;
        endTime = Date.parse(times[1]._d) / 1000;
      }

      const values = {
        currentPage: page,
        pageSize:this.state.pagesize,
        gmtCreate: startTime,
        gmtEnd: endTime,
        platformId:status1,
        state: status,
        keywords: keywords,
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
            data: data.data.rows,
          });
        },
      });
    });
  };
  handleFetchSchool = val => {
    const { dispatch } = this.props;
    if (val == '') return;
    dispatch({
      type: 'netschool/fetchsearchplatformlist',
      payload: {
        page: 1,
        q: val,
      },
      callback: (data) => {
        console.log(data)
        this.setState({
          fetching: false,
        });
      },
    });

    this.setState({
      fetching: true,
    });
  };
  handleChangeSchool = pla => {
    console.log(schoolValue);
    if (schoolValue == '' || schoolValue == 'undefined' || schoolValue == undefined) return;
    const { dispatch } = this.props;
    dispatch({
      type: 'netschool/fetchsearchplatformlist',
      payload: {
        crid: schoolValue.key,
      },
      callback: (data) => {
        console.log(data)
        this.setState({
          fetching: false,
        });
      },
    });
  };
  constructor(props) {
    // 控制搜索频率
    super(props);
    this.handleFetchSchool = debounce(this.handleFetchSchool, 300);
  }
  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    const {fetching,searchplatformlist } = this.state
    return (
      <Form onSubmit={this.handleSearch} layout="inline" className={styles.formCol}>
        <Row gutter={24}>
          <Col xl={5} lg={12} md={12} sm={24} xs={24}>
            <FormItem label="时间选择">
              {getFieldDecorator('times')(
                <RangePicker
                  format="YYYY-MM-DD"
                  showTime={{
                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                  }}
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
          </Col>
          <Col xl={5} lg={12} md={12} sm={24} xs={24}>
            <FormItem label="选择平台">
              {getFieldDecorator('status1')(
                <Select
                  placeholder="输入平台名称搜索"
                  allowClear={true}
                  labelInValue
                  showSearch
                  notFoundContent={fetching ? <Spin size="small" /> : null}
                  filterOption={false}
                  onSearch={this.handleFetchSchool}
                  onChange={this.handleChangeSchool}
                  dropdownMatchSelectWidth={false}
                >
                  {searchplatformlist.map(d => (
                    <Option key={d.id}>
                      {d.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xl={5} lg={12} md={12} sm={24} xs={24}>
            <FormItem label="选择状态">
              {getFieldDecorator('status')(
                <Select allowClear={true} placeholder="请选择">
                  <Option value="1">有效</Option>
                  <Option value="-1">过期</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xl={5} lg={12} md={12} sm={24} xs={24}>
            <FormItem label="关 键 词">
              {getFieldDecorator('keywords')(<Input placeholder="搜索网校名称/域名、管理员信息" />)}
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
              <Button  onClick={e => this.handleopensaveSchool(e)}  type="primary" icon="plus">
                新建网校
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
        <Col xl={4} lg={4} md={4} sm={4} xs={4}>
          <span style={{ color: '#000000', fontSize: 16 }}>网校</span>
        </Col>
        <Col xl={2} lg={2} md={2} sm={2} xs={2}>
          <span style={{ color: '#000000', fontSize: 16 }}>所属平台</span>
        </Col>
        <Col xl={4} lg={4} md={4} sm={4} xs={4}>
          <span style={{ color: '#000000', fontSize: 16 }}>管理员信息</span>
        </Col>
        <Col xl={1} lg={1} md={1} sm={1} xs={1}>
          <span style={{ color: '#000000', fontSize: 16 }}>学生</span>
        </Col>
        <Col xl={1} lg={1} md={1} sm={1} xs={1}>
          <span style={{ color: '#000000', fontSize: 16 }}>教师</span>
        </Col>
        <Col xl={1} lg={1} md={1} sm={1} xs={1}>
          <span style={{ color: '#000000', fontSize: 16 }}>课件</span>
        </Col>
        <Col xl={1} lg={1} md={1} sm={1} xs={1}>
          <span style={{ color: '#000000', fontSize: 16 }}>作业</span>
        </Col>
        <Col xl={1} lg={1} md={1} sm={1} xs={1}>
          <span style={{ color: '#000000', fontSize: 16 }}>答疑</span>
        </Col>
        <Col xl={1} lg={1} md={1} sm={1} xs={1}>
          <span style={{ color: '#000000', fontSize: 16 }}>登录</span>
        </Col>
        <Col xl={2} lg={2} md={2} sm={2} xs={2}>
          <span style={{ color: '#000000', fontSize: 16 }}>最后登录</span>
        </Col>
        <Col xl={2} lg={2} md={2} sm={2} xs={2}>
          <span style={{ color: '#000000', fontSize: 16 }}>有效期</span>
        </Col>
        <Col xl={2} lg={2} md={2} sm={2} xs={2}>
          <span style={{ color: '#000000', fontSize: 16 }}>状态</span>
        </Col>
        <Col xl={2} lg={2} md={2} sm={2} xs={2}>
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
          style={{textAlign:'right'}}
          defaultPageSize={50}
          current={this.state.page}
          total={parseInt(netschool.total)}
          onChange={this.handleSchoolPage}
        />
      </div>
    );
  }
  //网校列表end-----------------
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
          title: '网校列表',
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
            <div className={styles.tableListForm}>
              {isedit == 0 ? this.renderAdvancedForm() : ''}
            </div>
          </div>
          {isedit == 0 ? this.renderSchoolList() : ''}
          {this.rendereditschool()}
          {this.renderpaysetmodal()}
          {this.rendermoduleset()}
          {this.rendersetlanguage()}
        </Card>
      </PageHeaderLayout>
    );
  }
}
