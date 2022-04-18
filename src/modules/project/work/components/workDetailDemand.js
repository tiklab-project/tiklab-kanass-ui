/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-12-13 11:20:23
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-09 14:26:52
 */
import React, { useEffect, useState, useRef, Fragment } from "react";
import { Tabs, Pagination, Menu, Dropdown, Button, Row, Col,Select } from "antd";
import { ShopTwoTone, InboxOutlined, DownOutlined } from '@ant-design/icons';
import "../../common/components/projectDetail.scss";
import { observer, inject } from "mobx-react";
import 'moment/locale/zh-cn';
import WorkLog from "./workLog";
import WorkRelation from "./workRelation"
import WorkWiki from "./workWiki"
import WorkChild from "./workChild";
import WorkBasicInfo from "./workBasicInfoDemand";
import WorkComment from "./workComment";
import WorkDynamic from "./workDynamic";
import { PrivilegeProjectButton } from "doublekit-privilege-ui";
import WorkAddModel from "./workAddModel";
import { getDomainTenant, getUser } from 'doublekit-core-ui'
import "./workDetail.scss"
const { TabPane } = Tabs;

const WorkDetailDefect = (props) => {
    const { workStore, setSelectKey, workInfo, getWorkDetail, workChild } = props;
    const { workList, setWorkId, defaultCurrent, statesList, detWork, workShowType, getWorkConditionPageTree, getWorkConditionPage,
        total, workId, editWork, setWorkIndex, getWorkBoardList, changeWorkStatus, getStateList, findFlowDef, viewType,userList } = workStore;
    const { getWorkChildList, setChildWorkItem } = workChild;
    const projectId = localStorage.getItem("projectId");
    const workDeatilForm = useRef()
    const inputRef = useRef()
    const workAddModel = useRef()
    const [state, setState] = useState();
    const [workTypeCategory, setWorkTypeCategory] = useState("")
    const [activeKey, setActiceKey] = useState("detail");
    const [workStatus, setWorkStatus] = useState(workInfo.workStatus ? workInfo.workStatus.name : "nostatus")
    const tenant = getDomainTenant();
    const userId = getUser().userId;


    useEffect(() => {
        if (workInfo.builder.id === userId || workInfo.reporter && workInfo.reporter.id === userId) {
            findFlowDef({ id: workInfo.workType.flow.id })
        } else {
            findStatusList(workInfo.workStatus.id);
        }
        // setWorkStatus(workInfo.workStatus.name)
        if (activeKey === "child") {
            onTabClick(activeKey)
        }
        return
    }, [workInfo])

    

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

    const deleteWork = () => {
        detWork(workId).then(() => {
            if (workShowType === "bodar") {
                getWorkBoardList().then((res) => {
                    if (res[indexParams.statusIndex].workItemList.length > 0) {
                        initForm(res[indexParams.statusIndex].workItemList[0].id, indexParams.workIndex);
                    }
                })
            } else if ((workShowType === "list" || workShowType === "table") && viewType === "tree") {
                getWorkConditionPageTree().then((res) => {
                    if (total === defaultCurrent) {
                        getWorkDetail(res.dataList[0].id, defaultCurrent);
                    } else {
                        getWorkDetail(res.dataList[defaultCurrent - 1].id, defaultCurrent);
                    }
                })
            } else if ((workShowType === "list" || workShowType === "table") && viewType === "tile") {
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
     * 改变事项状态
     * @param {*} statusId 
     * @param {*} name 
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
     * 获取当前事项状态的列表
     * @param {*} flowId 
     * @param {*} stateId 
     */
    const findStatusList = (stateId) => {

        let params = {
            nodeId: stateId
        }
        getStateList(params)
    }

    const onTabClick = (event) => {
        setActiceKey(event)
        if (event === "demand" || event === "child") {
            let workTypeId = workInfo.workType.id;
            if (event === "demand") {
                workTypeId = "0"
            }
            const params = {
                parentId: workId,
                workTypeId: workTypeId,
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

    /**
     * 改变页码
     * @param {*} page 
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

    const updateSingle = (workId,updateData,updateField) => {
        let data = {
            id: workId,
            updateField:updateField,
            ...updateData
        }
        editWork(data)
    }

    const [fieldName, setFieldName] = useState("")
    const changeStyle = (value) => {
        setFieldName(value)
    }
    const updateReport = (workId,updateData,updateField) => {
        setFieldName("")
        updateSingle(workId,updateData,updateField)
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
    return (
        <div className="work-detail">
            <Row>
                <Col lg={20} xl={18}>
                    <div className="work-detail-top">
                        <img src={`${img_url}/file/${workInfo.workType.iconUrl}?tenant=${tenant}`} width="15px" height="15px" alt="" />
                        <div className="work-detail-top-name">
                            <div>
                                <span
                                    className="work-item-title"
                                    contentEditable={true}
                                    suppressContentEditableWarning
                                    onBlur={(value) => updateName(value, workInfo.id)}
                                    ref={inputRef}
                                >
                                    {workInfo.title}
                                </span>

                            </div>
                            <div className="work-item-info">
                                <div className="work-item-info-item"> 
                                    <span className="work-item-info-title">ID: </span>
                                    <span>{workInfo.id}</span>
                                </div> 
                                <div className="work-item-info-item"> 
                                    <div className="work-item-info-title">进度: </div>
                                    <div  
                                        className="work-item-info-data"
                                        contentEditable={true}
                                        suppressContentEditableWarning
                                        onBlur={(value) => updateSingle(workInfo.id,{percent: value},"percent")}
                                    >{workInfo.percent}</div></div>
                                <div className="work-item-info-item"> 
                                    <div className="work-item-info-title">负责人: </div> 
                                    <Select
                                        className="work-item-info-data"
                                        placeholder="请选择报告人"
                                        allowClear
                                        key="selectWorkUser"
                                        bordered={fieldName === "reporter" ? true : false}
                                        showArrow={fieldName === "reporter" ? true : false}
                                        onFocus={() => changeStyle("reporter")}
                                        onBlur={() => changeStyle("")}
                                        onChange={(value) => updateReport(workInfo.id,{reporter: value},"reporter")}
                                    >
                                        {
                                            userList && userList.map((item) => {
                                                return <Select.Option value={item.user.id} key={item.user.id}>{item.user.name}</Select.Option>
                                            })
                                        }
                                    </Select>
                                </div>
                            </div>
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
                </Col>
            </Row>


            <div className="work-detail-tab">
                <Tabs activeKey={activeKey} type="card" size="small" onTabClick={(event) => onTabClick(event)}>
                    <TabPane tab="基本信息" key="detail">
                        {workInfo && <WorkBasicInfo workInfo={workInfo} getWorkDetail={getWorkDetail} workDeatilForm={workDeatilForm} {...props} />}
                    </TabPane>

                    {/* <TabPane tab="关联需求" key="relation">
                        <WorkRelation type="需求" {...props} />
                    </TabPane>

                    <TabPane tab="子需求" key="child">
                        <WorkChild
                            workId={workId}
                            workType={workInfo.workType.id}
                            type="需求"
                            {...props} />
                    </TabPane> */}

                    <TabPane tab="任务" key="demand">
                        <WorkChild workId={workId} workType={"0"} type="任务" {...props} />
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
