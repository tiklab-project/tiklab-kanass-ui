import React, { useEffect, useState } from "react";
import { NavBar, Card, Picker, Toast, DatePicker, Tabs } from "antd-mobile";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router";
import { DocumentEditor } from "tiklab-slate-h5-ui";
import WorkLog from "./workLog";
import WorkRelation from "./workRelation";
import WorkChild from "./workChild";
import WorkComment from "./workComment";
import WorkWiki from "./workWiki";
import WorkItemDynamic from "./workItemDynamic"
import "./workItemDetail.scss";
import dayjs from 'dayjs';
const WorkItemDetail = (props) => {
    const { workItemStore } = props;
    const { findWorkItem, upload, createWorkAttach, findWorkAttachList,
        editWork, findFlowDef, statesList, getStateList, findAllWorkPriority,
        workPriorityList, setSlateValue, activeIndex, setActiveIndex, findWorkTypeListByCode } = workItemStore;
    const workItemId = props.match.params.id;
    const [workItemInfo, setWorkItemInfo] = useState();
    const [workAttachList, setWorkAttachList] = useState();
    const [basicColumns, setbasicColumns] = useState([]);

    const [visible, setVisible] = useState(false);
    const [workPriorityVisible, setWorkPriorityVisible] = useState(false);
    const [planStartPickerVisible, setPlanStartPickerVisible] = useState(false);
    const [planEndPickerVisible, setPlanEndPickerVisible] = useState(false);
    const [workTask, setWorkTask] = useState()

    const [updateField, setUpdateField] = useState()
    const [slateValue, setSlateLocalValue] = useState([
        {
            type: "paragraph",
            children: [{ text: "" }],
        },
    ])

    useEffect(() => {
        const workItemId = props.match.params.id;

        findWorkItem({ id: workItemId }).then(res => {
            if (res.code === 0) {
                setWorkItemInfo(res.data)
                findFlowDef({ id: res.data.workType.flow.id }).then(res => {
                    console.log(res)
                })
                let params = {
                    nodeId: res.data.workStatus.id
                }
                getStateList(params)
                if (res.data.desc) {
                    setSlateLocalValue(JSON.parse(res.data.desc))
                }
                if (res.data.workType.code === "demand") {
                    findWorkTypeListByCode({ code: "task" }).then(res => {
                        if (res.code === 0) {
                            let id = res.data[0].id;
                            setWorkTask(res.data[0])
                        }
                    })
                }

            }

        })
        findWorkAttachList(workItemId).then(res => {
            console.log(workAttachList, res)
            setWorkAttachList(res)
        })

    }, [])

    const handleUpload = (e) => {
        e.preventDefault();

        let file = e.target.files[0];
        upload(file).then(res => {
            if (res.code === 0) {

                const fileName = res.data.fileName;
                const params = { workId: workItemId, fileName: fileName }
                createWorkAttach(params).then(res => {
                    if (res.code === 0)
                        console.log(res)
                    findWorkAttachList(workItemId).then(res => {
                        setWorkAttachList(res)
                    })
                })
            }
        })
    };

    const [editorType, setEditorType] = useState(false);
    const [slateButton, setSlateButton] = useState("编辑");

    const editorDesc = () => {
        if (editorType) {
            setEditorType(false);
            setSlateButton("编辑");
            let data = {
                id: workItemId,
                desc: JSON.stringify(slateValue),
                updateField: "desc"
            }
            editWork(data)
        } else {
            setEditorType(true);
            setSlateButton("保存");

        }
    }

    const showPriorityPicker = (key) => {
        findAllWorkPriority()
        setWorkPriorityVisible(true)
        setUpdateField(key)

    }

    const updatePriority = (updateData, extend) => {
        let data = {
            [updateField]: updateData[0],
            id: workItemId,
            updateField: updateField
        }
        editWork(data)
        workItemInfo.workPriority = { name: extend.items[0].label }
    }

    const showPlanBeginPicker = (key) => {
        setPlanStartPickerVisible(true)
        setUpdateField(key)

    }

    const updatePlanBegin = (updateData) => {
        let data = {
            planBeginTime: dayjs(updateData).format('YYYY-MM-DD'),
            id: workItemId,
            updateField: updateField
        }
        editWork(data)
        workItemInfo.planBeginTime = dayjs(updateData).format('YYYY-MM-DD')

    }

    const showPlanEndPicker = (key) => {

        setPlanEndPickerVisible(true)
        setUpdateField(key)

    }

    const updatePlanEnd = (updateData) => {
        let data = {
            planEndTime: dayjs(updateData).format('YYYY-MM-DD'),
            id: workItemId,
            updateField: updateField
        }
        editWork(data)
        workItemInfo.planEndTime = dayjs(updateData).format('YYYY-MM-DD')
    }

    const showStatusPicker = (key) => {
        if (statesList) {
            setbasicColumns([statesList])
        } else {
            Toast.show({
                content: '已经是最后一个状态'
            })
            return
        }

        setVisible(true)
        setUpdateField(key)

    }

    const updateStatus = (updateData, extend) => {
        let data = {
            [updateField]: updateData[0],
            id: workItemId,
            updateField: updateField
        }
        editWork(data)
        workItemInfo.workStatus.name = extend.items[0].label
    }

    const goDesc = () => {
        props.history.push(`/workItemEditDesc/${workItemInfo.id}`)
        setSlateValue(slateValue)
    }
    return (
        <div style={{ width: "100vw" }} className="workItem-detail">
            <div className="workItem-detail-top">
                <div className="workItem-detail-top-left" onClick={() => props.history.goBack()}>
                    <svg className="workItem-detail-icon-logo" aria-hidden="true">
                        <use xlinkHref="#icon-left"></use>
                    </svg>
                </div>
                <div className="workItem-detail-title"> {workItemInfo && workItemInfo.title}</div>
                <div></div>
            </div>
            <Tabs
                style={{ "--content-padding": 0 }}
                activeKey={activeIndex}
                onChange={key => setActiveIndex(key)}
            >
                <Tabs.Tab title='概况' key='workDetail'>
                    <Card
                        headerStyle={{
                            color: '#1677ff',
                        }}
                        title={workItemInfo && workItemInfo.title}
                        style={{ backgroundColor: "#fff" }}
                    >
                        <div className="workItem-info-item">
                            <span>
                                事项名称
                            </span>
                            <span>
                                {workItemInfo && workItemInfo.title}
                            </span>

                        </div>
                        <div className="workItem-info-item">
                            <span>
                                事件类型
                            </span>
                            <span>
                                {workItemInfo && workItemInfo.workType.name}
                            </span>

                        </div>

                        <div className="workItem-info-item">
                            <span>
                                事件状态
                            </span>
                            <span onClick={() => showStatusPicker("workStatus")}>
                                {workItemInfo && workItemInfo.workStatus ? workItemInfo.workStatus.name : "未开始"}
                            </span>

                        </div>

                        <div className="workItem-info-item">
                            <span>
                                优先级
                            </span>
                            <span onClick={() => showPriorityPicker("workPriority")}>
                                {workItemInfo && workItemInfo.workPriority ? workItemInfo.workPriority.name : "无"}
                            </span>

                        </div>
                        <div className="workItem-info-item">
                            <span>
                                创建人
                            </span>
                            <span>
                                {workItemInfo && workItemInfo.builder ? workItemInfo.builder.name : "admin"}
                            </span>
                        </div>
                        <div className="workItem-info-item">
                            <span>
                                报告人
                            </span>
                            <span>
                                {workItemInfo && workItemInfo.reporter ? workItemInfo.reporter.name : "admin"}
                            </span>
                        </div>
                        <div className="workItem-info-item">
                            <span>
                                负责人
                            </span>
                            <span>
                                {workItemInfo && workItemInfo.master ? workItemInfo.master.name : "admin"}
                            </span>
                        </div>
                        <div className="workItem-info-item">
                            <span>
                                创建时间
                            </span>
                            <span>
                                {workItemInfo && workItemInfo.buildTime}
                            </span>
                        </div>
                        <div className="workItem-info-item" >
                            <span>
                                计划开始日期
                            </span>
                            <span onClick={() => showPlanBeginPicker("planBeginTime")}>
                                {/* {workItem && workItem.quantityNumber} */}
                                {workItemInfo && workItemInfo.planBeginTime}
                            </span>
                        </div>
                        <div className="workItem-info-item">
                            <span>
                                计划结束日期
                            </span>
                            <span onClick={() => showPlanEndPicker("planEndTime")}>
                                {workItemInfo && workItemInfo.planEndTime}
                            </span>
                        </div>
                        <div className='upload'>
                            <div className="uplpad-list">
                                <div style={{ fontWeight: "500" }}>上传文件</div>
                                <div className="upload-icon">
                                    <input type="file" onChange={handleUpload} className="upload-file" />
                                    <span>
                                        <svg aria-hidden="true" style={{ width: "100%", height: "100%" }}>
                                            <use xlinkHref="#icon-shangchuanwenjian"></use>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                            {
                                workAttachList && workAttachList.map(item => {
                                    return <div className="workAttach-list-item">
                                        <div>
                                            {item.attachment.fileName}
                                        </div>
                                        <div>
                                            <a href={`${base_url}file/${item.attachment.fileName}`}>
                                                下载
                                            </a>
                                        </div>


                                    </div>
                                })
                            }
                        </div>
                        <div className="workItem-info-item">
                            <span>
                                描述
                            </span>
                            <span onClick={() => goDesc()}>
                                编辑
                            </span>
                        </div>
                        <span>
                            <DocumentEditor value={slateValue} onChange={setSlateLocalValue} showMenu={editorType} {...props} />
                        </span>
                    </Card>
                </Tabs.Tab>
                {
                    workItemInfo && <Tabs.Tab title={`子${workItemInfo.workType.name}`} key='childWorkItem'>
                        <WorkChild workType={workItemInfo.workType} />
                    </Tabs.Tab>
                
                }
                {
                    workItemInfo && workTask && workItemInfo.workType.code === "demand" && <Tabs.Tab title='子任务' key='childTaskWorkItem'>
                        <WorkChild workType={workTask} />
                    </Tabs.Tab>
                }
                <Tabs.Tab title='日志' key='workItem'>
                    {workItemInfo && <WorkLog workType={workItemInfo.workType} />}
                </Tabs.Tab>
                <Tabs.Tab title='关联事项' key='relation'>
                    <WorkRelation />
                </Tabs.Tab>
                <Tabs.Tab title='评论' key='comment'>
                    <WorkComment />
                </Tabs.Tab>
                <Tabs.Tab title='知识库' key='wiki'>
                    <WorkWiki />
                </Tabs.Tab>
                <Tabs.Tab title='动态' key='dynamic'>
                    <WorkItemDynamic />
                </Tabs.Tab>
            </Tabs>

            <Picker
                columns={basicColumns}
                visible={visible}
                onClose={() => {
                    setVisible(false)
                }}
                // value={value}
                onConfirm={(value, extend) => updateStatus(value, extend)}
            />
            <Picker
                columns={[workPriorityList]}
                visible={workPriorityVisible}
                onClose={() => {
                    setWorkPriorityVisible(false)
                }}
                onConfirm={(value, extend) => updatePriority(value, extend)}
            />
            <DatePicker
                visible={planStartPickerVisible}
                precision='day'
                onClose={() => {
                    setPlanStartPickerVisible(false)
                }}
                onConfirm={(value, extend) => updatePlanBegin(value)}
            >
            </DatePicker>
            <DatePicker
                visible={planEndPickerVisible}
                precision='day'
                onClose={() => {
                    setPlanEndPickerVisible(false)
                }}
                onConfirm={(value, extend) => updatePlanEnd(value)}
            >
            </DatePicker>
        </div>
    )
}
export default withRouter(inject("workItemStore")(observer(WorkItemDetail)));