import axios from 'axios'
import yaml from 'js-yaml'

const apiClient = axios.create({
  baseURL: 'https://devflow.bei.com/api/v1',
  timeout: 10000,
  headers: { Accept: 'application/json' },
})

/* ================= 请求拦截器 ================= */
apiClient.interceptors.request.use(
    (config) => {
      console.log(
          '[API REQUEST]',
          config.method?.toUpperCase(),
          config.baseURL + config.url
      )
      return config
    },
    (error) => Promise.reject(error)
)

/* ================= 响应拦截器（唯一） ================= */
apiClient.interceptors.response.use(
    (response) => {
      // ✅ 成功：只返回 data
      return response.data
    },
    (error) => {
      const { response, config } = error

      if (!response) {
        console.error('[API NETWORK ERROR]', config?.url, error.message)
        alert('网络异常，请检查网络或证书配置')
        return Promise.reject(error)
      }

      const { status, data } = response

      console.error('[API ERROR]', status, config.url, data)

      switch (status) {
        case 401:
          alert('登录已过期，请重新登录')
          break
        case 403:
          alert('没有权限执行该操作')
          break
        case 404:
          alert('接口不存在')
          break
        case 500:
          alert(data?.message || '服务器内部错误')
          break
        default:
          alert(data?.message || `请求失败(${status})`)
      }

      return Promise.reject(error)
    }
)

/* ================= 动态初始化 baseURL ================= */
export const initApiClient = async () => {
  let baseURL = ''
  const configPaths = [
    'config/config.yaml',
    '/etc/devflow-console/config/config.yaml',
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
    baseURL = 'https://devflow.bei.com/api/v1'
  }

  apiClient.defaults.baseURL = baseURL
  console.log('API baseURL 已设置为:', baseURL)
}

/* ================= API 方法 ================= */
export const getJobs = () => apiClient.get('/jobs')
export const getApplications = () => apiClient.get('/applications')
export const getManifests = () => apiClient.get('/manifests')
export const postManifests = (data) => apiClient.post('/manifests', data)
export const postJobs = (data) => apiClient.post('/jobs', data)

export default apiClient