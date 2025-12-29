import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import router from './router';
import ToastContainer from '@/components/Toast';

const App: React.FC = () => {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#6236FF', // 南大紫
          borderRadius: 6,
        },
        components: {
          Layout: {
            siderBg: '#001529',
          },
        },
      }}
    >
      <RouterProvider router={router} />
      <ToastContainer />
    </ConfigProvider>
  );
};

export default App;