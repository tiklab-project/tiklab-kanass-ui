import React, { useEffect, useState } from 'react';
import { Empty, Avatar, Picker, Button, SearchBar } from 'antd-mobile';
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

    const searchWorkItem = (value) => {
        getWorkConditionPage({title: value})
    }
    return (
        <div className="sprint-workItem">
            {/* <div className="sprint-workItem-top">
                <div className="sprint-workItem-top-left" onClick={() => props.history.goBack()}>
                    <svg className="sprint-workItem-icon-logo" aria-hidden="true">
                        <use xlinkHref="#icon-left"></use>
                    </svg>
                </div>
                <div className="sprint-workItem-title">{sprint.sprintName}</div>
                <div></div>
            </div> */}
            <div className='sprint-workItem-search'>
                <SearchBar
                    placeholder='请输入内容'
                    style={{
                        '--border-radius': '100px',
                    }}
                    onChange = {(value) => searchWorkItem(value)}
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
                <div className='sprint-workItem-list'>
                    {
                        workList && workList.length > 0 ? workList.map(item => {
                            return <div className="sprint-workItem-item" key = {item.id}>
                                <div className='sprint-workItem-left'>
                                    <div className='sprint-workItem-icon'>
                                        <Avatar fallback={<AppOutline />} style={{ '--size': '32px' }} />
                                    </div>
                                    <div>
                                        <div className='sprint-workItem-title'  onClick={() => props.history.push(`/workItemDetail/${item.id}`)}>{item.title}</div>
                                        <div onClick={() => props.history.push({ pathname: "/project/projectDetail" })}>
                                            {item.builder ?item.builder.name : "admin"}
                                        </div>
                                    </div>
                                </div>
                                <div className='sprint-workItem-type'>
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
                        :
                        <Empty description='暂无数据' />
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