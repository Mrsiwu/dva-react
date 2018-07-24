import 'rc-drawer/assets/index.css';
import React from 'react';
import DrawerMenu from 'rc-drawer';
import SiderMenu from './SiderMenu';

const SiderMenuWrapper = props => {
  const { isMobile, collapsed, lang } = props;
  return isMobile ? (
    <DrawerMenu
      getContainer={null}
      level={null}
      handleChild={<i className="drawer-handle-icon" />}
      onHandleClick={() => {
        props.onCollapse(!collapsed);
      }}
      open={!collapsed}
      onMaskClick={() => {
        props.onCollapse(true);
      }}
    >
      <SiderMenu {...props} lang={lang} collapsed={isMobile ? false : collapsed} />
    </DrawerMenu>
  ) : (
    <SiderMenu {...props} lang={lang} />
  );
};

export default SiderMenuWrapper;
