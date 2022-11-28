import { Layout } from 'antd';
import React from 'react';
import './App.css';
import ContentComponent from './components/Content/ContentComponent';
import FooterComponent from './components/Footer/FooterComponent';
import HeaderComponent from './components/Header/HeaderComponent';
import LeftSidebarComponent from './components/Sidebar/LeftSidebarComponent';

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
