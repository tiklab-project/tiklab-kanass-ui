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
import StageDetailStore from "../../common/store/StageDetailStore";
import "./StageEndState.scss";
import { useTranslation } from "react-i18next";
const { RangePicker } = DatePicker;

const StageEndState = props => {
    const { projectId, stageId, visible, setVisible, StageSurveyStore, stageInfo, setStageInfo } = props;
    const { findSelectStageList, updateStage, findStage } = StageSurveyStore;
    const { setStageRouter } = StageDetailStore;
    const [selectStageList, setSelectStageLis] = useState();
    const [newStageId, setNewStageId] = useState()
    const { t, i18n } = useTranslation();
    const doneRouter = [
        {
            title: `${t('survey')}`,
            icon: 'survey',
            url: `/${projectId}/stagedetail/${stageId}/overview`,
            key: "survey",
            encoded: "Survey",
        },
        {
            title: "事项",
            icon: 'survey',
            url: `/${projectId}/stagedetail/${stageId}/workitem`,
            key: "work",
            encoded: "work",
        },
        {
            title: "统计",
            icon: 'survey',
            url: `/${projectId}/stagedetail/${stageId}/statistics/workItem`,
            key: "statistics",
            encoded: "statistics",
        }
    ]

    useEffect(() => {
        if (visible) {
            const params = {
                currentStageId: stageId,
                projectId: projectId
            }

            findSelectStageList(params).then(res => {
                if (res.code === 0) {
                    setSelectStageLis(res.data)
                }
            })

        }

    }, [visible])

    const handleOk = () => {
        const data = {
            stageState: {
                id: "222222"
            },
            id: stageId,
            newStageId: newStageId
        }
        updateStage(data).then(res => {
            if (res.code === 0) {
                findStage({ stageId: stageId }).then(res => {
                    setStageInfo(res.data)
                })
                setStageRouter(doneRouter)
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
            <div className="stage-work-num">
                <div>此迭代包含</div>
                <ul>
                    <li>{stageInfo?.workDoneNumber}个已完成事项</li>
                    <li>{stageInfo?.workProgressNumber}个未完成事项</li>
                </ul>


            </div>
            {
                stageInfo?.workProgressNumber > 0 && <>
                    <div style={{lineHeight: "30px"}}>将未完成事项移动至</div>
                    <Select
                        placeholder="迭代"
                        allowClear
                        value={newStageId}
                        onChange={(value) => { setNewStageId(value);}}
                        style={{
                            width: '100%',
                        }}
                    >
                        {
                            selectStageList && selectStageList.map((item, index) => {
                                return <Select.Option value={item.id} key={item.id}>{item.stageName}</Select.Option>
                            })
                        }
                        <Select.Option value={null} key={"noStage"}>不规划新的迭代</Select.Option>
                    </Select>

                </>
            }

        </Modal>
    )
}

export default observer(StageEndState);
