import React, { PureComponent } from 'react';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import {
	Card
} from 'antd';
import styles from './Classmanage.less';


export default class Classmanage extends PureComponent {
	
	state = {
		loading:true
	}
	
	componentDidMount() {
	  this.setState({
	   	loading: false,
	  });
	}
	
	render (){
		return (
			<PageHeaderLayout
		        title="授课管理"
		        content="表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。"
		    >
				<Card bordered={false}>
				</Card>
			</PageHeaderLayout>
		)
	}
	
}













