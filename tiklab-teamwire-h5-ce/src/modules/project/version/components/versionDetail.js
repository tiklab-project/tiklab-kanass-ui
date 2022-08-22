import React, { useEffect, useState } from "react";
import { NavBar,Card, Picker,Toast,DatePicker } from "antd-mobile";
import { inject,observer } from "mobx-react";
import { withRouter } from "react-router";
import "./versionDetail.scss";
import dayjs from 'dayjs';
const VersionDetail = (props) => {
    const { workItemStore,versionStore } = props;
    const { findVersion, updateVersion } = versionStore;
    const versionId = props.match.params.id;
    const [versionInfo, setVersionInfo] = useState();

    const [visible, setVisible] = useState(false);

    const [planStartPickerVisible, setPlanStartPickerVisible] = useState(false);
    const [planEndPickerVisible, setPlanEndPickerVisible] = useState(false);

    const [updateField, setUpdateField] = useState()

    useEffect(()=> {
        findVersion({id: versionId}).then(res => {
            setVersionInfo(res.data)
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

    const updatePlanBegin = (updateData) => {
        let data = {
            startTime: dayjs(updateData).format('YYYY-MM-DD'),
            id: versionId
        }
        updateVersion(data)
        versionInfo.startTime = dayjs(updateData).format('YYYY-MM-DD')
    
    }

    const showPlanEndPicker = (key) => {
        
        setPlanEndPickerVisible(true)
        setUpdateField(key)
        
    }

    const updatePlanEnd = (updateData) => {
        let data = {
            publishDate: dayjs(updateData).format('YYYY-MM-DD'),
            id: versionId
        }
        updateVersion(data)
        versionInfo.publishDate = dayjs(updateData).format('YYYY-MM-DD')
    }

    const showStatusPicker = (key) => {
        setVisible(true)
        
    }

    const updateStatus = (updateData,extend) => {
        let data = {
            versionState: updateData[0],
            id: versionId
        }
        updateVersion(data)
        versionInfo.versionState = updateData[0]
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
        <div style={{width: "100vw"}}>
            <NavBar
                style={{
                    '--height': '40px',
                    '--border-bottom': '1px #eee solid',
                }}
                backArrow={true}
                onBack={()=> props.history.goBack()}
            >
                <div className="title-top">
                    版本详情
                </div>
            </NavBar>
            <div
                className="version-detail"
                style={{ backgroundColor: "#fff" }}
            >
                <div className="version-info-item">
                    <span>
                        版本名称
                    </span>
                    <span>
                        {versionInfo && versionInfo.name }
                    </span>

                </div>

                <div className="version-info-item">
                    <span>
                        版本状态
                    </span>
                    <span onClick={() => showStatusPicker("versionState")}>
                        {versionInfo && versionInfo.versionState ? statusSet(versionInfo.versionState): "未开始"}
                    </span>
                </div>
                <div className="version-info-item">
                    <span>
                        创建人
                    </span>
                    <span>
                    { versionInfo && versionInfo.master ? versionInfo.master.name : "admin" }
                    </span>
                </div>
                <div className="version-info-item" >
                    <span>
                        开始日期
                    </span>
                    <span onClick={() => showPlanBeginPicker("startTime")}>
                    { versionInfo && versionInfo.startTime ? versionInfo.startTime : "无"}
                    </span>
                </div>
                <div className="version-info-item">
                    <span>
                        发布日期
                    </span>
                    <span onClick={() => showPlanEndPicker("publishDate")}>
                    { versionInfo && versionInfo.publishDate ? versionInfo.publishDate : "无"}
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
export default withRouter(inject("workItemStore", "versionStore")(observer(VersionDetail)));