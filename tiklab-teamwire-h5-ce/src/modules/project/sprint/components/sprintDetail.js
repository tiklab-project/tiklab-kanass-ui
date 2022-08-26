import React, { useEffect, useState } from "react";
import { NavBar,Card, Picker,Toast,DatePicker } from "antd-mobile";
import { inject,observer } from "mobx-react";
import { withRouter } from "react-router";
import "./sprintDetail.scss";
import dayjs from 'dayjs';
const SprintDetail = (props) => {
    const { workItemStore,sprintStore } = props;
    const { findWorkItem, findWorkAttachList, editWork,statesList, workPriorityList } = workItemStore;
    const { findSprint, updateSprint } = sprintStore;
    const sprintId = props.match.params.id;
    const [sprintInfo, setSprintInfo] = useState();
    const [basicColumns, setbasicColumns] = useState([]);

    const [visible, setVisible] = useState(false);
    const [workPriorityVisible, setWorkPriorityVisible] = useState(false);
    const [planStartPickerVisible, setPlanStartPickerVisible] = useState(false);
    const [planEndPickerVisible, setPlanEndPickerVisible] = useState(false);

    const [updateField, setUpdateField] = useState()

    useEffect(()=> {
        
        findSprint({id: sprintId}).then(res => {
            setSprintInfo(res.data)
        })
        
    },[])

    const showPlanBeginPicker = (key) => {
        setPlanStartPickerVisible(true)
        setUpdateField(key)
    }

      // 状态类型
      const status = [
        [{
            label: "未开始",
            value: "000000"
        },
        {
            label: "进行中",
            value: "111111"
        },
        {
            label: "已结束",
            value: "222222"
        }]
    ]

    const updatePlanBegin = (updateData) => {
        let data = {
            startTime: dayjs(updateData).format('YYYY-MM-DD'),
            id: sprintId
        }
        updateSprint(data)
        sprintInfo.startTime = dayjs(updateData).format('YYYY-MM-DD')
    
    }

    const showPlanEndPicker = (key) => {
        
        setPlanEndPickerVisible(true)
        setUpdateField(key)
        
    }

    const updatePlanEnd = (updateData) => {
        let data = {
            endTime: dayjs(updateData).format('YYYY-MM-DD'),
            id: sprintId
        }
        updateSprint(data)
        sprintInfo.endTime = dayjs(updateData).format('YYYY-MM-DD')
    }

    const showStatusPicker = (key) => {
        setVisible(true)
        
    }

    const updateStatus = (updateData,extend) => {
        let data = {
            sprintState: {id: updateData[0]},
            id: sprintId
        }
        updateSprint(data)
        sprintInfo.sprintState.name = extend.items[0].label
    }

    return (
        <div style={{width: "100vw"}} className="sprint">
            <div className="sprint-detail-top">
                <div className="sprint-detail-top-left" onClick={() => props.history.goBack()}>
                    <svg className="sprint-detail-icon-logo" aria-hidden="true">
                        <use xlinkHref="#icon-left"></use>
                    </svg>
                </div>
                <div className="sprint-detail-title"></div>
                <div></div>
            </div>
            <div
                className="sprint-detail"
                style={{ backgroundColor: "#fff" }}
            >
                <div className="sprint-info-item">
                    <span>
                        迭代名称
                    </span>
                    <span>
                        {sprintInfo && sprintInfo.sprintName }
                    </span>

                </div>

                <div className="sprint-info-item">
                    <span>
                        迭代状态
                    </span>
                    <span onClick={() => showStatusPicker("sprintState")}>
                        {sprintInfo && sprintInfo.sprintState ?  sprintInfo.sprintState.name : "未开始"}
                    </span>
                </div>
                <div className="sprint-info-item">
                    <span>
                        创建人
                    </span>
                    <span>
                    { sprintInfo && sprintInfo.master ? sprintInfo.master.name : "admin" }
                    </span>
                </div>
                <div className="sprint-info-item" >
                    <span>
                        开始日期
                    </span>
                    <span onClick={() => showPlanBeginPicker("startTime")}>
                    { sprintInfo && sprintInfo.startTime ? sprintInfo.startTime : "无"}
                    </span>
                </div>
                <div className="sprint-info-item">
                    <span>
                        结束日期
                    </span>
                    <span onClick={() => showPlanEndPicker("endTime")}>
                    { sprintInfo && sprintInfo.endTime ? sprintInfo.endTime : "无"}
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
                onConfirm={(value,extend) => updateStatus(value,extend)}
            />
             <DatePicker
                visible={planStartPickerVisible}
                precision = 'second'
                onClose={() => {
                    setPlanStartPickerVisible(false)
                }}
                onConfirm={(value,extend) => updatePlanBegin(value)}
            >
            </DatePicker>
            <DatePicker
                visible={planEndPickerVisible}
                precision = 'second'
                onClose={() => {
                    setPlanEndPickerVisible(false)
                }}
                onConfirm={(value,extend) => updatePlanEnd(value)}
            >
            </DatePicker>
        </div>
    )
}
export default withRouter(inject("workItemStore", "sprintStore")(observer(SprintDetail)));