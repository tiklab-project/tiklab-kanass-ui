import React, {useEffect, useRef, useState} from "react";
import {withRouter} from "react-router";
import {observer, Provider} from "mobx-react";
import {getUser} from "tiklab-core-ui";
import {finWorkList} from "../../../work/components/WorkGetList";
import {setSessionStorage} from "../../../common/utils/setSessionStorage";
import {Col, Empty, Row, Spin} from "antd";
import WorkTableHead from "../../../work/components/WorkTableHead";
import WorkTableFilter from "../../../work/components/WorkTableFilter";
import ImgComponent from "../../../common/imgComponent/ImgComponent";
import UserIcon from "../../../common/UserIcon/UserIcon";
import WorkDetailDrawer from "../../../work/components/WorkDetailDrawer";
import "./WorkItemStatusPage.scss"
import WorkStore from "../../../work/store/WorkStore";
import WorkCalendarStore from "../../../work/store/WorkCalendarStore";
import InputSearch from "../../../common/input/InputSearch";
import WorkCreatDropdown from "../../../work/components/workCreatDropdown";
const WorkItemStatusPage = (props) => {
    const { workBoardList, editWork, setIndexParams, changeBorderList, reductionWorkBoardList, boardGroup,
        workUserGroupBoardList, findTransitionList, findWorkTypeDmList, setSearchConditionNull,
        setWorkId, setWorkIndex, createRecent, setWorkShowType, findChangePageWorkBoardList, getWorkItemStatusList,
        workBoardCurrentPage, workShowType, getWorkBoardList, deleteWorkItem, workId,
        workItemStatusList, workItemStatusCurrentPage, reductionWorkItemStatusList, changeWorkItemStatusList} = WorkStore;
    const [moveWorkId, setMoveWorkId] = useState("")
    const [moveStatusId, setMoveStatusId] = useState("")
    const [startBoxIndex, setStartBoxIndex] = useState("")
    const [startWorkBoxIndex, setStartWorkBoxIndex] = useState("")
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [transitionList, setTransitionList] = useState()
    const [isSameFlowBox, setIsSameFlowBox] = useState()
    const modelRef = useRef()
    const [flowId, setFlowId] = useState()
    const project = JSON.parse(localStorage.getItem("project"));
    const userId = getUser().userId;
    const path = props.match.path;
    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    const versionId = props.match.params.version ? props.match.params.version : null;
    const stageId = props.match.params.stage ? props.match.params.stage : null;
    const [loading, setLoading] = useState(true)
    const [workTypeList, setWorkTypeList] = useState();
    const store = {
        workStore: WorkStore,
        workCalendarStore: WorkCalendarStore
    };

    // 项目id
    const projectId = props.match.params.id;

    const fetchData = async () => {
        // setWorkShowType("bodar")
        await findWorkTypeDmList({ projectId: projectId, codes: ["demand"] }).then(res => {
            if (res.code === 0){
                setWorkTypeList(res.data);
                const params = {
                    projectId: projectId,
                    sprintId: sprintId,
                    versionId: versionId,
                    stageId: stageId,
                    workTypeSysId: res.data[0].workType.id
                }
                setLoading(true)
                getWorkItemStatusList(params);
                setLoading(false)
            }
        })
    }

    useEffect( () => {
        fetchData();
        // return () =>{
        //     console.log("组件卸载了");
        //     setSearchConditionNull();
        // };
    }, [])

    // 拖放效果
    const moveWorkItem = () => {
        // const dragEvent = event.target
        // dragEvent.style.background = "#d0e5f2";
    }

    /**
     * 查找能够被放置的状态id
     * @param {事项id} workId
     * @param {状态id} stateId
     * @param {流程id} flowId
     */
    const findStatusList = (workId, stateId, flowId) => {
        let params = {
            domainId: workId,
            fromNodeId: stateId,
            flowId: flowId,
            userId: userId
        }
        findTransitionList(params).then(res => {
            if (res.code === 0) {
                setTransitionList(res.data)
                let list = []
                res.data && res.data.length > 0 && res.data.map(item => {
                    list.push(item.toNode.id)
                })
                setIsSameFlowBox(list)

            }
        })
    }

    // 开始拖动
    const moveStart = (workId, statuId, index, workIndex, flowId) => {
        // event.preventDefault();
        // const dragEvent = event.target
        // dragEvent.style.background = "#d0e5f2";
        // 被拖拽盒子的起始id
        setMoveStatusId(statuId)
        setMoveWorkId(workId)

        //获取被拖拽盒子的index
        setStartBoxIndex(index)
        setStartWorkBoxIndex(workIndex)

        // 查找能够被放置的状态id
        findStatusList(workId, statuId, flowId)
        setFlowId(flowId)

    }

    //必须有onDragOver才能触发onDrop
    const dragover = () => {
        event.preventDefault();
    }

    /**
     *
     * @param {目标状态id} targetStatusId
     * @param {目标状态所处的索引} index
     */
    const changeStatus = (targetStatusId, index) => {
        event.preventDefault();
        const transition = transitionList.filter(item => item.toNode.id === targetStatusId);
        const value = {
            updateField: "workStatusNode",
            workStatusNode: targetStatusId,
            id: moveWorkId,
            flowId: flowId,
            transitionId: transition[0].id,
        }
        if (targetStatusId !== moveStatusId) {
            //改变事件状态
            let boardList = JSON.parse(JSON.stringify(workItemStatusList));
            // 看板视图移动位置后，列表交换
            changeWorkItemStatusList(startBoxIndex, startWorkBoxIndex, index, targetStatusId);
            // 修改事项
            editWork(value).then((res) => {
                if (res.code !== 0) {
                    // 若调用接口失败，则还原
                    reductionWorkItemStatusList(boardList)
                }
            })
        }

        // 被拖拽盒子的起始id
        setMoveStatusId("")
        setMoveWorkId("")

        //获取被拖拽盒子的index
        setStartBoxIndex("")
        setStartWorkBoxIndex("")
        setIsSameFlowBox([])
    }

    // 点击打开详情弹窗
    const showModal = (workItem, index, statusid) => {
        const params = {
            name: workItem.title,
            model: "workItem",
            modelId: workItem.id,
            project: { id: project.id },
            projectType: { id: project.projectType.id },
            iconUrl: workItem.workTypeSys.iconUrl
        }
        // 创建最近查看的事项
        createRecent(params)

        setIndexParams(index, statusid)
        setWorkIndex(index)
        setWorkId(workItem.id)

        const pathname = props.match.url;;
        props.history.replace(`${pathname}/${workItem.id}`)
        setIsModalVisible(true)
        // 设置事项详情的顶部面包屑
        setSessionStorage("detailCrumbArray", [{ id: workItem.id, code: workItem.code, title: workItem.title, iconUrl: workItem.workTypeSys.iconUrl }])

    }

    /**
     * 翻页
     * @param {状态信息} item
     * @param {状态索引} index
     */
    const changePage = (item, index) => {
        const data = {
            index: index,
            workStatusId: item.state.id,
            pageParam: {
                pageSize: 20,
                currentPage: workItemStatusCurrentPage[index] + 1
            }
        }
        findChangePageWorkBoardList(data)
    }

    /**
     * 删除事项
     * @param {删除事项接口} deleteWorkItem
     */
    const deleteWork = (deleteWorkItem) => {
        deleteWorkItem(workId).then(() => {
            getWorkItemStatusList()
        })
    }

    /**
     * 删除事项，关闭详情弹窗
     */
    const delectCurrentWorkItem = () => {
        deleteWork(deleteWorkItem)
        setIsModalVisible(false)
    }


    /**
     * 取消拖拽
     */
    const cancelDrag = () => {
        setIsSameFlowBox([])
        setMoveWorkId(null)
    }

    const onSearch = (value) => {
        const param = {
            title: value
        }
        getWorkItemStatusList(param);
    }
    return (
        <Provider {...store}>
            <div className="work-bordar">
                <div className="top-action" style={{ background: "#fff" }}>
                    <InputSearch
                        placeholder="搜索需求"
                        allowClear
                        onChange={onSearch}
                    />
                    <div className="top-action-right">
                        <WorkCreatDropdown workTypeList={workTypeList}  {...props} modelStyle={{ right: 0 }} />
                    </div>
                </div>
                <div className={`work-bodar-content-page ${loading ? "work-bodar-content-spin" : ""}`}>
                    <Spin spinning={loading} tip="加载中">
                        <div className="work-bodar-flex">
                            <div className="work-bodar-list">

                                {
                                    //boardGroup === "nogroup" &&
                                    workItemStatusList && workItemStatusList.map((item, index) => {
                                        if (item.state) {
                                            return <div className={`work-bodar-box`}

                                                        onDragOver={dragover}
                                                        id={`targetBox${index}`}
                                                        key={item.state.id}
                                            >
                                                <div className="work-bodar-title">
                                                    <div className="work-bodar-title-content">{item.state.name}<span className="work-bodar-num">{item.workItemList.totalRecord} 个需求</span></div>
                                                </div>
                                                {
                                                    isSameFlowBox && isSameFlowBox.indexOf(item.state.id) > -1 ?
                                                        <div
                                                            className={`${(isSameFlowBox && isSameFlowBox.indexOf(item.state.id) > -1) ? "work-bodar-box-border" : ""}`}
                                                            onDrop={() => changeStatus(item.state.id, index)}
                                                        >
                                                        </div>
                                                        :
                                                        <>
                                                            <div className="work-border-box-list" onDrop={() => cancelDrag()}>
                                                                {
                                                                    item.workItemList.dataList.length > 0 ? item.workItemList.dataList.map((workItem, workIndex) => {
                                                                            return <div
                                                                                className={`work-bodar-item ${moveWorkId === workItem.id ? "work-bodar-item-move" : ""}`}
                                                                                key={workItem.id}
                                                                                onDrag={() => moveWorkItem()}
                                                                                onClick={() => showModal(workItem, workIndex, index)}
                                                                                draggable={"true"}
                                                                                onDragStart={() => moveStart(workItem.id, item.state.id, index, workIndex, workItem.workType.flow.id)}
                                                                            >

                                                                                <div className="work-item-title" >
                                                                                    <div className="work-item-content">
                                                                                        <ImgComponent
                                                                                            src={workItem.workTypeSys?.iconUrl}
                                                                                            alt=""
                                                                                            className="icon-24"
                                                                                        />
                                                                                        <div className="work-item-text">
                                                                                            <div className="work-item-code">
                                                                                                {workItem.code}
                                                                                            </div>
                                                                                            <div className="work-item-name">
                                                                                                {workItem.title}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="work-item-date">
                                                                                        {workItem.buildTime.substring(0,10)}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        })
                                                                        :
                                                                        <>
                                                                            {
                                                                                !loading && <Empty description="暂无事项" />
                                                                            }
                                                                        </>

                                                                }
                                                                {
                                                                    workItemStatusCurrentPage.length > 0 && item.workItemList.totalPage > 1 &&
                                                                    workItemStatusCurrentPage[index] < item.workItemList.totalPage &&
                                                                    <div className="change-page" onClick={() => changePage(item, index)}>加载更多</div>
                                                                }
                                                            </div>

                                                        </>

                                                }
                                            </div>
                                        }

                                    })
                                }

                            </div>

                            <WorkDetailDrawer
                                isModalVisible={isModalVisible}
                                setIsModalVisible={setIsModalVisible}
                                modelRef={modelRef}
                                showPage={true}
                                delectCurrentWorkItem={delectCurrentWorkItem}
                                {...props}
                            />

                        </div>
                    </Spin>

                </div>

            </div>

        </Provider>

    )
}

export default withRouter(observer(WorkItemStatusPage))
