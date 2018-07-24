import React, { PureComponent } from 'react';
import { Menu, Icon, Spin, Tag, Dropdown, Avatar, Divider, Tooltip, List, Row, Col } from 'antd';
import WindowScroller from 'react-virtualized/dist/commonjs/WindowScroller';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import VList from 'react-virtualized/dist/commonjs/List';
import InfiniteLoader from 'react-virtualized/dist/commonjs/InfiniteLoader';
import styles from './index.less';

export default class TableVirtualized extends PureComponent {
  componentWillUnmount() {}

  render() {
    const { columns, dataSource, rowHeight, isRowLoaded = () => {}, loadMoreRows= () => {}} = this.props;

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
        rowHeight={rowHeight}
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
        <List header = {header}>
          <WindowScroller>
            {infiniteLoader}
          </WindowScroller>
        </List>
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
