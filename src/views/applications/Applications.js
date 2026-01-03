import React, { useEffect, useState } from 'react'
import { Table, Tag, Spin, Button, message } from 'antd'
import moment from 'moment'
import { getApplications } from '../../api/devflow'
import axios from 'axios'

const statusColor = {
  Pending: 'gray',
  Running: 'blue',
  Succeeded: 'green',
  Failed: 'red',
  '': 'gray',
}

export default function Applications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [btnLoading, setBtnLoading] = useState({}) // 存每行按钮 loading 状态

  useEffect(() => {
    getApplications()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.data
        if (Array.isArray(data)) {
          setApplications(data)
        } else {
          console.warn('接口返回的数据不是数组:', res.data)
          setApplications([])
        }
      })
      .catch((err) => {
        console.error('获取应用列表失败', err)
        setError(err.message || '接口请求失败')
      })
      .finally(() => setLoading(false))
  }, [])

  const handleBuildManifest = async (application_id) => {
    setBtnLoading((prev) => ({ ...prev, [application_id]: true }))
    try {
      const res = await axios.post('https://devflow.bei.com:32000/api/v1/manifests', {
        application_id,
      })
      message.success('Manifest 构建请求已发送')
      console.log('构建返回:', res.data)
    } catch (err) {
      console.error('构建 Manifest 失败', err)
      message.error('构建 Manifest 失败')
    } finally {
      setBtnLoading((prev) => ({ ...prev, [application_id]: false }))
    }
  }

  const columns = [
    { title: '名称', dataIndex: 'name', key: 'name' },
    {
      title: '仓库地址',
      dataIndex: 'repo_url',
      key: 'repo_url',
      render: (url) =>
        url ? (
          <a href={url} target="_blank" rel="noopener noreferrer">
            {url}
          </a>
        ) : (
          '-'
        ),
    },
    {
      title: 'Active Manifest',
      dataIndex: 'active_manifest_name',
      key: 'active_manifest_name',
      render: (text) => text || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={statusColor[status]}>{status || 'Unknown'}</Tag>,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (time) => (time ? moment(time).format('YYYY-MM-DD HH:mm:ss') : '-'),
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (time) => (time ? moment(time).format('YYYY-MM-DD HH:mm:ss') : '-'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          loading={btnLoading[record.id]}
          onClick={() => handleBuildManifest(record.id)}
        >
          Build Manifest
        </Button>
      ),
    },
  ]

  return (
    <div style={{ padding: 20 }}>
      <h2>Applications Dashboard</h2>

      {loading ? (
        <Spin tip="Loading..." />
      ) : error ? (
        <p style={{ color: 'red' }}>接口请求失败: {error}</p>
      ) : applications.length === 0 ? (
        <p>暂无应用数据</p>
      ) : (
        <Table
          columns={columns}
          dataSource={applications}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      )}
    </div>
  )
}
