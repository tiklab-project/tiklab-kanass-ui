/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-12-13 11:20:23
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-26 13:41:42
 */
import React, { useEffect, useState, useRef } from "react";
import { Tabs, Pagination, Menu, Dropdown, Button } from "antd";
import { DownOutlined } from '@ant-design/icons';
import "../../common/components/projectDetail.scss";
import { observer, inject } from "mobx-react";
import 'moment/locale/zh-cn';
import WorkLog from "./workLog";
import WorkRelation from "./workRelation"
import WorkWiki from "./workWiki"
import WorkChild from "./workChild";
import WorkBasicInfo from "./workBasicInfoDefect";
import WorkComment from "./workComment";
import WorkDynamic from "./workDynamic";
import { PrivilegeProjectButton } from "doublekit-privilege-ui";
import WorkAddModel from "./workAddModel";
import { getDomainTenant, getUser } from 'doublekit-core-ui'
import "./workDetail.scss";
const { TabPane } = Tabs;

const WorkDetailDefect = (props) => {
    const { workStore, setSelectKey, workInfo, getWorkDetail, workChild } = props;
    const { workList, setWorkId, defaultCurrent, statesList, detWork, workShowType, getWorkConditionPageTree,getWorkConditionPage,
        total, workId, editWork, setWorkIndex, getWorkBoardList, changeWorkStatus, getStateList, findFlowDef,viewType } = workStore;
    const { getWorkChildList, setChildWorkItem } = workChild;
    const workDeatilForm = useRef()
    const workAddModel = useRef()
    const inputRef = useRef()
    const projectId = localStorage.getItem("projectId")
    const [workStatus, setWorkStatus] = useState(workInfo.workStatus ? workInfo.workStatus.name : "nostatus" )
    const [activeKey, setActiceKey] = useState("detail");
    const [state, setState] = useState();
    const [workTypeCategory, setWorkTypeCategory] = useState("")
    const tenant = getDomainTenant();
    const userId = getUser().userId;

    useEffect(() => {
        // 如果是经办人就只能按照正常状态流转
        if (workInfo.builder.id === userId || workInfo.reporter && workInfo.reporter.id === userId) {
            findFlowDef({ id: workInfo.workType.flow.id })
        } else {
            findStatusList(workInfo.workStatus.id);
        }
        // 如果是报告人或者管理员

        // setWorkStatus(workInfo.workStatus.name)
        if (activeKey === "child") {
            onTabClick(activeKey)
        }
        return
    }, [workInfo])

    /**
     * 改变页码
     * @param {page} page 
     */
    const changPage = (page) => {
        setWorkId(workList[page - 1].id)
        setWorkIndex(page)
        setSelectKey(workList[page - 1].id)
    }

    /**
     * 修改名字
     * @param {value} vlaue 
     * @param {id} id 
     */

    const updateName = (value, id) => {
        const name = value.target.innerText;
        const params = {
            title: name,
            id: id
        }
        editWork(params).then(res => {
            if (res.code === 0) {
                document.getElementById(id).innerHTML = value.target.innerText
            }
        })

    }

    // 项目是否是子类
    const eidtWork = () => {
        const params = {
            type: "edit",
            id: workId,
            title: `编辑${workInfo.title}`,
            typework: workTypeCategory
        }
        if (workInfo.parentWorkItem) {
            setWorkTypeCategory(2)
        }
        setState(params)
        workAddModel.current.setShowAddModel(true)
    }

    /**
     * 删除项目
     */
    const deleteWork = () => {
        detWork(workId).then(() => {
            if(workShowType === "bodar"){
                getWorkBoardList().then((res) => {
                    if (res[indexParams.statusIndex].workItemList.length > 0) {
                        initForm(res[indexParams.statusIndex].workItemList[0].id, indexParams.workIndex);
                    }
                })
            }else if((workShowType === "list" || workShowType === "table") && viewType === "tree"){
                getWorkConditionPageTree().then((res) => {
                    if (total === defaultCurrent) {
                        getWorkDetail(res.dataList[0].id, defaultCurrent);
                    } else {
                        getWorkDetail(res.dataList[defaultCurrent - 1].id, defaultCurrent);
                    }
                })
            }else if((workShowType === "list" || workShowType === "table") && viewType === "tile"){
                getWorkConditionPage().then((res) => {
                    if (total === defaultCurrent) {
                        getWorkDetail(res.dataList[0].id, defaultCurrent);
                    } else {
                        getWorkDetail(res.dataList[defaultCurrent - 1].id, defaultCurrent);
                    }
                })
            }
        })
    }

    /**
     * 状态下拉菜单
     */
    const menu = (
        <Menu>
            {
                statesList && statesList.map((item) => {
                    return <Menu.Item key={item.id} onClick={() => changeStatus(item.id, item.name)}>
                        <span >
                            {item.name}
                        </span>
                    </Menu.Item>
                })
            }

        </Menu>
    );

    /**
     * 改变事项状态
     * @param {statusId} statusId 
     * @param {name} name 
     */
    const changeStatus = (statusId, name) => {
        const value = {
            workStatus: statusId,
            id: workId
        }
        changeWorkStatus(value).then((res) => {
            if (res.code === 0) {
                setWorkStatus(name)
                findStatusList(workInfo.workType.flow.id, statusId)
            }
        })
    }

    /**
     * 获取事项状态列表
     * @param {*} flowId 
     * @param {*} stateId 
     */
    const findStatusList = (stateId) => {
        let params = {
            nodeId: stateId
        }
        getStateList(params)
    }

    /**
     * 点击tab,切换tabs
     * @param {event} event 
     */
    const onTabClick = (event) => {
        setActiceKey(event)
        if (event === "child") {
            const params = {
                parentId: workId,
                workTypeId: null,
                title: null,
                pageParam: {
                    currentPage: 1,
                    pageSize: 10
                }
            }
            getWorkChildList(params).then((res) => {
                if (res.code === 0) {
                    setChildWorkItem(res.data.dataList)
                }
            })
        }

    }

    return (
        <div className="work-detail">
            <div className="work-detail-title">
                <img src={`${img_url}/file/${workInfo.workType.iconUrl}?tenant=${tenant}`} width="15px" height="15px" alt="" />
                <div className="work-detail-title-name">
                    <div
                        className="work-item-title"
                        contentEditable={true}
                        suppressContentEditableWarning
                        onBlur={(value) => updateName(value, workInfo.id)}
                        ref={inputRef}
                    >
                        {workInfo.title}
                    </div>
                    <div className="code">{workInfo.id}</div>

                </div>

                <div className="work-detail-title-right">
                    <div className="work-detail-tab-botton">
                        <div className="work-botton botton-background"
                            onClick={eidtWork}
                        >
                            <svg className="icon" aria-hidden="true">
                                <use xlinkHref="#iconchuangzuo"></use>
                            </svg>
                        </div>

                        <PrivilegeProjectButton code={'WorkDelete'} disabled={"hidden"} domainId={projectId}>
                            <div className="work-botton botton-background delete"
                                onClick={deleteWork}
                            >
                                <svg className="icon" aria-hidden="true">
                                    <use xlinkHref="#iconshanchu2"></use>
                                </svg>
                            </div>
                        </PrivilegeProjectButton>
                        {
                            workInfo.builder.id === userId || (workInfo.reporter && workInfo.reporter.id === userId) ? <Dropdown overlay={menu}>
                                <Button className="botton-background">
                                    {workStatus} <DownOutlined />
                                </Button>
                            </Dropdown> : <Dropdown overlay={menu}>
                                <Button className="botton-background">
                                    {workStatus} <DownOutlined />
                                </Button>
                            </Dropdown>
                        }
                        <div className="more">
                            <svg className="icon" aria-hidden="true">
                                <use xlinkHref="#icongengduo"></use>
                            </svg>
                        </div>
                    </div>
                    <div>
                        <Pagination
                            simple
                            current={defaultCurrent || ""}
                            total={total}
                            pageSize="1"
                            className="work-detail-title-pagination"
                            onChange={changPage}
                            showQuickJumper={false}
                            size="small"
                        />
                    </div>
                </div>
            </div>
            <div className="work-detail-tab">
                <Tabs activeKey={activeKey} type="card" size="small" onTabClick={(event) => onTabClick(event)}>
                    <TabPane tab="基本信息" key="detail">
                        {workInfo && <WorkBasicInfo workInfo={workInfo} getWorkDetail={getWorkDetail} workDeatilForm={workDeatilForm} {...props} />}
                    </TabPane>

                    <TabPane tab="关联缺陷" key="relation">
                        <WorkRelation type="缺陷" {...props} />
                    </TabPane>

                    <TabPane tab="子缺陷" key="child">
                        <WorkChild
                            workId={workId}
                            workType={workInfo.workType.id}
                            type="缺陷"
                            {...props}

                        />
                    </TabPane>

                    <TabPane tab="日志" key="log">
                        <WorkLog />
                    </TabPane>

                    <TabPane tab="评论" key="commont">
                        <WorkComment workId={workId} />
                    </TabPane>
                    <TabPane tab="知识库" key="wiki">
                        <WorkWiki {...props} />
                    </TabPane>
                    <TabPane tab="动态" key="dynamic">
                        <WorkDynamic {...props} />
                    </TabPane>        
                </Tabs>

            </div>

            <WorkAddModel workAddModel={workAddModel} state={state} getWorkDetail={getWorkDetail} {...props} />
        </div>
    )
};
export default inject("workStore", "workChild")(observer(WorkDetailDefect));
