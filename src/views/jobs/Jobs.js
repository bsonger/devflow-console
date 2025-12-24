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
} from '@coreui/react'
import { getJobs } from '../../api/devflow' // 接口方法
import moment from 'moment'

const statusColor = {
  Running: 'info',
  Succeeded: 'success',
  Failed: 'danger',
  Pending: 'secondary',
  '': 'secondary',
}

export default function JobsTable() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getJobs()
      .then((res) => {
        if (Array.isArray(res.data)) {
          setJobs(res.data)
        } else {
          console.warn('接口返回数据不是数组:', res.data)
          setJobs([])
        }
      })
      .catch((err) => console.error('获取 Jobs 列表失败', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <CCard>
      <CCardHeader>Jobs</CCardHeader>
      <CCardBody>
        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell>Application</CTableHeaderCell>
              <CTableHeaderCell>Manifest</CTableHeaderCell>
              <CTableHeaderCell>Type</CTableHeaderCell>
              <CTableHeaderCell>Status</CTableHeaderCell>
              <CTableHeaderCell>Created At</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {jobs.length === 0 && !loading && (
              <CTableRow>
                <CTableDataCell colSpan={6} className="text-center">
                  No Jobs Found
                </CTableDataCell>
              </CTableRow>
            )}
            {jobs.map((job) => (
              <CTableRow key={job.id}>
                <CTableDataCell>{job.manifest_name}</CTableDataCell>
                <CTableDataCell>{job.application_name || '-'}</CTableDataCell>
                <CTableDataCell>{job.manifest_id || '-'}</CTableDataCell>
                <CTableDataCell>{job.type || '-'}</CTableDataCell>
                <CTableDataCell>
                  <CBadge color={statusColor[job.status] || 'secondary'}>
                    {job.status || '-'}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell>
                  {job.created_at ? moment(job.created_at).format('YYYY-MM-DD HH:mm:ss') : '-'}
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  )
}
