import React, { useEffect, useState, useRef } from "react";
import { Modal, Table, Select, message, Input, Empty } from 'antd';
import { observer, inject } from "mobx-react";
import "./WorkRelationAdd.scss";
import InputSearch from "../../common/input/InputSearch"
import { SelectSimple, SelectItem } from "../../common/select";
import { getUser } from "thoughtware-core-ui";
import ImgComponent from "../../common/imgComponent/ImgComponent";
import ProjectEmpty from "../../common/component/ProjectEmpty";
const WorkRelationAddModal = (props) => {
    const { workStore, workRelation, selectIds, showAddRelation, selectChild, projectId } = props;
    const tenant = getUser().tenant;
    const { workTypeList, workId, workStatusList, getWorkStatus } = workStore;
    const { addWorkRelation, getWorkRelationList, workRelationList, unRelationTotal } = workRelation;
    const relationAdd = useRef();
    const [current, setCurrent] = useState(1);
    const [pageText, setPageText] = useState("加载更多")
    const [pageSize, setPageSize] = useState(20)
    useEffect(() => {
        getWorkRelationList({
            projectId: projectId,
            idNotIn: selectIds,
            workTypeIds: null,
            workStatus: null,
            pageParam: {
                pageSize: pageSize,
                currentPage: 1
            }
        })
        getWorkStatus()
        return;
    }, [])

    useEffect(() => {
        window.addEventListener("mousedown", closeModal, false);
        return () => {
            window.removeEventListener("mousedown", closeModal, false);
        }
    }, [selectChild])

    const closeModal = (e) => {
        if (!relationAdd.current) {
            return;
        }
        if (!relationAdd.current.contains(e.target) && relationAdd.current !== e.target) {
            showAddRelation(false)
        }
    }

    const creatWorkRelation = (id) => {
        addWorkRelation({ id: id, workItem: workId }).then((res) => {
            if (res.code === 0) {
                // setSelectedRowKeys([])
                message.info('添加成功');
                showAddRelation(false)
            }
        })
    }

    // 搜索事项
    const searchUnselectWorkRelationByStatus = (key, value) => {
        setCurrent(1)
        setPageSize(20)
        getWorkRelationList(
            {
                [key]: value,
                pageParam: {
                    pageSize: 20,
                    currentPage: 1
                }
            }
        )
    }

    const searchUnselectWorkRelationByTitle = (value) => {
        setCurrent(1)
        setPageSize(20)
        getWorkRelationList(
            {
                likeId: value,
                title: value,
                pageParam: {
                    pageSize: 20,
                    currentPage: 1
                }
            }
        )
    }
    const loadNextPage = () => {
        setCurrent(current + 1)
        const params = {
            pageParam: {
                pageSize: pageSize,
                currentPage: current + 1
            }
        }
        setPageText("加载中")
        getWorkRelationList(params).then(res => {
            if (res.code === 0) {
                setPageText("加载更多")
            }
        })
    }


    return (
        <>
            <div className="relation-add" ref={relationAdd}>

                <div className="relation-add-model" >
                    <div className="relation-add-search">
                        <InputSearch style={{ minWidth: "250px", flex: 1 }} onChange={(value) => searchUnselectWorkRelationByTitle(value)} placeholder={"搜索事项"} />
                        <SelectSimple name="workTypeIds"
                            onChange={(value) => searchUnselectWorkRelationByStatus("workTypeIds", value)}
                            title={"事项类型"} ismult={true}
                        >
                            {
                                workTypeList.map(item => {
                                    return <SelectItem
                                        value={item.workType.id}
                                        label={item.workType.name}
                                        key={item.workType.id}
                                        imgUrl={`${upload_url}${item.workType.iconUrl}`}
                                    />
                                })
                            }
                        </SelectSimple>
                        {
                            workStatusList && workStatusList.length > 0 && <SelectSimple
                                name="workStatus"
                                onChange={(value) => searchUnselectWorkRelationByStatus("workStatusIds", value)}
                                title={"状态"}
                                ismult={true}
                            >
                                <div className="select-group-title">未开始</div>
                                {
                                    workStatusList.map(item => {
                                        if (item.id === "todo") {
                                            return <SelectItem
                                                value={item.id}
                                                label={item.name}
                                                key={item.id}
                                                imgUrl={item.iconUrl}
                                            />
                                        } else {
                                            return <div></div>
                                        }

                                    })
                                }
                                <div className="select-group-title">进行中</div>
                                {
                                    workStatusList.map(item => {
                                        if (item.id !== "todo" && item.id !== "done" && item.id !== "start") {
                                            return <SelectItem
                                                value={item.id}
                                                label={item.name}
                                                key={item.id}
                                                imgUrl={item.iconUrl}
                                            />
                                        } else {
                                            return <div></div>
                                        }

                                    })
                                }


                                <div className="select-group-title">已完成</div>
                                {
                                    workStatusList.map(item => {
                                        if (item.id === "done") {
                                            return <SelectItem
                                                value={item.id}
                                                label={item.name}
                                                key={item.id}
                                                imgUrl={item.iconUrl}
                                            />
                                        } else {
                                            return <div></div>
                                        }

                                    })
                                }
                            </SelectSimple>
                        }
                        <div className="relation-add-submit">
                            <span onClick={() => showAddRelation(false)}>
                                取消
                            </span>
                        </div>

                    </div>
                    <div className="relation-add-table">
                        <div className="relation-add-table-title">选择事项</div>
                        {
                            workRelationList && workRelationList.length > 0 ?
                                <div className="relation-add-list">
                                    {
                                        workRelationList && workRelationList.map(item => {
                                            return <div className="relation-add-work-item" onClick={() => creatWorkRelation(item.id)} key={item.id}>
                                                <div className="work-item-icon">
                                                    <ImgComponent
                                                        alt=""
                                                        className="svg-icon"
                                                        src={item.workTypeSys?.iconUrl}
                                                    />
                                                    <div>
                                                        <div className="work-item-id">{item.code}</div>
                                                        <div className="work-item-title">{item.title} </div>
                                                    </div>
                                                </div>
                                                <div className="work-item-right">


                                                    <ImgComponent
                                                        alt=""
                                                        className="svg-icon"
                                                        src={item.workPriority?.iconUrl}
                                                    />
                                                    <div className="work-item-icon">
                                                        {item.workStatus?.name}
                                                    </div>
                                                </div>
                                            </div>
                                        })
                                    }
                                    {
                                        unRelationTotal !== 1 &&
                                        <>
                                            {
                                                unRelationTotal > current ?
                                                    <div className="relation-add-table-page loading-more" onClick={() => loadNextPage()}>{pageText}</div>
                                                    :
                                                    <div className="relation-add-table-page">到底啦~</div>
                                            }
                                        </>

                                    }
                                </div>
                                :
                                <div className="relation-add-table">
                                    <ProjectEmpty description="暂时没有可关联事项~" />
                                </div>
                        }
                    </div>

                </div>

            </div>


        </>
    );
};

export default inject('workStore', 'workRelation')(observer(WorkRelationAddModal));
