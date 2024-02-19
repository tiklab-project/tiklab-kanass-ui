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
import { Select, Modal, message, DatePicker } from "antd";
import "./SprintEndState.scss";
const { RangePicker } = DatePicker;

const SprintEndState = props => {
    const { projectId, sprintId, visible, setVisible, SprintSurveyStore, sprintInfo, setSprintInfo } = props;
    const { findSelectSprintList, updateSprint, findSprint } = SprintSurveyStore;
    const [selectSprintList, setSelectSprintLis] = useState();
    const [newSprintId, setNewSprintId] = useState()
    useEffect(() => {
        if (visible) {
            const params = {
                currentSprintId: sprintId,
                projectId: projectId
            }

            findSelectSprintList(params).then(res => {
                if (res.code === 0) {
                    setSelectSprintLis(res.data)
                }
            })

        }

    }, [visible])

    const handleOk = () => {
        console.log("sss")
        // form.validateFields().then((values) => {
        //     console.log(values)
           
        // })
        const data = {
            sprintState: {
                id: "222222"
            },
            id: sprintId,
            newSprintId: newSprintId
        }
        updateSprint(data).then(res => {
            if (res.code === 0) {
                findSprint({ sprintId: sprintId }).then(res => {
                    setSprintInfo(res.data)
                })
                message.success("修改成功");
                setVisible(false)
            }
        });
    }
    return (
        <Modal
            title="完成迭代"
            getContainer={false}
            visible={visible}
            closable={false}
            onOk={() => handleOk()}
            onCancel={() => setVisible(false)}
            okText={"确定"}
            cancelText={"取消"}
            okButtonProps={{ type: "primary" }}
        >
            <div className="sprint-work-num">
                <div>此迭代包含</div>
                <ul>
                    <li>{sprintInfo?.workDoneNumber}个已完成事项</li>
                    <li>{sprintInfo?.workProgressNumber}个未完成事项</li>
                </ul>


            </div>
            {
                sprintInfo?.workProgressNumber > 0 && <>
                    <div style={{lineHeight: "30px"}}>将未完成事项移动至</div>
                    <Select
                        placeholder="迭代"
                        allowClear
                        value={newSprintId}
                        onChange={(value) => { setNewSprintId(value); console.log(value) }}
                        style={{
                            width: '100%',
                        }}
                    >
                        {
                            selectSprintList && selectSprintList.map((item, index) => {
                                return <Select.Option value={item.id} key={item.id}>{item.sprintName}</Select.Option>
                            })
                        }
                        <Select.Option value={null} key={"noSprint"}>不规划新的迭代</Select.Option>
                    </Select>

                </>
            }

        </Modal>
    )
}

export default observer(SprintEndState);
