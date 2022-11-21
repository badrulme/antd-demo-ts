import { PieChartOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import Sider from 'antd/lib/layout/Sider';
import React from 'react';
import { useNavigate } from 'react-router-dom';
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}

const items: MenuProps['items'] = [

    getItem('Dashboard', '/', <PieChartOutlined />),
    getItem('Human Resource', 'hrsubm', <SettingOutlined />, [
        getItem('Job Title', '/job-title'),
        getItem('Employee', '/employee'),
    ]),
    getItem('Inventory', 'invsubm', <SettingOutlined />, [
        getItem('Transaction Type', '/transaction-type'),
        getItem('UoM', '/uom'),
        getItem('Brand', '/brand'),
        getItem('Category', '/category'),
        getItem('Product', '/product'),
        getItem('Opening Balance', '/opening-balance'),
    ]),
    getItem('Purchase', 'pursubm', <SettingOutlined />, [
        getItem('Supplier', '/supplier'),
        getItem('Purchase Order', '/purchase-order'),
        getItem('Product Receive', '/product-receive'),
        getItem('Purchase Register', '/purchase-register'),
    ]),
    getItem('Sales', 'slsubm', <SettingOutlined />, [
        getItem('Customer', '/customer'),
        getItem('Sales Invoice', '/sales-invoice'),
        getItem('Sales Return', '/sales-return'),
        getItem('Sales Register', '/sales-register'),
    ]),
    getItem('Settings', 'settingssubm', <SettingOutlined />, [
        getItem('Company', '/company'),
    ]),
];

const LeftSidebarComponent: React.FC = () => {
    const navigate = useNavigate();

    const onClick: MenuProps['onClick'] = e => {
        console.log('click ', e);
        navigate(e.key);
    };
    return (


        <>
            <Sider
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={(broken) => {
                    console.log(broken);
                }}
                onCollapse={(collapsed, type) => {
                    console.log(collapsed, type);
                }}
            >
                <Menu
                    onClick={onClick}
                    defaultSelectedKeys={['/']}
                    defaultOpenKeys={['invsum']}
                    mode="inline"
                    items={items}
                />
            </Sider>
        </>
    )
}


export default LeftSidebarComponent;