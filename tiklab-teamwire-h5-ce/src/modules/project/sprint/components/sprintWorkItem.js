import React, { useEffect, useState } from 'react';
import { NavBar, Avatar, Picker, Button, SearchBar } from 'antd-mobile';
import { AppOutline, EyeOutline } from 'antd-mobile-icons'
import { withRouter } from 'react-router';
import { inject, observer } from 'mobx-react';
import "./sprintWorkItem.scss";

const SprintWorkItem = (props) => {
    const [sprint, setSprint] = useState(JSON.parse(localStorage.getItem("sprint")));
    const { workItemStore, sprintStore } = props;
    const { getWorkConditionPage,workList, findSprintList, sprintList, } = workItemStore;
    const { findSprint } = sprintStore;
    const [sprintVisible, setSprintVisible] = useState(false);
    const projectId =  localStorage.getItem("projectId");
    useEffect(() => {
        const data = {
            projectId: projectId,
            sprintId: sprint.id
        }
        getWorkConditionPage(data)
        findSprintList({projectId: projectId})
    },[sprint])

    const showSprintPicker = () => {
        setSprintVisible(true)
    }

    const back = () => {
        window.history.back(-1);
    }

    const changeSprint = (updateData,extend) => {
        
        findSprint({id: updateData[0]}).then(res => {
            localStorage.setItem("sprint", JSON.stringify(res.data))
            setSprint(res.data)
        })
        
    }

    const right = (
        <div style={{ fontSize: "13px"}} onClick = {() => goEditSprint()}>
            编辑
        </div>
    )
    
    const goEditSprint = () => {
        props.history.push(`/sprintDetail/${sprint.id}`)
    }
    return (
        <div>
            <NavBar
                style={{
                    '--height': '40px',
                    '--border-bottom': '1px #eee solid',
                }}
                backArrow={true}
                right={right}
                onBack={back}
            >
                <div 
                    className="project-detail-top" 
                    style={{fontSize: "15px"}}
                    onClick = {() => showSprintPicker()}
                >
                    {sprint.sprintName}
                </div>
            </NavBar>
            <div className='sprintWorkItem-search'>
                <SearchBar
                    placeholder='请输入内容'
                    style={{
                        '--border-radius': '100px',
                    }}
                />
                <Button
                    size='mini'
                    color='primary'
                    onClick={() => {
                        props.history.push(`/sprintWorkItemAdd/${sprint.id}`)
                    }}
                >
                    添加事项
                </Button>
            </div>
            <div>
                <div className='sprint-workItem'>
                    {
                        workList && workList.length > 0 && workList.map(item => {
                            return <div className="sprintWorkItem-list" key = {item.id}>
                                <div className='sprintWorkItem-left'>
                                    <div className='sprintWorkItem-icon'>
                                        <Avatar fallback={<AppOutline />} style={{ '--size': '32px' }} />
                                    </div>
                                    <div>
                                        <div className='sprintWorkItem-title'  onClick={() => props.history.push(`/workItemDetail/${item.id}`)}>{item.title}</div>
                                        <div onClick={() => props.history.push({ pathname: "/project/projectDetail" })}>
                                            {item.builder ?item.builder.name : "admin"}
                                        </div>
                                    </div>
                                </div>
                                <div className='sprintWorkItem-type'>
                                    {item.workType.name}
                                </div>
                                <div>
                                    未开始
                                </div>
                                <div>
                                    <EyeOutline />
                                </div>
                            </div>
                        })
                    }
                </div>
            </div>
            <Picker
                style={{
                    '--title-font-size': '13px',
                    '--header-button-font-size': '13px',
                    '--item-font-size': '13px',
                    '--item-height': '30px',
                }}
                columns={[sprintList]}
                visible={sprintVisible}
                onClose={() => {
                    setSprintVisible(false)
                }}
                onConfirm={(value,extend) => changeSprint(value,extend)}
            />
        </div>
    )
}
export default withRouter(inject("workItemStore", "sprintStore")(observer(SprintWorkItem)));