import { Route, Routes } from "react-router-dom";
import ContactComponent from './Contact/ContactComponent';
import DashboardComponent from './Dashboard/DashboardComponent';
import Employee from './Hr/Employee';
import JobTitle from './Hr/JobTitle';
import Brand from './Inventory/Brand/Brand';
import Category from './Inventory/Category/Category';
import OpeningBalance from './Inventory/OpeningBalance/OpeningBalance';
import Product from './Inventory/Product/Product';
import TransactionType from './Inventory/TransactionType/TransactionType';
import Uom from './Inventory/Uom/Uom';
import PurchaseOrder from './Purchase/Order/PurchaseOrder';
import ProductReceive from './Purchase/Receive/ProductReceive';
import PurchaseRegister from './Purchase/Register/PurchaseRegister';
import Supplier from './Purchase/Supplier';
import Customer from './Sales/Customer';
import SalesInvoice from './Sales/Invoice/SalesInvoice';
import SalesRegister from './Sales/Register/SalesRegister';
import SalesReturn from './Sales/Return/SalesReturn';
import CompanyInfo from './Settings/CompanyInfo/CompanyInfo';

import { Layout } from 'antd';
import Department from "./Hr/Department";

const { Content } = Layout;


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
                    <Route path="uom" element={<Uom />} />
                    <Route path="brand" element={<Brand />} />
                    <Route path="product" element={<Product />} />
                    <Route path="category" element={<Category />} />
                    <Route path="department" element={<Department />} />
                    <Route path="job-title" element={<JobTitle />} />
                    <Route path="employee" element={<Employee />} />
                    <Route path="customer" element={<Customer />} />
                    <Route path="supplier" element={<Supplier />} />
                    <Route path="transaction-type" element={<TransactionType />} />
                    <Route path="opening-balance" element={<OpeningBalance />} />
                    <Route path="sales-invoice" element={<SalesInvoice />} />
                    <Route path="sales-invoice:id" element={<SalesInvoice />} />
                    <Route path="sales-register" element={<SalesRegister />} />
                    <Route path="sales-register:id" element={<SalesRegister />} />
                    <Route path="sales-return" element={<SalesReturn />} />
                    <Route path="sales-return:id" element={<SalesReturn />} />
                    <Route path="purchase-order" element={<PurchaseOrder />} />
                    <Route path="purchase-order:id" element={<PurchaseOrder />} />
                    <Route path="product-receive" element={<ProductReceive />} />
                    <Route path="product-receive:id" element={<ProductReceive />} />
                    <Route path="purchase-register" element={<PurchaseRegister />} />
                    <Route path="purchase-register:id" element={<PurchaseRegister />} />
                    <Route path="company" element={<CompanyInfo />} />
                </Routes>
            </div>
        </Content></>
)

export default ContentComponent;