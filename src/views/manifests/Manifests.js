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
  CFormSelect,
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import { getManifests, postJobs, getApplications } from '../../api/devflow'
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
  const [applications, setApplications] = useState([]) // applicationName 下拉列表
  const [selectedApp, setSelectedApp] = useState('') // 当前选择的 applicationName
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10
  const navigate = useNavigate()

  useEffect(() => {
    // 获取所有 Manifests
    getManifests()
        .then((data) => setManifests(Array.isArray(data) ? data : []))
        .finally(() => setLoading(false))

    // 获取 application 列表
    getApplications().then((apps) => {
      setApplications(Array.isArray(apps) ? apps : [])
    })
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
    navigate(`/manifests/${id}`, { replace: false })
  }

  // 根据选择的 applicationName 过滤
  const filteredManifests = selectedApp
      ? manifests.filter((m) => m.application_name === selectedApp)
      : manifests

  // 分页计算
  const pageCount = Math.ceil(filteredManifests.length / pageSize)
  const pagedManifests = filteredManifests.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize,
  )

  return (
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <strong>Manifests Dashboard</strong>
          <div style={{ width: 200 }}>
            <CFormSelect
                value={selectedApp}
                onChange={(e) => {
                  setSelectedApp(e.target.value)
                  setCurrentPage(1) // 切换筛选回到第一页
                }}
            >
              <option value="">全部 Application</option>
              {applications.map((app) => (
                  <option key={app.id} value={app.name}>
                    {app.name}
                  </option>
              ))}
            </CFormSelect>
          </div>
        </CCardHeader>
        <CCardBody>
          {loading ? (
              <p>Loading...</p>
          ) : filteredManifests.length === 0 ? (
              <p>暂无 Manifest 数据</p>
          ) : (
              <>
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
                    {pagedManifests.map((m) => (
                        <CTableRow key={m.id}>
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

                {/* 分页控件 */}
                {pageCount > 1 && (
                    <CPagination
                        align="center"
                        aria-label="Page navigation example"
                        className="mt-3"
                    >
                      {Array.from({ length: pageCount }, (_, i) => (
                          <CPaginationItem
                              key={i + 1}
                              active={i + 1 === currentPage}
                              onClick={() => setCurrentPage(i + 1)}
                          >
                            {i + 1}
                          </CPaginationItem>
                      ))}
                    </CPagination>
                )}
              </>
          )}
        </CCardBody>
      </CCard>
  )
}