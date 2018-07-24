import React,{Component} from 'react';
import { connect } from 'dva';
import {
	Table,
	Form,
	Input,
	Row,
  Col,
  Icon,
  Modal,
  Button,
  Switch,
  InputNumber
} from 'antd';
import styles from './TableStyle.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const accountData = {
	face:"http://img2.imgtn.bdimg.com/it/u=177075201,908463809&fm=27&gp=0.jpg",
	name:"毛晓彤",
	realname:"maoxiaotong",
	sex:"1"
};

function CreatAccountNum(prop){
	const { accountData } = prop;
	return (
		<div>
			<img src={accountData.face} title={accountData.realname} className={styles.userFace} />
			<div className={styles.userRight}>
				<p className={styles.userName}><span>{accountData.name}</span></p>
				<p className={styles.realeName}>{accountData.realname}</p>
			</div>
		</div>
	)
};
@connect(({ global }) => ({
  global,
}))
@Form.create()

export default class Ipblacklsit extends Component{
	
	state = {
		loading:true,
		listData:[{
		  	key: '1',
		  	accountNum: (<CreatAccountNum accountData={accountData} />),
		  	equipment: "Win10 Chrome浏览器",
		  	operation:"删除"
		}, {
		  	key: '2',
		  	accountNum: (<CreatAccountNum accountData={accountData} />),
		  	equipment: "Win10 Chrome浏览器",
		  	operation:"删除"
		}, {
		  	key: '3',
		  	accountNum: (<CreatAccountNum accountData={accountData} />),
		  	equipment: "Win10 Chrome浏览器",
		  	operation:"删除"
		}, {
		  	key: '4',
		  	accountNum: (<CreatAccountNum accountData={accountData} />),
		  	equipment: "Win10 Chrome浏览器",
		  	operation:"删除"
		}, {
		  	key: '5',
		  	accountNum: (<CreatAccountNum accountData={accountData} />),
		  	equipment: "Win10 Chrome浏览器",
		  	operation:"删除"
		}],
		pagination:{                           //分页数据
			showQuickJumper:true,
			defaultPageSize:10,
			hideOnSinglePage:true,
			defaultCurrent:1,
			showTotal:total => "共 400 条记录 第 1 / 80 页 ",
			total:50
		},
		selectData:{},                         //选中内容         
		visible: false,                        //弹窗显示
    confirmLoading: false,                 //弹窗确认按钮loading
    equipmentNum:1,
    switchState:false
	};
	//弹窗出现
	showModal = () =>{
		this.setState({
	      	visible: true,
	      	confirmLoading:false,
	      	equipmentNum:1,
	      	switchState:false
	    });
	}
	//添加
	addlist = (e,item) =>{
		let { equipmentNum,switchState } = this.state;
		this.setState({confirmLoading: true});
		setTimeout(()=>{
			this.setState({visible: false,confirmLoading: false})
		},1000)
	  
	}
	//关闭弹窗
	modalCancel = () =>{
		this.setState({
	      	visible: false,
	      	equipmentNum:1,
	      	switchState:false
	    });
	}
	//批量删除
	batchdele = () =>{
		let { selectData } = this.state;
		console.log(selectData)
	}
	//点击分页
	pageChange = (pagination, filters, sorter) =>{
		console.log("ss")
	}
	//初始化调用函数
	fetch = () => {
		this.setState({loading:false})
	}
	//开关改变
	switchChange = (checked) =>{
		console.log(checked)
		let state = checked ? false : true;
		this.setState({switchState:state});
	}
	//数字输入框
	handleNumberChange = (val) =>{
		this.setState({
			equipmentNum:val
		})
	}
	//搜索部分
	renderSearchForm(prop) {
		const { form } = this.props;
	    const { getFieldDecorator } = form;
	    const { searchObj } = prop;
	    return (
	      <Form layout="inline" style={{ marginBottom: 15 }}>
	        <Row className={styles.rowForm}>
	          <Col xl={8} lg={10} md={12} sm={24}>
	            <FormItem label={searchObj.label}>
	              {getFieldDecorator('no')(<Input placeholder={searchObj.enter} className={styles.inputbox} />)}
	            </FormItem>
	          </Col>
	          <Col xl={8} lg={10} md={12} sm={24}>
	            <span className={styles.buttonBox}>
	              <Button type="primary" htmlType="submit">
	                {searchObj.searchbtn}
	              </Button>
	              <Button style={{ marginLeft: 8 }}>{searchObj.resetbtn}</Button>
	            </span>
	          </Col>
	          <Col sm={24}>
	            <Button
	              type="primary"
	              icon="plus"
	              className={styles.addmodule}
	              onClick={this.showModal}
	            >
	              {searchObj.setUp}
	            </Button>
	            <Button style={{ marginLeft: 8 }} onClick={this.batchdele}>{searchObj.batchdel}</Button>
	          </Col>
	        </Row>
	      </Form>
	    );
	}
	
	//添加部分
	renderAddBlackList(prop){
			const { visible,confirmLoading,equipmentNum,switchState } = this.state;
    	const { getFieldDecorator } = this.props.form;
    	const { addTitle,addPlaceholder,tipText } = prop;
		return(
			<Modal title={prop.ModalTitle}
	      	visible={visible}
	      	onCancel={this.modalCancel}
	      	footer={[
	        	<Button key="back" onClick={this.modalCancel}>{prop.cancelBtn}</Button>,
	        	<Button key="submit" type="primary" loading={confirmLoading} onClick={this.addlist}>
	          		{prop.subBtn}
	        	</Button>,
	      	]}
	    >
		    <Form layout="inline" className={styles.formCol}>
		    	<FormItem>
	          	<div className={styles.stateBox}>
	          		<Col span={4} offset={1}>
	          			<Switch checkedChildren="开" unCheckedChildren="关" defaultChecked onChange={this.switchChange} />
	          		</Col>
	          		<Col span={17}>
	          			<InputNumber
		            		min={1}
		            		max={12}
		            		className={styles.numInput}
		            		value={equipmentNum}
		            		precision={0}
		            		disabled={switchState}
		            		onChange={this.handleNumberChange}
		          		/>
	          		</Col>
	          		<Col span={22} offset={1} className={styles.tipText}>{tipText}</Col>
	          	</div>
	        </FormItem>
				</Form>
	    </Modal>
		)
	}
	
	componentDidMount() {
	    this.fetch();
	}
	
	render(){
		const { global } = this.props;
	    const { lang = 'zhCN', home } = global;
	    let texts;
	    switch (lang) {
	    	case 'zhCN':
	        	texts = {
	        		title: ["时间","IP地址","备注","操作"],
	        		searchObj:{label:"关键词",enter:"请输入",searchbtn:"查询",resetbtn:"重置",setUp:"设置",batchdel:"批量删除"},
	        		ModalTitle:"登陆限制设置",
	        		tipText:"开启账号登录限制后，同一个账号登录的设备数量最多不能超过 所设置的限制数，否则会被系统禁用。",
	        		cancelBtn:"取消",
	        		subBtn:"确定"
	        	};
	        	break;
	      	case 'enGB':
	        	texts = {
	          		title: ["Time","IP address","Remarks","Operation"],
	          		searchObj:{label:"Key Word",enter:"Please enter",searchbtn:"Search",resetbtn:"Reset",setUp:"Set up",batchdel:"Batch deleting"},
	          		ModalTitle:"Landing restriction settings",
	          		tipText:"After opening the account login limit, the number of devices that can be logged on by the same account can not exceed the limit set at most, otherwise it will be disabled by the system.",
	          		cancelBtn:"Return",
	        		subBtn:"Submit"
	        	};
	        	break;
	      	default:
	    }
		const columns = [
			{
				title: texts.title[0],
				dataIndex: 'accountNum',
				width:"30%"
			}, 
			{
				title: texts.title[1],
				dataIndex: 'equipment'
			}, 
			{
				title: texts.title[3],
			 	dataIndex: 'operation',
			 	render: text => <a href="javascript:;">{text}</a>,
			 	width:"10%"
			}
		]
		const { listData ,pagination,loading } = this.state;
		const rowSelection = {
		  	onChange: (selectedRowKeys, selectedRows) => {
		    	console.log(selectedRowKeys);
		    	console.log(selectedRows) 
		    	this.setState({
		    		selectData:selectedRows
		    	})
		  	},
		  	getCheckboxProps: record => ({
		    	disabled: record.name === 'Disabled User',
		    	name: record.name,
		  	}),
		};
		
		return(
			<div>
				{this.renderSearchForm(texts)}
				<Table rowSelection={rowSelection} columns={columns} dataSource={listData} loading={loading} pagination={pagination} onChange={this.pageChange} />
				{this.renderAddBlackList(texts)}
			</div>	
		)
	}
}
