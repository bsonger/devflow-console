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
    CFormSelect,
    CPagination,
    CPaginationItem,
} from '@coreui/react'
import { getJobs, getApplications } from '../../api/devflow'
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
    const [apps, setApps] = useState([])
    const [filterApp, setFilterApp] = useState('')
    const [page, setPage] = useState(1)
    const pageSize = 10

    // 获取 job 数据
    useEffect(() => {
        getJobs().then((data) => {
            setJobs(Array.isArray(data) ? data : [])
            setLoading(false)
        })
        // 获取应用列表，用于筛选
        getApplications().then((data) => {
            setApps(Array.isArray(data) ? data : [])
        })
    }, [])

    // 筛选后的数据
    const filteredJobs = filterApp
        ? jobs.filter((job) => job.application_name === filterApp)
        : jobs

    const pageCount = Math.ceil(filteredJobs.length / pageSize)
    const currentJobs = filteredJobs.slice((page - 1) * pageSize, page * pageSize)

    return (
        <CCard className="mb-4">
            <CCardHeader>
                <strong>Jobs Dashboard</strong>
                <div style={{ float: 'right', width: 200 }}>
                    <CFormSelect
                        value={filterApp}
                        onChange={(e) => {
                            setFilterApp(e.target.value)
                            setPage(1) // 重置分页
                        }}
                    >
                        <option value="">全部应用</option>
                        {apps.map((app) => (
                            <option key={app.id} value={app.name}>
                                {app.name}
                            </option>
                        ))}
                    </CFormSelect>
                </div>
            </CCardHeader>
            <CCardBody>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: 20 }}>
                        <CSpinner component="span" size="sm" aria-hidden="true" />
                        <span style={{ marginLeft: 8 }}>Loading...</span>
                    </div>
                ) : currentJobs.length === 0 ? (
                    <p style={{ textAlign: 'center' }}>暂无 Job 数据</p>
                ) : (
                    <>
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
                                {currentJobs.map((job) => (
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

                        {pageCount > 1 && (
                            <div style={{ marginTop: 16, textAlign: 'center' }}>
                                <CPagination aria-label="Jobs pagination">
                                    {Array.from({ length: pageCount }, (_, i) => (
                                        <CPaginationItem
                                            key={i + 1}
                                            active={i + 1 === page}
                                            onClick={() => setPage(i + 1)}
                                        >
                                            {i + 1}
                                        </CPaginationItem>
                                    ))}
                                </CPagination>
                            </div>
                        )}
                    </>
                )}
            </CCardBody>
        </CCard>
    )
}