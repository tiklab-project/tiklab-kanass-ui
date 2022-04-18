/*
 * @Descripttion: 首页
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-19 09:05:59
 */
import React,{Fragment, useEffect, useState} from 'react';
import { Row, Col } from 'antd';
import {observer, inject} from "mobx-react";
import {getUser,getDomainTenant} from 'doublekit-core-ui';
import "./homePage.scss";

const Home = (props) =>{
    const {homeStore,workStore} = props
    const {statProjectWorkItem,statWorkItemByBusStatus,manageSprint,findWorkStatusListBySorts} = homeStore;
    const {setSearchCondition,setSearchConditionNull} = workStore;

    const userId = getUser().userId;
    const [projectList,setProjectList] = useState();
    const [workStatusList,setWorkStatusList] = useState();
    const [sprintList,setSprintList] = useState();
    const tenant = getDomainTenant();
    useEffect(()=> {
        statProjectWorkItem(userId).then((res)=> {
            setProjectList(res.data)
        });
        statWorkItemByBusStatus(userId).then((res)=> {
            setWorkStatusList(res.data)
        })
        manageSprint(userId).then((res)=> {
            setSprintList(res.data)
        })
        return;
    },[])

    const goProdetail = (id,projectTypeId) => {
        localStorage.setItem("projectId", id);
        localStorage.setItem("projectTypeId", projectTypeId);
        workStore.setWorkId("")
        props.history.push({ pathname: "/index/prodetail/survey" })
    };

    const goSprintdetail = (projectId,projectTypeId,sprintId) => {
        localStorage.setItem("projectId", projectId);
        localStorage.setItem("projectTypeId", projectTypeId);
        localStorage.setItem("sprintId", sprintId);
        workStore.setWorkId("")
        props.history.push({ pathname: "/index/prodetail/sprintdetail" })
    };

    const goWorkItemList =(index)=> {
        switch (index){
            case 0:
                fileterAllWork()
                break;
            case 1:
                filterWorkByType([3])
                break;
            case 2: 
                filterWorkByType([2])
            default: 
                break;
        } 
            
    }

    const fileterAllWork = () => {
        setSearchConditionNull().then(()=> {
            props.history.push({pathname: "/index/work/worklist"})
        })
    }

    const filterWorkByType = (value) => {
        findWorkStatusListBySorts({sorts: value}).then((data)=> {
            let list = []
            data.data.map(item=> {
                list.push(item.id)
                return list;
            })
            setSearchConditionNull()
            setSearchCondition({workStatusIds: list,assignerIds: [getUser().userId]})
            props.history.push({pathname: "/index/work/worklist"})
        })
    }

    return (
        <Fragment>
            <div className="home">
                <Row>
                    <Col xl={{span: 18,offset:3}} lg={{span: 20,offset:2}}>
                            <div className="upper-box">
                                <div className="title">
                                    <div className="name">我的项目</div>
                                    {
                                        projectList && projectList.length> 4 && <div className="more">更多...</div>
                                    }
                                </div>
                                <div className="project">
                                {
                                    projectList && projectList.map((item,index)=> {
                                        if(index < 4){
                                            return <div className="project-item" key={item.project.id} onClick={()=>goProdetail(item.project.id,item.project.projectType.id)}>
                                            <div className="item-top"></div>
                                            <div className="item-title">   
                                                {/* <svg className="project-icon" aria-hidden="true">
                                                    <use xlinkHref="#icondingqigongzuo"></use>
                                                </svg> */}
                                                <img src={`${img_url}/file/${item.project.iconUrl}?tenant=${tenant}`} width = "30px" height="30px" alt="" />
                                                <span>{item.project.projectName}</span>
                                            </div>
                                            <div className="process-work"><span>未处理的事务</span><span>{item.processWorkItemCount}</span></div>
                                            <div className="end-work"><span>已处理事务</span><span>{item.endWorkItemCount}</span></div>
                                        </div>
                                        }
                                        
                                    })
                                }
                                </div>
                            </div>
                            <div className="lower-box">
                                <div className="work-box">
                                    <div className="title">
                                        <div className="name">我的事项</div>
                                    </div>
                                    <div className="home-work">
                                    {
                                        workStatusList && workStatusList.map((item,index)=> {
                                            return <div className="work-item" key={index} onClick={() => goWorkItemList(index)}>
                                            <svg className="work-icon" aria-hidden="true">
                                                <use xlinkHref="#icondingqigongzuo"></use>
                                            </svg>
                                            <div className="work-count">
                                                <div className="work-num">{item.groupCount}</div>
                                                <div className="work-text">{item.statusName}</div>
                                            </div>
                                        </div>
                                        })
                                    }
                                    </div>
                                </div>
                                <div className="sprint-box">
                                    <div className="title">
                                        <div className="name">我的迭代</div>
                                        <div className="more" onClick={() => {props.history.push(`/index/sprint/${userId}`)}}>更多...</div>
                                    </div>
                                    <div className="sprint">
                                    {
                                        sprintList && sprintList.map((item)=> {
                                            return <div className="sprint-item" 
                                                    key={item.id}  
                                                    onClick={()=>goSprintdetail(item.project.id,item.project.projectType.id,item.id)}>
                                                <div className="sprint-item-left">
                                                    <svg className="sprint-icon" aria-hidden="true">
                                                        <use xlinkHref="#iconzuoyepiaotiaoyue"></use>
                                                    </svg>
                                                    <div className="sprint-name">
                                                        <div className="name">{item.sprintName}</div>
                                                        <div className="sprint-date">{item.startTime} ~ {item.endTime}</div>
                                                    </div>
                                                </div>
                                                
                                                <div className="sprint-project">
                                                    项目1
                                                </div>
                                                <div className="sprint-process">
                                                    50%
                                                </div>
                                            </div>
                                        })
                                    }
                                    </div>
                                </div>
                            </div>
                        
                    </Col>
                </Row>
            </div>
        </Fragment>
    );
}


export default inject('homeStore','workStore')(observer(Home));