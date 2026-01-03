import axios from 'axios'
import yaml from 'js-yaml'

const apiClient = axios.create({
  baseURL: "https://devflow.bei.com:32000/api/v1", // 默认 baseURL
  timeout: 10000,
  headers: { Accept: 'application/json' },
})

// Axios 请求拦截器（可选）
apiClient.interceptors.request.use((config) => {
  console.log('请求 URL:', config.baseURL + config.url)
  return config
})

// 异步初始化函数，用于动态读取配置
export const initApiClient = async () => {
  let baseURL = ''
  const configPaths = [
    '/config/config.yaml',
    '/etc/devflow-console/config/config.yaml'
  ]

  for (const path of configPaths) {
    try {
      const res = await fetch(path)
      if (!res.ok) continue
      const text = await res.text()
      const config = yaml.load(text)
      baseURL = config?.server?.url
      if (baseURL) break
    } catch (err) {
      console.warn(`读取 ${path} 失败，尝试下一个路径`, err)
    }
  }

  if (!baseURL) {
    console.warn('未读取到配置文件，使用默认 URL')
    baseURL = 'https://devflow.bei.com:32000/api/v1'
  }

  apiClient.defaults.baseURL = baseURL
  console.log('API baseURL 已设置为:', apiClient.defaults.baseURL)
}

// 保留同步导出函数，其他模块无需改动
export const getJobs = () => apiClient.get('/jobs')
export const getApplications = () => apiClient.get('/applications', { withCredentials: false })
export const getManifests = () => apiClient.get('/manifests')