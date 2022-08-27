import React, { useEffect, useState } from "react";
import { NavBar, Card, Picker, Toast, DatePicker } from "antd-mobile";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router";
import "./milestoneDetail.scss";
import dayjs from 'dayjs';
const MilestoneDetail = (props) => {
    const { milestoneStore } = props;
    const { findMilestone, updateMilestone } = milestoneStore;
    const milestoneId = props.match.params.id;
    const [milestoneInfo, setMilestoneInfo] = useState();

    const [visible, setVisible] = useState(false);

    const [milestoneTimePickerVisible, setMilestoneTimePickerVisible] = useState(false);

    const [updateField, setUpdateField] = useState()

    useEffect(() => {
        findMilestone({ id: milestoneId }).then(res => {
            setMilestoneInfo(res.data)
        })

    }, [])



    // 状态类型
    const status = [
        [{
            label: "未开始",
            value: "0"
        },
        {
            label: "进行中",
            value: "1"
        },
        {
            label: "已结束",
            value: "2"
        }]
    ]
    const showMilestoneTimePicker = (key) => {
        setMilestoneTimePickerVisible(true)
        setUpdateField(key)
    }

    const updateMilestoneTime = (updateData) => {
        let data = {
            milestoneTime: dayjs(updateData).format('YYYY-MM-DD'),
            id: milestoneId
        }
        updateMilestone(data)
        milestoneInfo.milestoneTime = dayjs(updateData).format('YYYY-MM-DD')

    }


    const showStatusPicker = (key) => {
        setVisible(true)
        
    }

    const updateStatus = (updateData, extend) => {
        let data = {
            milestoneState: updateData[0],
            id: milestoneId
        }
        updateMilestone(data)
        milestoneInfo.milestoneState = updateData[0]
    }

    const statusSet = (value) => {
        let data = ""
        switch (value) {
            case "0":
                data = "未开始";
                break;
            case "1":
                data = "进行中";
                break;
            case "2":
                data = "已结束";
                break;
            default:
                data = "未知";
                break;

        }
        return data;
    }

    return (
        <div style={{ width: "100vw" }}>
            <div className="milestone-top">
                <div className="milestone-top-left" onClick={() => props.history.goBack()}>
                    <svg className="milestone-icon-logo" aria-hidden="true">
                        <use xlinkHref="#icon-left"></use>
                    </svg>
                </div>
                <div className="milestone-title">{milestoneInfo && milestoneInfo.name}</div>
                <div style={{width: "30px"}}></div>
            </div>
            <div
                className="milestone-detail"
                style={{ backgroundColor: "#fff" }}
            >
                <div className="milestone-info-item">
                    <span>
                        里程碑名称
                    </span>
                    <span>
                        {milestoneInfo && milestoneInfo.name}
                    </span>

                </div>

                <div className="milestone-info-item">
                    <span>
                        里程碑状态
                    </span>
                    <span onClick={() => showStatusPicker("milestoneState")}>
                        {milestoneInfo && milestoneInfo.milestoneState ? statusSet(milestoneInfo.milestoneState) : "未开始"}
                    </span>
                </div>
                <div className="milestone-info-item">
                    <span>
                        创建人
                    </span>
                    <span>
                        {milestoneInfo && milestoneInfo.master ? milestoneInfo.master.name : "admin"}
                    </span>
                </div>
                <div className="milestone-info-item" >
                    <span>
                        开始日期
                    </span>
                    <span onClick={() => showMilestoneTimePicker("milestoneTime")}>
                        {milestoneInfo && milestoneInfo.milestoneTime ? milestoneInfo.milestoneTime : "无"}
                    </span>
                </div>
            </div>
            <Picker
                columns={status}
                visible={visible}
                onClose={() => {
                    setVisible(false)
                }}
                // value={value}
                onConfirm={(value, extend) => updateStatus(value, extend)}
            />
            <DatePicker
                visible={milestoneTimePickerVisible}
                precision='second'
                onClose={() => {
                    setMilestoneTimePickerVisible(false)
                }}
                onConfirm={(value, extend) => updateMilestoneTime(value)}
            >
            </DatePicker>
        </div>
    )
}
export default withRouter(inject("milestoneStore")(observer(MilestoneDetail)));