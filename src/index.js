import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'

import App from './App'
import store from './store'
import { initApiClient } from './api/devflow'

// 异步初始化 API，然后再渲染 App
initApiClient().then(() => {
    console.log('API 已初始化')

    createRoot(document.getElementById('root')).render(
        <Provider store={store}>
            <App />
        </Provider>
    )
})
