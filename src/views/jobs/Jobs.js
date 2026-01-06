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
  CSpinner,
} from '@coreui/react'
import { getJobs } from '../../api/devflow'
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
        .then((data) => {
          setJobs(Array.isArray(data) ? data : [])
        })
        .finally(() => setLoading(false))
  }, [])

  return (
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Jobs Dashboard</strong>
        </CCardHeader>
        <CCardBody>
          {loading ? (
              <div style={{ textAlign: 'center', padding: 20 }}>
                <CSpinner component="span" size="sm" aria-hidden="true" />
                <span style={{ marginLeft: 8 }}>Loading...</span>
              </div>
          ) : jobs.length === 0 ? (
              <p style={{ textAlign: 'center' }}>暂无 Job 数据</p>
          ) : (
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Id</CTableHeaderCell>
                    <CTableHeaderCell>Application</CTableHeaderCell>
                    <CTableHeaderCell>Manifest</CTableHeaderCell>
                    <CTableHeaderCell>Type</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Created At</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {jobs.map((job) => (
                      <CTableRow key={job.id}>
                        <CTableDataCell>{job.id}</CTableDataCell>
                        <CTableDataCell>{job.application_name || '-'}</CTableDataCell>
                        <CTableDataCell>{job.manifest_name || '-'}</CTableDataCell>
                        <CTableDataCell>{job.type || '-'}</CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={statusColor[job.status] || 'secondary'}>
                            {job.status || '-'}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          {job.created_at
                              ? moment(job.created_at).format('YYYY-MM-DD HH:mm:ss')
                              : '-'}
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