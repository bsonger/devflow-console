import React, { useEffect, useState } from 'react'
import { useParams} from 'react-router-dom'
import { CCard, CCardHeader, CCardBody, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CBadge } from '@coreui/react'
import { getManifestById } from '../../api/devflow'
import moment from 'moment'

const statusColor = {
    Pending: 'secondary',
    Running: 'info',
    Succeeded: 'success',
    Failed: 'danger',
}

export default function ManifestDetail() {
    const { id } = useParams()
    const [manifest, setManifest] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchManifest = async () => {
            try {
                const data = await getManifestById(id)
                setManifest(data)
            } catch (err) {
                console.error('获取 Manifest 详情失败', err)
            } finally {
                setLoading(false)
            }
        }

        fetchManifest()

        // 定时刷新状态（比如每 5 秒）
        const interval = setInterval(fetchManifest, 5000)
        return () => clearInterval(interval)
    }, [id])

    if (loading) return <p>Loading...</p>
    if (!manifest) return <p>Manifest 不存在</p>

    return (
        <CCard className="mb-4">
            <CCardHeader>Manifest Detail - {manifest.name}</CCardHeader>
            <CCardBody>
                <p><strong>Id:</strong> {manifest.id}</p>
                <p><strong>Application:</strong> {manifest.application_name}</p>
                <p><strong>Branch:</strong> {manifest.branch}</p>
                <p><strong>Pipeline:</strong> {manifest.pipeline_id}</p>
                <p><strong>Status:</strong> <CBadge color={statusColor[manifest.status] || 'secondary'}>{manifest.status}</CBadge></p>
                <p><strong>Created At:</strong> {moment(manifest.created_at).format('YYYY-MM-DD HH:mm:ss')}</p>
                <p><strong>Updated At:</strong> {moment(manifest.updated_at).format('YYYY-MM-DD HH:mm:ss')}</p>
                <p><strong>Type:</strong> {manifest.type}</p>
                <p><strong>Replica:</strong> {manifest.replica}</p>
                <p><strong>Git Repo:</strong> <a href={manifest.git_repo} target="_blank" rel="noopener noreferrer">{manifest.git_repo}</a></p>

                <h5>Steps</h5>
                <CTable hover responsive>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell>Task Name</CTableHeaderCell>
                            <CTableHeaderCell>Task Run</CTableHeaderCell>
                            <CTableHeaderCell>Status</CTableHeaderCell>
                            <CTableHeaderCell>Start Time</CTableHeaderCell>
                            <CTableHeaderCell>End Time</CTableHeaderCell>
                            <CTableHeaderCell>Message</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {manifest.steps.map((s, idx) => (
                            <CTableRow key={idx}>
                                <CTableDataCell>{s.task_name}</CTableDataCell>
                                <CTableDataCell>{s.task_run}</CTableDataCell>
                                <CTableDataCell><CBadge color={statusColor[s.status] || 'secondary'}>{s.status}</CBadge></CTableDataCell>
                                <CTableDataCell>{s.start_time ? moment(s.start_time).format('YYYY-MM-DD HH:mm:ss') : '-'}</CTableDataCell>
                                <CTableDataCell>{s.end_time ? moment(s.end_time).format('YYYY-MM-DD HH:mm:ss') : '-'}</CTableDataCell>
                                <CTableDataCell>{s.message}</CTableDataCell>
                            </CTableRow>
                        ))}
                    </CTableBody>
                </CTable>
            </CCardBody>
        </CCard>
    )
}