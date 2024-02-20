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
import "./VersionEndState.scss";
import VersionDetailStore from "../../common/store/VersionDetailStore";
import { useTranslation } from "react-i18next";
const { RangePicker } = DatePicker;

const VersionEndState = props => {
    const { projectId, versionId, visible, setVisible, VersionSurveyStore, versionInfo, setVersionInfo } = props;
    const { findSelectVersionList, updateVersion, findVersion } = VersionSurveyStore;
    const {setVersionRouter} = VersionDetailStore;
    const [selectVersionList, setSelectVersionLis] = useState();
    const [newVersionId, setNewVersionId] = useState();
    const { t, i18n } = useTranslation();
    const doneRouter = [
        {
            title: `${t('survey')}`,
            icon: 'survey',
            url: `/${projectId}/versiondetail/${versionId}/survey`,
            key: "survey",
            encoded: "Survey",
        },
        {
            title: "事项",
            icon: 'survey',
            url: `/${projectId}/versiondetail/${versionId}/workTable`,
            key: "work",
            encoded: "work",
        }
    ]

    useEffect(() => {
        if (visible) {
            const params = {
                currentVersionId: versionId,
                projectId: projectId
            }

            findSelectVersionList(params).then(res => {
                if (res.code === 0) {
                    setSelectVersionLis(res.data)
                }
            })

        }

    }, [visible])

    const handleOk = () => {
        const data = {
            versionState: {
                id: "222222"
            },
            id: versionId,
            newVersionId: newVersionId
        }
        updateVersion(data).then(res => {
            if (res.code === 0) {
                findVersion({ versionId: versionId }).then(res => {
                    setVersionInfo(res.data)
                })
                setVersionRouter(doneRouter)
                message.success("修改成功");
                setVisible(false)
            }
        });
    }
    return (
        <Modal
            title="完成版本"
            getContainer={false}
            visible={visible}
            closable={false}
            onOk={() => handleOk()}
            onCancel={() => setVisible(false)}
            okText={"确定"}
            cancelText={"取消"}
            okButtonProps={{ type: "primary" }}
        >
            <div className="version-work-num">
                <div>此版本包含</div>
                <ul>
                    <li>{versionInfo?.workDoneNumber}个已完成事项</li>
                    <li>{versionInfo?.workProgressNumber}个未完成事项</li>
                </ul>


            </div>
            {
                versionInfo?.workProgressNumber > 0 && <>
                    <div style={{lineHeight: "30px"}}>将未完成事项移动至</div>
                    <Select
                        placeholder="版本"
                        allowClear
                        value={newVersionId}
                        onChange={(value) => { setNewVersionId(value);}}
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

                </>
            }

        </Modal>
    )
}

export default observer(VersionEndState);
