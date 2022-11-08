import Layout from 'antd/lib/layout/layout';
import React from 'react';
import './App.css';
import ContentComponent from './Component/Content/ContentComponent';
import FooterComponent from './Component/Footer/FooterComponent';
import HeaderComponent from './Component/Header/HeaderComponent';
import LeftSidebarComponent from './Component/Sidebar/LeftSidebarComponent';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ContactComponent from './Component/Content/Contact/ContactComponent';
import UomComponent from './Component/Content/Inventory/Uom/UomComponent';

const App: React.FC = () => (
  <>
    <Layout>
      <LeftSidebarComponent />
      <Layout>
        <HeaderComponent />
        <ContentComponent />
        <FooterComponent />
      </Layout>
    </Layout>

  </>
);

export default App;
