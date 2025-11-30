import { ConfigProvider } from 'antd';
import { RouterProvider } from 'react-router';
import { themeConfig } from './config/theme';
import { router } from './router';


function App() {
  return (
    <ConfigProvider theme={themeConfig}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;
