/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-12-07 14:59:04
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-12-08 09:24:33
 */
import React, { Fragment, useEffect, useState } from "react";
import { observer, inject } from "mobx-react";
import { Select, Modal, message } from "antd";

const VersionChangeModal = props => {
    const {projectId, versionId, visible, setVisible, VersionBasicStore, form, setDisabled, setVersionInfo} = props;
    const { findSelectVersionList, updateVersion } = VersionBasicStore;
    const [selectVersionList, setSelectVersionLis] = useState();
    const [newVersionId, setNewVersionId] = useState()
    useEffect(()=> {
        if(visible){
            const params = {
                currentVersionId: versionId,
                projectId: projectId,
            }
        
            findSelectVersionList(params).then(res => {
                if(res.code  === 0){
                    setSelectVersionLis(res.data)
                }
            })
        }
        
    },[visible])

    const handleOk = () => {
        form.validateFields().then((values) => {
            const time = values["startTime"]
            const data = {
                ...values,
                startTime: time[0].format("YYYY-MM-DD"),
                endTime: time[1].format("YYYY-MM-DD"),
                master: { id: values.master },
                desc: values.desc,
                versionState: {
                    id: values.versionState
                },
                id: versionId,
                newVersionId: newVersionId
            }
            updateVersion(data).then(res => {
                if(res.code === 0){
                    setVersionInfo(data)
                    message.success("修改成功");
                    setDisabled(true);
                    setVisible(false)
                }
            });
        })
    }
    return (
        <Modal
            title="确定删除"
            getContainer={false}
            visible={visible}
            closable={false} 
            onOk={() => handleOk()} 
            onCancel={() => setVisible(false)} 
            okText={"确定"} 
            cancelText={"取消"}
            okButtonProps={{ type: "primary" }}
        >
            <div>将未完成事项移动至</div>
            <Select
                placeholder="版本"
                allowClear
                value={newVersionId}
                onChange = {(value) => {setNewVersionId(value);}}
                style={{
                    width: '100%',
                  }}
            >
                {
                    selectVersionList && selectVersionList.map((item, index) => {
                        return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                    })
                }
                <Select.Option value={null} key={"noVersion"}>不规划新的版本</Select.Option>
            </Select>
        </Modal>
    )
}

export default observer(VersionChangeModal);
