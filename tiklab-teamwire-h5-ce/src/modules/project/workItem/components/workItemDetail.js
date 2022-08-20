import React, { useEffect, useState } from "react";
import { NavBar,Card, Picker,Toast,DatePicker } from "antd-mobile";
import { inject,observer } from "mobx-react";
import { withRouter } from "react-router";
import { DocumentEditor } from "tiklab-slate-h5-ui";
import "./workItemDetail.scss";
import dayjs from 'dayjs';
const WorkItemDetail = (props) => {
    const { workItemStore } = props;
    const { findWorkItem, upload, createWorkAttach, findWorkAttachList,
        editWork, findFlowDef, statesList, getStateList,findAllWorkPriority, workPriorityList } = workItemStore;
    const workItemId = props.match.params.id;
    const [workItemInfo, setWorkItemInfo] = useState();
    const [workAttachList, setWorkAttachList] = useState();
    const [basicColumns, setbasicColumns] = useState([]);

    const [visible, setVisible] = useState(false);
    const [workPriorityVisible, setWorkPriorityVisible] = useState(false);
    const [planStartPickerVisible, setPlanStartPickerVisible] = useState(false);
    const [planEndPickerVisible, setPlanEndPickerVisible] = useState(false);

    const [updateField, setUpdateField] = useState()
    const [slateValue, setSlateValue] = useState([
		{
			type: "paragraph",
			children: [{ text: "" }],
		},
	])

    useEffect(()=> {
        const workItemId = props.match.params.id;
        
        findWorkItem({id: workItemId}).then(res => {
            setWorkItemInfo(res.data)
            findFlowDef({ id: res.data.workType.flow.id }).then(res => {
                console.log(res)
            })
            let params = {
                nodeId: res.data.workStatus.id
            }
            getStateList(params)
            if(res.data.desc){
                setSlateValue(JSON.parse(res.data.desc))
            }
        })
        findWorkAttachList(workItemId).then(res => {
            console.log(workAttachList, res)
            setWorkAttachList(res)
        })
        
    },[])

    const handleUpload = (e) => {
        e.preventDefault();

        let file = e.target.files[0];
        upload(file).then(res => {
            if(res.code === 0){
                
				const fileName = res.data.fileName;
                const params = {workId: workItemId, fileName: fileName}
                createWorkAttach(params).then(res => {
                    if(res.code === 0)
                    console.log(res)
                    findWorkAttachList(workItemId).then(res=> {
                        setWorkAttachList(res)
                    })
                })
			}
        })
    };

    const [editorType, setEditorType] = useState(false);
    const [slateButton, setSlateButton] = useState("编辑");

    const editorDesc = () => {
        if(editorType){
            setEditorType(false);
            setSlateButton("编辑");
            let data = {
                id: workItemId,
                desc: JSON.stringify(slateValue),
                updateField: "desc"
            }
            editWork(data)
        }else {
            setEditorType(true);
            setSlateButton("保存");
            
        }
    }

    const showPriorityPicker = (key) => {
        findAllWorkPriority()
        setWorkPriorityVisible(true)
        setUpdateField(key)
        
    }

    const updatePriority = (updateData,extend) => {
        let data = {
            [updateField]: updateData[0],
            id: workItemId,
            updateField: updateField
        }
        editWork(data)
        workItemInfo.workPriority = {name: extend.items[0].label}
    }

    const showPlanBeginPicker = (key) => {
        setPlanStartPickerVisible(true)
        setUpdateField(key)
        
    }

    const updatePlanBegin = (updateData) => {
        let data = {
            planBeginTime: dayjs(updateData).format('YYYY-MM-DD HH:mm:ss'),
            id: workItemId,
            updateField: updateField
        }
        editWork(data)
        workItemInfo.planBeginTime = dayjs(updateData).format('YYYY-MM-DD HH:mm:ss')
    
    }

    const showPlanEndPicker = (key) => {
        
        setPlanEndPickerVisible(true)
        setUpdateField(key)
        
    }

    const updatePlanEnd = (updateData) => {
        let data = {
            planEndTime: dayjs(updateData).format('YYYY-MM-DD HH:mm:ss'),
            id: workItemId,
            updateField: updateField
        }
        editWork(data)
        workItemInfo.planEndTime = dayjs(updateData).format('YYYY-MM-DD HH:mm:ss')
    }

    const showStatusPicker = (key) => {
        if(statesList){
            setbasicColumns([statesList])
        }else {
            Toast.show({
                content: '已经是最后一个状态'
            })
            return
        }
        
        setVisible(true)
        setUpdateField(key)
        
    }

    const updateStatus = (updateData,extend) => {
        let data = {
            [updateField]: updateData[0],
            id: workItemId,
            updateField: updateField
        }
        editWork(data)
        workItemInfo.workStatus.name = extend.items[0].label
    }

    return (
        <div style={{width: "100vw"}}>
            <NavBar
                style={{
                    '--height': '36px',
                    '--border-bottom': '1px #eee solid',
                }}
                backArrow={true}
                onBack={()=> props.history.goBack()}
            >
                <div className="title-top">
                    事项详情
                </div>
            </NavBar>
            <Card
                headerStyle={{
                    color: '#1677ff',
                }}
                title={workItemInfo && workItemInfo.title }
                style={{ backgroundColor: "#fff" }}
            >
                <div className="workItem-info-item">
                    <span>
                        事项名称
                    </span>
                    <span>
                        {workItemInfo && workItemInfo.title }
                    </span>

                </div>
                <div className="workItem-info-item">
                    <span>
                        事件类型
                    </span>
                    <span>
                        {workItemInfo && workItemInfo.workType.name }
                    </span>

                </div>

                <div className="workItem-info-item">
                    <span>
                        事件状态
                    </span>
                    <span onClick={() => showStatusPicker("workStatus")}>
                        {workItemInfo && workItemInfo.workStatus ?  workItemInfo.workStatus.name : "未开始"}
                    </span>

                </div>

                <div className="workItem-info-item">
                    <span>
                        优先级
                    </span>
                    <span onClick={() => showPriorityPicker ("workPriority")}>
                        {workItemInfo && workItemInfo.workPriority ? workItemInfo.workPriority.name : "无" }
                    </span>

                </div>
                <div className="workItem-info-item">
                    <span>
                        创建人
                    </span>
                    <span>
                    { workItemInfo && workItemInfo.builder ? workItemInfo.builder.name : "admin" }
                    </span>
                </div>
                <div className="workItem-info-item">
                    <span>
                        报告人
                    </span>
                    <span>
                    { workItemInfo && workItemInfo.reporter ? workItemInfo.reporter.name : "admin" }
                    </span>
                </div>
                <div className="workItem-info-item">
                    <span>
                        负责人
                    </span>
                    <span>
                    { workItemInfo && workItemInfo.master ? workItemInfo.master.name : "admin" }
                    </span>
                </div>
                <div className="workItem-info-item">
                    <span>
                        创建时间
                    </span>
                    <span>
                    { workItemInfo && workItemInfo.buildTime }
                    </span>
                </div>
                <div className="workItem-info-item" >
                    <span>
                        计划开始日期
                    </span>
                    <span onClick={() => showPlanBeginPicker("planBeginTime")}>
                    {/* {workItem && workItem.quantityNumber} */}
                    { workItemInfo && workItemInfo.planBeginTime }
                    </span>
                </div>
                <div className="workItem-info-item">
                    <span>
                        计划结束日期
                    </span>
                    <span onClick={() => showPlanEndPicker("planEndTime")}>
                    { workItemInfo && workItemInfo.planEndTime }
                    </span>
                </div>
                <div className='upload'>
                    <div className="uplpad-list">
                        <div style={{fontWeight: "500"}}>上传文件</div>
                        <div className="upload-icon">
                            <input type="file" onChange={handleUpload} className= "upload-file"/>
                            <span>
                                <svg aria-hidden="true" style={{width: "100%", height: "100%"}}>
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
                </div>
                <span>
                    <DocumentEditor value = {slateValue} onChange = {setSlateValue} showMenu = {editorType} {...props}/>
                </span>
            </Card>
            <Picker
                columns={basicColumns}
                visible={visible}
                onClose={() => {
                    setVisible(false)
                }}
                // value={value}
                onConfirm={(value,extend) => updateStatus(value,extend)}
            />
            <Picker
                columns={[workPriorityList]}
                visible={workPriorityVisible}
                onClose={() => {
                    setWorkPriorityVisible(false)
                }}
                // value={value}
                onConfirm={(value,extend) => updatePriority(value,extend)}
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
export default withRouter(inject("workItemStore")(observer(WorkItemDetail)));