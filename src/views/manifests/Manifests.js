import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'
import { getManifests } from '../../api/devflow'
import axios from 'axios'
import moment from 'moment'

const statusColor = {
  Pending: 'secondary',
  Running: 'info',
  Succeeded: 'success',
  Failed: 'danger',
  '': 'secondary',
}

export default function ManifestsTable() {
  const [manifests, setManifests] = useState([])
  const [btnLoading, setBtnLoading] = useState({}) // 每行操作按钮 loading

  useEffect(() => {
    getManifests()
      .then((res) => {
        setManifests(Array.isArray(res.data) ? res.data : [])
      })
      .catch((err) => console.error('获取 Manifests 列表失败', err))
  }, [])

  const handleJob = async (manifest_id, type) => {
    const key = manifest_id + type
    setBtnLoading((prev) => ({ ...prev, [key]: true }))
    try {
      const res = await axios.post('https://devflow.bei.com:32000/api/v1/jobs', {
        manifest_id,
        type,
      })
      console.log('Job 创建返回:', res.data)
      alert(`Job ${type} 已发送`)
    } catch (err) {
      console.error('Job 创建失败', err)
      alert(`Job ${type} 创建失败`)
    } finally {
      setBtnLoading((prev) => ({ ...prev, [key]: false }))
    }
  }

  return (
    <CCard className="mb-4">
      <CCardHeader>
        <strong>Manifests</strong>
      </CCardHeader>
      <CCardBody>
        <CTable hover responsive>
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell>应用名</CTableHeaderCell>
              <CTableHeaderCell>Manifest 名称</CTableHeaderCell>
              <CTableHeaderCell>分支</CTableHeaderCell>
              <CTableHeaderCell>Pipeline</CTableHeaderCell>
              <CTableHeaderCell>状态</CTableHeaderCell>
              <CTableHeaderCell>创建时间</CTableHeaderCell>
              <CTableHeaderCell>操作</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {manifests.map((m) => (
              <CTableRow key={m.id}>
                <CTableDataCell>{m.application_name}</CTableDataCell>
                <CTableDataCell>{m.name}</CTableDataCell>
                <CTableDataCell>{m.branch}</CTableDataCell>
                <CTableDataCell>{m.pipeline_id}</CTableDataCell>
                <CTableDataCell>
                  <CBadge color={statusColor[m.status] || 'secondary'}>{m.status || '-'}</CBadge>
                </CTableDataCell>
                <CTableDataCell>
                  {moment(m.created_at).format('YYYY-MM-DD HH:mm:ss')}
                </CTableDataCell>
                <CTableDataCell>
                  <CDropdown>
                    <CDropdownToggle color="primary" size="sm">
                      操作
                    </CDropdownToggle>
                    <CDropdownMenu>
                      <CDropdownItem
                        onClick={() => handleJob(m.id, 'Install')}
                        disabled={btnLoading[m.id + 'Install']}
                      >
                        Install {btnLoading[m.id + 'Install'] && '(处理中...)'}
                      </CDropdownItem>
                      <CDropdownItem
                        onClick={() => handleJob(m.id, 'Upgrade')}
                        disabled={btnLoading[m.id + 'Upgrade']}
                      >
                        Upgrade {btnLoading[m.id + 'Upgrade'] && '(处理中...)'}
                      </CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  )
}
