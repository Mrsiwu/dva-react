import React, { PureComponent } from 'react';
import { Menu, Icon, Spin, Tag, Dropdown, Avatar, Divider, Tooltip, List, Row, Col, Pagination } from 'antd';
import WindowScroller from 'react-virtualized/dist/commonjs/WindowScroller';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import VList from 'react-virtualized/dist/commonjs/List';
import InfiniteLoader from 'react-virtualized/dist/commonjs/InfiniteLoader';
import { enquireScreen, unenquireScreen } from 'enquire-js';

import styles from './index.less';

export default class TableVirtualized extends PureComponent {
  state = {
    index: 4
  }
  componentDidMount() {
    this.enquireHandler = enquireScreen(b => {
      if (b) {
        this.setState({
          index: 3
        })
      } else {
        this.setState({
          index: 4
        })
      }
		},'only screen and (max-width: 1199.99px)');

		this.enquireHandler2 = enquireScreen(b => {
      if (b) {
        this.setState({
          index: 2
        })
      } else {
        this.setState({
          index: 3
        })
      }

		},'only screen and (max-width: 991.99px)');

		this.enquireHandler3 = enquireScreen(b => {
      if (b) {
        this.setState({
          index: 1
        })
      } else {
        this.setState({
          index: 2
        })
      }
		},'only screen and (max-width: 767.99px)');

		this.enquireHandler4 = enquireScreen(b => {
      if (b) {
        this.setState({
          index: 0
        })
      } else {
        this.setState({
          index: 1
        })
      }
		},'only screen and (max-width: 575.99px)');

  }
  componentWillUnmount() {
    unenquireScreen(this.enquireHandler)
    unenquireScreen(this.enquireHandler2)
    unenquireScreen(this.enquireHandler3)
    unenquireScreen(this.enquireHandler4)
  }
  render() {
    const { columns, dataSource, rowHeight, pagination = false, loading = false, isRowLoaded = () => {}, loadMoreRows= () => {}} = this.props;
    const { index } = this.state
    const rowH = rowHeight[index]
    const header = (
      <Row gutter={12} style={{width: '100%'}} className={styles.tableHeader}>
        {
          columns.map( item => (
            <Col {...item.width} key={item.key}>
              <span>{item.title}</span>
            </Col>
          ))
        }
      </Row>
    )

    const renderLi= (data) => (
        <Row gutter={12} style={{ width: '100%' }}>
          {
              columns.map( item => (
                <Col {...item.width} key={item.key}>
                  {index ? '' : <List.Item.Meta
                    title={
                      <span title={item.title}>
                        {item.title}
                      </span>
                    }/>}
                    {item.dataIndex ? <span>{data[item.dataIndex]}</span> : item.render(data)}
                </Col>
              ))
          }
        </Row>
    )

    const rowRenderer = ({ index, key, style }) => {
      const item = dataSource[index];
      return (
          <List.Item key={key} style={style}>
            {renderLi(item)}
          </List.Item>
      );
    }

    const rowCount = dataSource.length

    const vlist = ({ height, isScrolling, onChildScroll, scrollTop, onRowsRendered, width }) => (
      <VList
        autoHeight
        height={height}
        isScrolling={isScrolling}
        onScroll={onChildScroll}
        overscanRowCount={0}
        rowCount={rowCount}
        rowHeight={rowH}
        rowRenderer={rowRenderer}
        onRowsRendered={onRowsRendered}
        scrollTop={scrollTop}
        width={width}
      />
    );

    const autoSize = ({ height, isScrolling, onChildScroll, scrollTop, onRowsRendered }) => (
      <AutoSizer disableHeight>
        {({ width }) => vlist({ height, isScrolling, onChildScroll, scrollTop, onRowsRendered, width })}
      </AutoSizer>
    );

    const infiniteLoader = ({ height, isScrolling, onChildScroll, scrollTop }) => (
      <InfiniteLoader
        isRowLoaded={isRowLoaded}
        loadMoreRows={loadMoreRows}
        rowCount={rowCount}
      >
        {({ onRowsRendered }) => autoSize({ height, isScrolling, onChildScroll, scrollTop, onRowsRendered })}
      </InfiniteLoader>
    );

    return (
      <div className={styles.rulerTable}>
        <List header = {index ? header : ''}>
          { loading ? <Spin /> : '' }
          <WindowScroller>
            {infiniteLoader}
          </WindowScroller>
        </List>
        { pagination ? <Pagination {...pagination}  /> : '' }
      </div>
    );
  }
}

// const renderItem = ({ index, key, style }) => {
//   const item = data[index];
//   return (
//     <List.Item key={key} style={style}>
//     <Row gutter={12} style={{ width: '100%' }}>
//       <Col xl={6} >
//         {item.no}
//       </Col>
//       <Col xl={6} >
//         {item.no}
//       </Col>
//       <Col xl={4} >
//         {item.owner}
//       </Col>
//       <Col xl={4} >
//         {item.description}
//       </Col>
//       <Col xl={4} >
//         <a>edit</a>
//         <a>more</a>
//       </Col>
//     </Row>
//   </List.Item>
//   );
// }
