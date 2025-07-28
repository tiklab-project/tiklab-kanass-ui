import {inject, observer} from "mobx-react";
import "./WorkAttachPage.scss"
import React, {Fragment, useRef} from "react";
import {message, Space, Table, Tooltip, Upload} from "antd";
import { getUser } from 'tiklab-core-ui';
import setImageUrl from "../../common/utils/setImageUrl";
import DeleteModal from "../../common/deleteModal/deleteModal";
const { Dragger } = Upload;

const WorkAttachPage = (props) => {
    const {workStore} = props;
    const {attachList, deleteWorkAttach, findWorkAttachList, createWorkAttach, workId} = workStore;

    const ticket = getUser().ticket;
    const tenant = getUser().tenant;
    // 上传附件的信息
    const upload_url = env === "local" ? base_url : "";
    const formRef = useRef();

    // 上传附件
    const filesParams = {
        name: 'uploadFile',
        multiple: true,
        action: `${upload_url}/dfs/upload`,
        showUploadList: false,
        headers: {
            ticket: ticket,
            tenant: tenant
        },
        onChange(info) {
            const { status } = info.file;
            if (status === 'done') {
                const res = info.file.response;
                const params = {
                    workItem: {
                        id: workId
                    },
                    attachmentName: info.file.name,
                    attachmentUrl: res.data,
                    type: info.file.type
                }
                createWorkAttach(params).then(() => {
                    findWorkAttachList(workId)
                })
                message.success(`${info.file.name} 文件上传成功.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} 文件上传失败.`);
            }
        }
    }
    // 文件列表的
    const attachColums = [
        {
            title: '文件',
            dataIndex: 'attachmentName',
            key: 'name',
            width: "30%",
            render: (text, record) => {
                return (
                    record.type.indexOf("image") === -1 ?
                        <a href={setImageUrl("/file/" + record.attachmentUrl)}
                           target="_blank"
                        >
                            {text}
                        </a>
                        :
                        <a href={setImageUrl("/image/" + record.attachmentUrl)}
                           target="_blank"
                        >
                            {text}
                        </a>
                )
            }
        },
        {
            title: '文件类型',
            dataIndex: "type",
            key: 'type',
            width: "10%",
            render: (text, record) => <Tooltip title={record.attachmentName.split('.').pop()}>{record.attachmentName.split('.').pop()}</Tooltip>
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width: "10%",
            render: (text, record) => <Space size="middle">
                <DeleteModal deleteFunction={deleteWorkAttach} id={record.id} getPopupContainer={formRef.current} />
            </Space>
        }
    ]

    return(
        <Fragment>
            <div ref={formRef}>
                {
                    attachList && attachList.length > 0 && (
                        <Fragment>
                            <Table columns={attachColums}
                                   dataSource={attachList}
                                   pagination={false}
                                   bordered={false}
                                   rowKey={(record) => record.id}
                                   scroll={{x: "100%"}}
                            />
                        </Fragment>
                    )
                }
            </div>
            <div className="work-detail-upload">
                <Dragger className="work-detail-upload" {...filesParams}>
                    <p className="ant-upload-drag-icon">
                        <svg className="icon-20" aria-hidden="true">
                            <use xlinkHref="#icon-uploadImg-gray"></use>
                        </svg>上传附件
                    </p>
                </Dragger>
            </div>
        </Fragment>
    )
};

export default inject("workStore")(observer(WorkAttachPage));