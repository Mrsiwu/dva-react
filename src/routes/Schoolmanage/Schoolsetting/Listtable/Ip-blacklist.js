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
  	Button
} from 'antd';
import styles from './TableStyle.less';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ global }) => ({
  global,
}))
@Form.create()

export default class Ipblacklsit extends Component{

	state = {
		loading:true,
		listData:[{
		  	key: '1',
		  	time: '2018-07-19 08:05:05',
		  	address: "141.14.246.14（浙江-杭州）",
		  	remarks: '***',
		  	operation:"删除"
		}, {
		  	key: '2',
		 	time: '2018-07-19 08:05:05',
		  	address: "141.14.246.14（浙江-杭州）",
		  	remarks: '***',
		  	operation:"删除"
		}, {
		  	key: '3',
		  	time: '2018-07-19 08:05:05',
		  	address: "141.14.246.14（浙江-杭州）",
		  	remarks: '***',
		  	operation:"删除"
		}, {
		  	key: '4',
		  	time: '2018-07-19 08:05:05',
		  	address: "141.14.246.14（浙江-杭州）",
		  	remarks: '***',
		  	operation:"删除"
		}, {
		  	key: '5',
		  	time: '2018-07-19 08:05:05',
		  	address: "141.14.246.14（浙江-杭州）",
		  	remarks: '***',
		  	operation:"删除"
		}],
		pagination:{                           //分页数据
			showQuickJumper:true,
			defaultPageSize:10,
			hideOnSinglePage:true,
			defaultCurrent:1,
			showTotal: total => "共 400 条记录 第 1 / 80 页 ",
			total: 50
		},
		selectData:{},                         //选中内容
		visible: false,                        //弹窗显示
    	confirmLoading: false,                 //弹窗确认按钮loading
	};
	//弹窗出现
	showModal = () =>{
		const { form } = this.props;
		form.resetFields(['IpAddress','remarks']);
		form.setFields({
	      	IpAddress: {
	        	value: ''
	      	},
	      	remarks: {
	      		value: ''
	      	}
	    });
		this.setState({
	      	visible: true,
	      	confirmLoading:false
	    });
	}
	//添加
	addlist = (e,item) =>{
		const { form } = this.props;
		this.setState({confirmLoading: true});
		form.validateFields(['IpAddress'],(err, fieldsValue) => {
		    if (err) return;
		    console.log(fieldsValue)
	        this.setState({
	          	visible: false
	    	});
	    });
	    this.setState({confirmLoading: false})
	}
	//关闭弹窗
	modalCancel = () =>{
		this.setState({
	      	visible: false
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
	              {searchObj.addbtn}
	            </Button>
	            <Button style={{ marginLeft: 8 }} onClick={this.batchdele}>{searchObj.batchdel}</Button>
	          </Col>
	        </Row>
	      </Form>
	    );
	}

	//添加部分
	renderAddBlackList(prop){
		const { visible,confirmLoading } = this.state;
    	const { getFieldDecorator } = this.props.form;
    	const { addTitle,addPlaceholder } = prop;
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
		    }
	    };
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
					<FormItem {...formItemLayout} label={addTitle.address}>
			            {getFieldDecorator('IpAddress',  {
			              rules: [
			                {
			                  required: true,
			                  message: `${addPlaceholder.addressHolder}`
			                },
			              ],
			            })(<Input  placeholder={addPlaceholder.addressHolder} />)}
			        </FormItem>
					<FormItem {...formItemLayout} label={addTitle.remarks}>
			            {getFieldDecorator('remarks')(
			              <TextArea placeholder={addPlaceholder.remarksHolder} autosize={{ minRows: 4, maxRows: 6 }} />
			            )}
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
	        		searchObj:{label:"关键词",enter:"请输入",searchbtn:"查询",resetbtn:"重置",addbtn:"新增",batchdel:"批量删除"},
	        		ModalTitle:"新增IP黑名单",
	        		addTitle:{address:"IP地址",remarks:"备注"},
	        		addPlaceholder:{addressHolder:"请输入IP地址",remarksHolder:"请输入备注信息"},
	        		cancelBtn:"取消",
	        		subBtn:"确定"
	        	};
	        	break;
	      	case 'enGB':
	        	texts = {
	          		title: ["Time","IP address","Remarks","Operation"],
	          		searchObj:{label:"Key Word",enter:"Please enter",searchbtn:"Search",resetbtn:"Reset",addbtn:"Newly added",batchdel:"Batch deleting"},
	          		ModalTitle:"New IP blacklist",
	          		addTitle:{address:"IP address",remarks:"Remarks"},
	          		addPlaceholder:{addressHolder:"Enter the IP address",remarksHolder:"Please enter the note information"},
	          		cancelBtn:"Return",
	        		subBtn:"Submit"
	        	};
	        	break;
	      	default:
	    }
		const columns = [
			{
				title: texts.title[0],
				dataIndex: 'time',
				width:"20%"
			},
			{
				title: texts.title[1],
				dataIndex: 'address',
				align:'center',
			},
			{
				title: texts.title[2],
			 	dataIndex: 'remarks',
			 	align:'center',
			 	width:"40%"
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
