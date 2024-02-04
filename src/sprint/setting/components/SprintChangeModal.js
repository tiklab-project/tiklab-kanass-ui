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
import { Select, Modal } from "antd";

const SprintChangeModal = props => {
    const {projectId, sprintId, visible, setVisible, SprintBasicStore, form} = props;
    const { findSelectSprintList } = SprintBasicStore;
    const [selectSprintList, setSelectSprintLis] = useState()
    useEffect(()=> {
        if(visible){
            const params = {
                currentSprintId: sprintId,
                projectId: projectId,
    
            }
        
            findSelectSprintList(params).then(res => {
                if(res.code  === 0){
                    setSelectSprintLis(res.data)
                }
            })
        }
        
    },[visible])

    const handleOk = () => {
        console.log("sss")
        form.validateFields().then((values) => {
            console.log(values)
            const time = values["startTime"]
            const data = {
                ...values,
                startTime: time[0].format("YYYY-MM-DD"),
                endTime: time[1].format("YYYY-MM-DD"),
                master: { id: values.master },
                desc: values.desc,
                sprintState: {
                    id: values.sprintState
                },
                id: sprintId
            }
            updateSprint(data).then(res => {
                if(res.code === 0){
                    message.success("修改成功");
                    setDisabled(true);
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
                placeholder="迭代"
                allowClear
                style={{
                    width: '100%',
                  }}
            >
                {
                    selectSprintList && selectSprintList.map((item, index) => {
                        return <Select.Option value={item.id} key={item.id}>{item.sprintName}</Select.Option>
                    })
                }
                <Select.Option value={"noSprint"} key={"noSprint"}>不规划新的迭代</Select.Option>
            </Select>
        </Modal>
    )
}

export default observer(SprintChangeModal);
