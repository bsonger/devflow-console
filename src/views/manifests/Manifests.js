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
  CButton,
} from '@coreui/react'
import { getManifests, postJobs } from '../../api/devflow'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'

const statusColor = {
  Pending: 'secondary',
  Running: 'info',
  Succeeded: 'success',
  Failed: 'danger',
}

export default function ManifestsTable() {
  const [manifests, setManifests] = useState([])
  const [loading, setLoading] = useState(true)
  const [btnLoading, setBtnLoading] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    getManifests()
        .then((data) => setManifests(Array.isArray(data) ? data : []))
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

  const handleIdClick = (id) => {
    navigate(`/manifests/${id}`, { replace: false }) // ✅ 使用 navigate 跳转详情页
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
                    <CTableHeaderCell>操作</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {manifests.map((m) => (
                      <CTableRow key={m.id}>
                        {/* 点击 ID 跳转 */}
                        <CTableDataCell>
                          <CButton
                              color="link"
                              size="sm"
                              onClick={() => handleIdClick(m.id)}
                          >
                            {m.id}
                          </CButton>
                        </CTableDataCell>

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

                        {/* Job 操作 */}
                        <CTableDataCell>
                          <CDropdown>
                            <CDropdownToggle color="primary" size="sm">
                              Job 操作
                            </CDropdownToggle>
                            <CDropdownMenu>
                              <CDropdownItem
                                  onClick={() => handleJob(m.id, 'Install')}
                                  disabled={btnLoading[m.id + 'Install']}
                              >
                                Install {btnLoading[m.id + 'Install'] ? '(处理中...)' : ''}
                              </CDropdownItem>
                              <CDropdownItem
                                  onClick={() => handleJob(m.id, 'Upgrade')}
                                  disabled={btnLoading[m.id + 'Upgrade']}
                              >
                                Upgrade {btnLoading[m.id + 'Upgrade'] ? '(处理中...)' : ''}
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