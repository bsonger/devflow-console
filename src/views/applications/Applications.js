import React, { useEffect, useState } from 'react'
import { Table, Spin, Button, message } from 'antd'
import moment from 'moment'
import { getApplications, postManifests } from '../../api/devflow'

export default function Applications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [btnLoading, setBtnLoading] = useState({})

  useEffect(() => {
    getApplications()
        .then((data) => {
          // data 已经是后端返回的数据
          setApplications(Array.isArray(data) ? data : [])
        })
        .finally(() => setLoading(false))
  }, [])

  const handleBuildManifest = async (application_id) => {
    setBtnLoading((prev) => ({ ...prev, [application_id]: true }))
    try {
      await postManifests({ application_id })
      message.success('Manifest 构建请求已发送')
    } finally {
      setBtnLoading((prev) => ({ ...prev, [application_id]: false }))
    }
  }

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
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
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (time) =>
          time ? moment(time).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
    // {
    //   title: '更新时间',
    //   dataIndex: 'updated_at',
    //   key: 'updated_at',
    //   render: (time) =>
    //       time ? moment(time).format('YYYY-MM-DD HH:mm:ss') : '-',
    // },
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