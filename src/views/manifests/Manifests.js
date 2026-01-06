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
import { getManifests, postJobs } from '../../api/devflow'
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
  const [loading, setLoading] = useState(true)
  const [btnLoading, setBtnLoading] = useState({}) // 每行操作按钮 loading

  useEffect(() => {
    getManifests()
        .then((data) => {
          setManifests(Array.isArray(data) ? data : [])
        })
        .finally(() => setLoading(false))
  }, [])

  const handleJob = async (manifest_id, type) => {
    const key = manifest_id + type
    setBtnLoading((prev) => ({ ...prev, [key]: true }))
    try {
      await postJobs({ manifest_id, type })
      alert(`Job ${type} 已发送`)
    } finally {
      setBtnLoading((prev) => ({ ...prev, [key]: false }))
    }
  }

  return (
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Manifests Dashboard</strong>
        </CCardHeader>
        <CCardBody>
          {loading ? (
              <p>Loading...</p>
          ) : manifests.length === 0 ? (
              <p>暂无 Manifest 数据</p>
          ) : (
              <CTable hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>Id</CTableHeaderCell>
                    <CTableHeaderCell>Manifest</CTableHeaderCell>
                    <CTableHeaderCell>Branch</CTableHeaderCell>
                    <CTableHeaderCell>Pipeline</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Create At</CTableHeaderCell>
                    <CTableHeaderCell>Operate</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {manifests.map((m) => (
                      <CTableRow key={m.id}>
                        <CTableDataCell>{m.id}</CTableDataCell>
                        <CTableDataCell>{m.name}</CTableDataCell>
                        <CTableDataCell>{m.branch}</CTableDataCell>
                        <CTableDataCell>{m.pipeline_id}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={statusColor[m.status] || 'secondary'}>
                            {m.status || '-'}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          {m.created_at
                              ? moment(m.created_at).format('YYYY-MM-DD HH:mm:ss')
                              : '-'}
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
                                Install{' '}
                                {btnLoading[m.id + 'Install'] ? '(处理中...)' : ''}
                              </CDropdownItem>
                              <CDropdownItem
                                  onClick={() => handleJob(m.id, 'Upgrade')}
                                  disabled={btnLoading[m.id + 'Upgrade']}
                              >
                                Upgrade{' '}
                                {btnLoading[m.id + 'Upgrade'] ? '(处理中...)' : ''}
                              </CDropdownItem>
                            </CDropdownMenu>
                          </CDropdown>
                        </CTableDataCell>
                      </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
          )}
        </CCardBody>
      </CCard>
  )
}