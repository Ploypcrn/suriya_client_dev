import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { store } from './store/index.js';
import { Provider } from 'react-redux';
import { AuthContext } from "./components";
import ConfigProvider from "antd/es/config-provider/index";
import routes from "./routes/index.jsx";
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback={<div
      className='flex justify-center items-center h-screen w-screen bg-white text-2xl font-bold'>Loading...</div>}>
      <AuthContext.Provider value={routes}>
        <Provider store={store}>
            <ConfigProvider
              theme={{
                token: {
                  fontFamily: "Sarabun , sans-serif",
                  colorPrimary: "#173154",
                  colorPrimaryHover: "#173154",
                },
                components: {
                  Menu: {
                    // itemHoverBg: "#173154",
                    itemSelectedBg: "#e9edf7",
                    itemSelectedColor: "#173154",
                    /* here is your component tokens */
                  },
                  Input: {},
                },
              }}
            >
              <App />
            </ConfigProvider>
        </Provider>
      </AuthContext.Provider>
    </Suspense>
  </React.StrictMode>
)