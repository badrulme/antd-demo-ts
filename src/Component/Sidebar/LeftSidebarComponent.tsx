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
    getItem('Inventory Management', 'invsum', <SettingOutlined />, [
        getItem('UoM', '/uom'),
        getItem('Brand', '/brand'),
        getItem('Category', '/category'),
        getItem('Product', '/product'),
    ]),
    getItem('Purchase Management', 'pursum', <SettingOutlined />, [
        getItem('Supplier', '/supplier'),
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