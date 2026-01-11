// pages/ApplicationDetail.jsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Spin, Button, message, Descriptions, Table, Modal, Form, Input, InputNumber } from 'antd'
import moment from 'moment'
import { getApplicationsById, postManifests, putApplication } from '../../api/devflow' // putApplication 新增

export default function ApplicationDetail() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [application, setApplication] = useState(null)
    const [loading, setLoading] = useState(true)
    const [btnLoading, setBtnLoading] = useState(false)
    const [editModalVisible, setEditModalVisible] = useState(false)
    const [editLoading, setEditLoading] = useState(false)
    const [form] = Form.useForm()

    // 获取 application 详情
    const fetchApplication = () => {
        setLoading(true)
        getApplicationsById(id)
            .then((data) => setApplication(data))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchApplication()
    }, [id])

    const handleBuildManifest = async () => {
        setBtnLoading(true)
        try {
            await postManifests({ application_id: id })
            message.success('Manifest 构建请求已发送')
        } finally {
            setBtnLoading(false)
        }
    }

    const openEditModal = () => {
        form.setFieldsValue({
            name: application.name,
            repo_url: application.repo_url,
            replica: application.replica,
            type: application.type,
        })
        setEditModalVisible(true)
    }

    const handleEditSubmit = async () => {
        try {
            const values = await form.validateFields()
            setEditLoading(true)
            await putApplication(id, values)
            message.success('更新成功')
            setEditModalVisible(false)
            fetchApplication() // 刷新页面数据
        } catch (err) {
            console.error(err)
        } finally {
            setEditLoading(false)
        }
    }

    if (loading) return <Spin tip="Loading..." style={{ margin: 50 }} />

    if (!application) return <p>未找到 Application 数据</p>

    const serviceColumns = [
        { title: '名称', dataIndex: 'name', key: 'name' },
        { title: 'Port', dataIndex: 'port', key: 'port' },
        { title: 'Target Port', dataIndex: 'target_port', key: 'target_port' },
    ]

    return (
        <div style={{ padding: 20 }}>
            <Button onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
                返回
            </Button>

            <h2>Application Detail: {application.name}</h2>

            <Card style={{ marginBottom: 20 }}>
                <Descriptions column={1} bordered>
                    <Descriptions.Item label="ID">{application.id}</Descriptions.Item>
                    <Descriptions.Item label="名称">{application.name}</Descriptions.Item>
                    <Descriptions.Item label="项目">{application.project_name}</Descriptions.Item>
                    <Descriptions.Item label="仓库地址">
                        {application.repo_url ? (
                            <a href={application.repo_url} target="_blank" rel="noopener noreferrer">
                                {application.repo_url}
                            </a>
                        ) : '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Active Manifest">{application.active_manifest_name || '-'}</Descriptions.Item>
                    <Descriptions.Item label="副本数">{application.replica}</Descriptions.Item>
                    <Descriptions.Item label="类型">{application.type}</Descriptions.Item>
                    <Descriptions.Item label="网络">{application.internet}</Descriptions.Item>
                    <Descriptions.Item label="创建时间">
                        {application.created_at ? moment(application.created_at).format('YYYY-MM-DD HH:mm:ss') : '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="更新时间">
                        {application.updated_at ? moment(application.updated_at).format('YYYY-MM-DD HH:mm:ss') : '-'}
                    </Descriptions.Item>
                </Descriptions>

                <div style={{ marginTop: 16 }}>
                    <Button type="primary" style={{ marginRight: 8 }} onClick={handleBuildManifest} loading={btnLoading}>
                        Build Manifest
                    </Button>
                    <Button onClick={openEditModal}>Edit</Button>
                </div>
            </Card>

            {application.service?.Ports?.length > 0 && (
                <Card title="Service Ports" style={{ marginBottom: 20 }}>
                    <Table columns={serviceColumns} dataSource={application.service.Ports} rowKey="name" pagination={false} />
                </Card>
            )}

            {application.config_maps?.length > 0 && (
                <Card title="Config Maps" style={{ marginBottom: 20 }}>
                    <Table
                        columns={[
                            { title: '名称', dataIndex: 'name', key: 'name' },
                            { title: '挂载路径', dataIndex: 'mount_path', key: 'mount_path' },
                            { title: '文件路径', dataIndex: 'files_path', key: 'files_path', render: (text) => text || '-' },
                        ]}
                        dataSource={application.config_maps}
                        rowKey="name"
                        pagination={false}
                    />
                </Card>
            )}

            {/* 编辑 Modal */}
            <Modal
                visible={editModalVisible}
                title="编辑 Application"
                onCancel={() => setEditModalVisible(false)}
                onOk={handleEditSubmit}
                confirmLoading={editLoading}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="repo_url" label="仓库地址" rules={[{ type: 'url', message: '请输入正确的 URL' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="replica" label="副本数" rules={[{ required: true, message: '请输入副本数' }]}>
                        <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="type" label="类型" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}