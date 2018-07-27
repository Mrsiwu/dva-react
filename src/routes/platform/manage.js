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
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {enquireScreen ,unenquireScreen } from 'enquire-js';
import { getTimes, getDays, getTimeString, getTimeDay} from '../../utils/utils';
import Ellipsis from 'components/Ellipsis';
import WindowScroller from 'react-virtualized/dist/commonjs/WindowScroller';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import VList from 'react-virtualized/dist/commonjs/List';
import InfiniteLoader from 'react-virtualized/dist/commonjs/InfiniteLoader';
import styles from './style.less';
const FormItem = Form.Item;
const { Meta } = Card;
const { Option } = Select;
const confirm = Modal.confirm;
const { RangePicker } = DatePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
let isMobile;
enquireScreen(b => {
  isMobile = b;
},['only screen and (max-width: 500px)']);
@connect(({ global, netschool,module, loading }) => ({
  global,
  netschool,
  module,
  loading: loading.effects['netschool/fetchPlatformListss'],
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
    payment:[],
    versionList:[],
    platforms:{},
    isedit:0,
    selectedRowKeys: [],
    expandedRowKeys: []
  };
  loadedRowsMap = {};
  componentDidMount() {
    this.enquireHandler = enquireScreen(mobile => {
      this.setState({
        isMobile: mobile,
      });
    },['only screen and (max-width: 500px)']);
    const { dispatch } = this.props;
    dispatch({
      type: 'netschool/fetchPlatformListss',
      payload: {
        currentPage: this.state.page,
        needCount:1,
        pageSize:this.state.pagesize
        
      },
      callback: data => {
        this.setState({
          data: data,
        });
      },
    }); 

    dispatch({
      type: 'netschool/fetchVersionList',
      payload: {
      },
      callback: data => {
        console.log(data)
        this.setState({
          versionList: data.data || [],
        });
      },
    });
  }
  componentWillUnmount() {
    unenquireScreen(this.enquireHandler);
  }
//支付设置start-------------
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
      platforms:item
    });
    
  };
  handleOk = e => { //支付设置
    e.preventDefault();
    const {form ,dispatch} = this.props;
    const { platforms} = this.state
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
        platformId: platforms.platformId,
        paymentSystem:paymentSystem
      };
      console.log(values)
       dispatch({
        type: 'netschool/fetchupdatePayment',
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
//支付设置end-------------

//模块设置start-------------
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
    
    const { form, module } = this.props;
    const { getFieldDecorator } = form;
    const { selectedRowKeys, expandedRowKeys } = this.state
    // const { list: data } = module
    const data = [
        {
            "children": [
                {
                    "children": [
                        {
                            "rightsId": 100000,
                            "rightsName": "字字字",
                            "rightsSequence": '010101'
                        },
                        {
                            "rightsId": 100002,
                            "rightsName": "字字字",
                            "rightsSequence": '010102'
                        }
                    ],
                    "descriptionEnglish": "测试内容ed84",
                    "description": "测试内容563u测试内容563u测试内容563u测试内容563u测试内容563u测试内容563u测试内容563u测试内容563u测试内容563u",
                    "gmtModified": "1991-01-27",
                    "rightsId": 1000,
                    "rightsNameEnglish": "测试内容mhsv",
                    "rightsName": "字字字字",
                    "rightsSequence": '0101',
                    "rightsUrl": "测试内容tf51"
                },
                {
                    "children": [
                        {
                            "rightsId": 100001,
                            "rightsName": "字字字字字",
                            "rightsSequence": '010201'
                        }
                    ],
                    "descriptionEnglish": "测试内容ed84",
                    "description": "测试内容563u测试内容563u测试内容563u测试内容563u测试内容563u测试内容563u测试内容563u",
                    "gmtModified": "2015-03-21",
                    "rightsId": 1001,
                    "rightsNameEnglish": "测试内容mhsv",
                    "rightsName": "字字字",
                    "rightsSequence": '0102',
                    "rightsUrl": "测试内容tf51"
                }
            ],
            "description": "测试内容04r6",
            "descriptionEnglish": "测试内容jyj0",
            "gmtModified": "1974-01-20",
            "rightsId": 10,
            "rightsNameEnglish": "测试内容89q5",
            "rightsName": "汉汉汉汉",
            "rightsSequence": '01',
            "rightsUrl": "测试内容jxpx"
        },
    ]
    const columns = [
      {
        title: '模块名称',
        dataIndex: 'rightsName',
        key: 'rightsName',
      },
      {
        title: '模块地址',
        dataIndex: 'rightsUrl',
        key: 'rightsUrl',
        width: '45%'
      }
    ];

    const rowSelection = {
      selectedRowKeys: selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.selectedRowKeys = selectedRowKeys // 获得 key (array), 单选更新
      },
      onSelect: (record, selected, selectedRows) => {

        this.childrenKeys = []

        this.parentKeys = []

        if (record.children) { // 有子集特殊处理
          this.getKeys(record.children)
        }

        if (selected) {

          this.getParents(record.rightsSequence.toString(), data)

          this.selectedRowKeys = Array.from(new Set([...this.selectedRowKeys, ...this.childrenKeys, ...this.parentKeys]))

        } else {

          this.deleteKeys(this.childrenKeys)

        }

        this.setState({
          selectedRowKeys: this.selectedRowKeys
        })

      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        this.setState({
          selectedRowKeys: this.selectedRowKeys
        })
      },
    };

    const tableProperty = {
      rowKey: 'rightsId',
      columns: columns,
      dataSource: data,
      pagination: false,
      rowSelection: rowSelection,
      expandedRowKeys: expandedRowKeys,
      onExpandedRowsChange: (expandedRows) => {
        this.setState({
          expandedRowKeys: expandedRows
        })
      }
    }

    
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
        <Table {...tableProperty} />;
      </Modal>
    );
  }
  //模块设置end-------------

  //添加编辑平台start-------------
  showaddeditplatformModal = (e,item) => {
    e.preventDefault();
    const {form} = this.props;
    let isedit = item?1:0
    form.resetFields(['platformname','maindomainname','homedirectory','username','realname','password','companyproportions','platformproportions','moduleedition']);
    if(item){
      console.log(item)
      form.setFields({
        platformname: {
          value: item.operatorName
        },
        maindomainname: {
          value: item.topLevelDomain
        },
        homedirectory: {
          value: item.homeDirectory
        },
        username: {
          value: item.loginName
        },
        realname: {
          value: item.homeDirectory
        },
        companyproportions: {
          value: item.distributionScale || 1
        },
        platformproportions: {
          value: item.distributionScalePlatform || 99
        },
      }); 
    }
    this.setState({
      addeditplatformvisible: true,
      platforms:item,
      isedit:isedit
    });
  };
  handleaddeditplatformOk = e => {
    e.preventDefault();
    const {form ,dispatch} = this.props;
    const {isedit,platforms} = this.state;
    form.validateFields(['platformname','maindomainname','homedirectory','username','realname','password','companyproportions','platformproportions','moduleedition'],(err, fieldsValue) => {  
      if (err) return;
      const {platformname, maindomainname,homedirectory,username,realname,password,companyproportions,platformproportions,moduleedition} = fieldsValue;
      console.log(1111111)
      dispatch({
        type: isedit?'netschool/fetchupdatePlatform':'netschool/fetchsavePlatform',
        payload: isedit?{
          platformId:platforms.platformId||1,
          distributionScale : companyproportions,
          distributionScalePlatform : platformproportions,
          homeDirectory:homedirectory,
          loginName:username,
          operatorName:platformname,
          password:password,
          realName:realname,
          rightsIdSet:moduleedition,
          topLevelDomain :maindomainname
        }:{
          distributionScale : companyproportions,
          distributionScalePlatform : platformproportions,
          homeDirectory:homedirectory,
          loginName:username,
          operatorName:platformname,
          password:password,
          realName:realname,
          rightsIdSet:moduleedition,
          topLevelDomain :maindomainname
        },
        callback: data => {
          console.log(data)
        },
      });
    });
    /* this.setState({
      addeditplatformvisible: false,
    }); */
  };
  handleaddeditplatformCancel = e => {
    this.setState({
      addeditplatformvisible: false,
    });
  };
  rendereditset() {
    const {form} = this.props;
    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    function companyproportionsChange(value) {
      form.setFields({
        platformproportions: {
          value: 100-value
        }
      }); 
    }
    function platformproportionsChange(value) {
      form.setFields({
        companyproportions: {
          value: 100-value
        }
      });
    }

    return (
      <Modal
        title="新增平台"
        visible={this.state.addeditplatformvisible}
        onOk={this.handleaddeditplatformOk}
        onCancel={this.handleaddeditplatformCancel}
      >
        <Form>
          <FormItem {...formItemLayout} label="平台名称">
            {getFieldDecorator('platformname', {
              rules: [{ required: true, message: '请输入平台名称!' }],
            })(<Input placeholder="请输入平台名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="主域名">
            {getFieldDecorator('maindomainname', {
              rules: [{ required: true, message: '请输入主域名!' }],
            })(<Input placeholder="请输入主域名" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="主目录">
            {getFieldDecorator('homedirectory', {
              rules: [{ required: true, message: '请输入主目录!' }],
            })(<Input placeholder="请输入主目录" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="管理员账号">
            {getFieldDecorator('username', {
              rules: [{ required: true, message: '请输入管理员账号!' }],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Username"
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="姓名">
            {getFieldDecorator('realname', {
              rules: [{ required: true, message: '请输入姓名!' }],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Username"
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="密码">
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码!' }],
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
                公司
              </span>
              {getFieldDecorator('companyproportions', {
              rules: [{ required: true, message: '请输入公司分成比例!' }],
            })(<InputNumber onChange={companyproportionsChange} min={0} max={100} precision={0.1} />)}
              <span className="ant-form-text"> %</span>
            </div>
          </FormItem>
          <FormItem className={styles.labelvisble} {...formItemLayout} label="&nbsp;&nbsp;">
            <div>
              <span className="ant-form-text"> 平台方</span>
              {getFieldDecorator('platformproportions', {
              rules: [{ required: true, message: '请输入平台方分成比例!' }],
            })(<InputNumber onChange={platformproportionsChange} min={0} max={100} precision={0.1} />)}
              <span className="ant-form-text"> %</span>
            </div>
          </FormItem>
          <FormItem {...formItemLayout} label="模块版本">
            {getFieldDecorator('moduleedition', {
            rules: [
              { required: true, message: '请选择模块版本!'},
            ],
          })(
              <Select allowClear={true} placeholder="请选择">
                {this.state.versionList.map(d => (
                    <Option key={d.schoolVersionId}>
                      {d.versionName}
                    </Option>
                  ))}
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
  //添加编辑平台end-------------

  //平台开关删除start-------------
  handleplatformswitch = (e,item) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    let that = this;
    let content = item.state == '1'?'确定关闭此平台？':'确定开启此平台？'
    let url = item.state == '1'?'netschool/fetchplatformcloseState':'netschool/fetchplatformenableState'
    let descriptionsuccess = item.state == '1'?'该平台关闭成功':'该平台启动成功'
    let descriptionwarning = item.state == '1'?'该平台关闭失败':'该平台启动失败'
    confirm({
      title: '确认框',
      cancelText:'取消',
      okText:'确定',
      content: content,
      onOk() {
        dispatch({
          type: url,
          payload: {
            platformId: item.platformId,
          },
          callback: data => {
            if(data.success){
              notification['success']({
                message: '提示',
                description: descriptionsuccess,
              });
              form.validateFields(['keywords'],(err, fieldsValue) => {  
                if (err) return;
                const {keywords } = fieldsValue;
                const values = {
                  currentPage: that.state.page,
                  needCount: 1,
                  pageSize: that.state.pagesize,
                  searchStr: keywords,
                };
                dispatch({
                  type: 'netschool/fetchPlatformListss',
                  payload: values,
                  callback: datas => {
                    console.log(datas)
                    that.setState({
                      data: [],
                    });
                    that.setState({
                      data: datas,
                    });
                  },
                });
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
  handleplatformdelete = (e,item) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    let that = this;
    let content ='确定删除此平台？'
    let url = item.state == '1'?'netschool/fetchplatformcloseState':'netschool/fetchplatformenableState'
    let descriptionsuccess = '删除成功'
    let descriptionwarning = '删除失败'
    confirm({
      title: '确认框',
      cancelText:'取消',
      okText:'确定',
      content: content,
      onOk() {
        dispatch({
          type: 'netschool/fetchplatformdeleteState',
          payload: {
            platformId: item.platformId,
          },
          callback: data => {
            if(data.success){
              notification['success']({
                message: '提示',
                description: descriptionsuccess,
              });
              form.validateFields(['keywords'],(err, fieldsValue) => {  
                if (err) return;
                const {keywords } = fieldsValue;
                const values = {
                  currentPage: that.state.page,
                  needCount: 1,
                  pageSize: that.state.pagesize,
                  searchStr: keywords,
                };
                dispatch({
                  type: 'netschool/fetchPlatformListss',
                  payload: values,
                  callback: datas => {
                    console.log(datas)
                    that.setState({
                      data: [],
                    });
                    that.setState({
                      data: datas,
                    });
                  },
                });
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
  //平台开关删除end-------------

  //平台列表start-------------
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields(['keywords'],(err, fieldsValue) => {  
      if (err) return;
      const {keywords } = fieldsValue;
      const values = {
        currentPage: 1,
        needCount: 1,
        pageSize: this.state.pagesize,
        searchStr: keywords,
      };
      this.setState({
        page: 1,
      });

      dispatch({
        type: 'netschool/fetchPlatformListss',
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
      type: 'netschool/fetchPlatformListss',
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

    form.validateFields(['keywords'],(err, fieldsValue) => {  
      if (err) return;
      const { keywords } = fieldsValue;

      const values = {
        currentPage: page,
        needCount: 1,
        pageSize: this.state.pagesize,
        searchStr: keywords,
      };
      this.setState({
        page: page,
      });
      dispatch({
        type: 'netschool/fetchPlatformListss',
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
        <a onClick={e => this.showmoduleset(e, item)}>模块设置</a>
        <br />
        <a onClick={e => this.showModal(e, item)}>支付设置</a>
        <br />
        <a>进入平台</a>
        <br />
        <a onClick={e => this.handleplatformdelete(e, item)}>删除</a>
        <br />
        <a onClick={e => this.handleplatformswitch(e, item)}>{item.state=='1'?'关闭':'启用'}</a>
      </div>
    );
    return (
      <List.Item key={key} style={style}>
        <Row gutter={12} style={{ width: '100%' }}>
          <Col className={styles.orderhidden} xl={2} lg={2} md={2} sm={2} xs={2}>
            <List.Item.Meta description={item.platformId} />
          </Col>
          <Col className={styles.orderhidden} xl={3} lg={3} md={3} sm={3} xs={3}>
            <List.Item.Meta description={item.operatorName} />
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
                    {item.realName}
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
                    {item.loginName}
                  </p>
                </div>
              }
            />
          </Col>
          <Col className={styles.orderhidden} xl={3} lg={3} md={3} sm={3} xs={3}>
            <List.Item.Meta description={item.topLevelDomain} />
          </Col>
          <Col className={styles.orderhidden} xl={3} lg={3} md={3} sm={3} xs={3}>
            <List.Item.Meta description={item.homeDirectory} />
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
                    {getDays(item.gmtCreate)}
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
                    {getTimes(item.gmtCreate)}
                  </p>
                </div>
              }
            />
          </Col>
          <Col xl={3} lg={3} md={3} sm={3} xs={3}>
            <List.Item.Meta
              description={
                <div>
                  {item.state == '1'?<Badge status="processing" text="运行中" />:<Badge status="error" text="关闭" />}
                </div>
              }
            />
          </Col>
          <Col xl={3} lg={3} md={3} sm={3} xs={3}>
            <List.Item.Meta
              description={
                <div>
                  <a onClick={e => this.showaddeditplatformModal(e,item)}>编辑</a>
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
          <Col xl={6} lg={6} md={24} sm={24} xs={24}>
            <List.Item.Meta
              description={<div>编号 {item.platformId}</div>}
            />
          </Col>
          <Col className={styles.orderhidden} xl={18} lg={18} md={24} sm={24} xs={24}>
            <List.Item.Meta
              title="平台名称"
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
                    {item.operatorName}
                  </p>
                </div>
              }
            />
          </Col>
          <Col xl={12} lg={12} md={24} sm={24} xs={24}>
            <List.Item.Meta
              title="管理员"
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
                    {item.realName}
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
                    {item.loginName}
                  </p>
                </div>
              }
            />
          </Col>
          <Col xl={12} lg={12} md={12} sm={12} xs={12}>
            <List.Item.Meta title="主域名" description={item.topLevelDomain} />
          </Col>
          <Col xl={12} lg={12} md={12} sm={12} xs={12}>
            <List.Item.Meta title="主目录" description={item.homeDirectory} />
          </Col>
          <Col xl={12} lg={12} md={12} sm={12} xs={12}>
            <List.Item.Meta title="创建时间" description={getTimeString(item.gmtCreate)} />
          </Col>
          <Col xl={12} lg={12} md={12} sm={12} xs={12}>
            <List.Item.Meta title="状态" 
              description={
                <div>
                  {item.state == '1'?<Badge status="processing" text="运行中" />:<Badge status="error" text="关闭" />}
                </div>
              } />
          </Col>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <List.Item.Meta 
              description={
                <div>
                  <a onClick={e => this.showaddeditplatformModal(e,item)}>编辑</a>
                  <Divider type="vertical" />
                  <a onClick={e => this.showmoduleset(e, item)}>模块设置</a>
                  <Divider type="vertical" />
                  <a onClick={e => this.showModal(e, item)}>支付设置</a>
                  <Divider type="vertical" />
                  <a>进入平台</a>
                  <Divider type="vertical" />
                  <a onClick={e => this.handleplatformdelete(e, item)}>删除</a>
                  <Divider type="vertical" />
                  <a onClick={e => this.handleplatformswitch(e, item)} >{item.state=='1'?'关闭':'启用'}</a>
                </div>
              } />
          </Col>
        </Row>
      </List.Item>
    );
  };
  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline" className={styles.formCol}>
        <Row gutter={24}>
          <Col xl={8} lg={12} md={12} sm={24} xs={24}>
            <FormItem label="关 键 词">
              {getFieldDecorator('keywords')(
                <Input placeholder="搜索购买人账号/姓名、归属地等信息" />
              )}
            </FormItem>
          </Col>
          <Col xl={16} lg={12} md={12} sm={24} xs={24}>
            <span style={{ float: 'left', marginBottom: 24 }}>
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
          style={{textAlign:'right'}}
          className={styles.pagination}
          defaultPageSize={50}
          current={this.state.page}
          total={parseInt(netschool.total)}
          onChange={this.handleSchoolPage}
        />
      </div>
    );
  }
  //平台列表end-------------

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
