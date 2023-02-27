/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-10-13 16:54:17
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-21 13:11:30
 */
import React from "react";
import { Upload, message, Button, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import "./LoadData.scss";
import Breadcumb from "../../common/breadcrumb/Breadcrumb";
import { getUser } from 'tiklab-core-ui'
const LoadData = props => {
    const ticket = getUser().ticket;
    const uploadProps = {
        name: 'uploadFile',
        action: `${base_url}/importDate/importJireDate`,
        headers: {
            authorization: 'authorization-text',
        },
        headers: {
            ticket: ticket
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    return (
        <Row >
            <Col lg={{ span: 24 }} xxl={{ span: "18", offset: "3" }}>
                <div className="load">
                    <Breadcumb
                        firstText="系统集成"
                        secondText="jira集成"
                    />
                    <div className="load-jira">
                        <div>从本地文件导入Jira数据</div>
                        <div className="load-box">
                            上传附件：
                            <Upload {...uploadProps}>
                                <Button icon={<UploadOutlined />}>导入外部数据</Button>
                            </Upload>
                        </div>
                    </div>

                </div>
            </Col>
        </Row>
    )
}

export default LoadData;