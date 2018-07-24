import React, { Component } from 'react';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import {
	Card,
	Tabs
} from 'antd';
import styles from './SetAll.less';
import Ipblacklist from './Listtable/Ip-blacklist';
import Accountblacklist from './Listtable/Account-blacklist';
import Keyword from './Listtable/Keyword';
import Restriction from './Listtable/Restriction';

const TabPane = Tabs.TabPane;

@connect(({ global }) => ({
  global,
}))

export default class Blacklist extends Component {
	
	state = {}
	
	switchUrl = key => {
		console.log(key)
	}
		
	
	render (){
		
		const { global } = this.props;
	    const { lang = 'zhCN', home } = global;
	    let texts;
	    switch (lang) {
	      case 'zhCN':
	        texts = {
	          title: '黑名单过滤',
	          content: '表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。',
	          tabArr:["IP黑名单","账号黑名单","关键词过滤","登陆限制"]
	        };
	        break;
	      case 'enGB':
	        texts = {
	          title: 'Filter BlackList',
	          content:'Form pages are used to collect or verify information from users, and basic forms are common in form forms with fewer data items.',
	          tabArr:["IP blacklist","Account blacklist","Keyword filtering","Landing restriction"]
	        };
	        break;
	      default:
	    }
		
		return (
			<PageHeaderLayout title={texts.title} content={texts.content} lang={lang} home={home} >
				<Card bordered={false} className={styles.card}>
					<Tabs onChange={this.switchUrl} type="card">
					    <TabPane tab={texts.tabArr[0]} key="ip-blacklist">
					    	<Ipblacklist />
					    </TabPane>
					    <TabPane tab={texts.tabArr[1]} key="account-blacklist">
					    	<Accountblacklist />
					    </TabPane>
					    <TabPane tab={texts.tabArr[2]} key="keyword">
					    	<Keyword />
					    </TabPane>
					    <TabPane tab={texts.tabArr[3]} key="restriction">
					    	<Restriction />
					    </TabPane>
					</Tabs>
				</Card>
			</PageHeaderLayout>
		)
	}
}
