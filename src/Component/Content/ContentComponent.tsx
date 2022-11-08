import { Content } from 'antd/lib/layout/layout';
import { Outlet } from "react-router-dom";
import ContactComponent from './Contact/ContactComponent';
import DashboardComponent from './Dashboard/DashboardComponent';
import UomComponent from './Inventory/Uom/UomComponent';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Brand from './Inventory/Brand/Brand';
import Product from './Inventory/Product/Product';
const ContentComponent: React.FC = () => (
    <>
        <Content
            style={{
                margin: '24px 16px 0',
            }}
        >
            <div
                className="site-layout-background"
                style={{
                    padding: 24,
                    minHeight: 360,
                }}
            >
                <Routes>
                    <Route path="/" element={<DashboardComponent />} />
                    <Route path="contact" element={<ContactComponent />} />
                    <Route path="uom" element={<UomComponent />} />
                    <Route path="brand" element={<Brand />} />
                    <Route path="product" element={<Product />} />
                </Routes>
            </div>
        </Content></>
)

export default ContentComponent;