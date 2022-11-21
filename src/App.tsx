import { Layout } from 'antd';
import React from 'react';
import './App.css';
import ContentComponent from './Component/Content/ContentComponent';
import FooterComponent from './Component/Footer/FooterComponent';
import HeaderComponent from './Component/Header/HeaderComponent';
import LeftSidebarComponent from './Component/Sidebar/LeftSidebarComponent';

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
