import React, { useEffect, useState, useRef } from "react";
import { Modal, Table, Select, message, Input, Empty } from 'antd';
import { observer, inject } from "mobx-react";
import "./WorkRelationAdd.scss";
import InputSearch from "../../common/input/InputSearch"
import { SelectSimple, SelectItem } from "../../common/select";
const WorkChildAddmodal = (props) => {
    const { projectStore, workStore, workRelation, selectIds, showAddRelation, selectChild, relationAddRef, projectId } = props;

    const { workTypeList, workId } = workStore;
    const { addWorkRelation, getWorkRelationList, workRelationList, unRelationTotal } = workRelation;
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const relationAdd = useRef();
    const [current, setCurrent] = useState(1);
    const [pageText, setPageText] = useState("加载更多")
    const [pageSize, setPageSize] = useState(5)
    useEffect(() => {
        getWorkRelationList({
            projectId: projectId,
            idNotIn: selectIds,
            workTypeIds: null,
            pageParam: {
                pageSize: pageSize,
                currentPage: 1
            }
        })
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

    //提交事项列表
    const submitWorkRelationList = () => {
        if (selectedRowKeys.length !== 0) {
            for (let i = 0; i < selectedRowKeys.length; i++) {
                let params = { id: selectedRowKeys[i], workItem: workId }
                addWorkRelation(params).then(() => {
                    if (i === selectedRowKeys.length - 1) {
                        setSelectedRowKeys([])
                        showAddRelation(false)
                    }
                })
                // message.info('添加成功');
            }
        } else {
            message.info('请选择事项');
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

    // useImperativeHandle(relationAddRef, () => ({
    //     submitWorkRelationList: submitWorkRelationList
    // }))

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
            })
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

    // // 搜索事项
    // const searchUnselectWorkRelation = (value) => {
    //     getWorkRelationList({ title: value })
    // }

    return (
        <>
            <div className="relation-add" ref={relationAdd}>
                <div className="relation-add-input">
                    <div>搜索添加关联事项</div>
                    <div className="relation-add-submit">
                        <span onClick={() => showAddRelation(false)}>
                            取消
                        </span>
                    </div>
                </div>
                <div className="relation-add-model" >
                    <div className="relation-add-search">
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
                                        imgUrl={item.workType.iconUrl}
                                    />
                                })
                            }
                        </SelectSimple>
                        <InputSearch onChange={(value) => searchUnselectWorkRelationByStatus("title", value)} placeholder={"项目名称"} />
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
                                                {
                                                    item.workType?.iconUrl ?
                                                        <img
                                                            src={'/images/' + item.workType?.iconUrl}
                                                            alt=""
                                                            className="svg-icon"

                                                        />
                                                        :
                                                        <img
                                                            src={'/images/workType2.png'}
                                                            alt=""
                                                            className="svg-icon"
                                                        />
                                                }
                                                <div>
                                                    <div className="work-item-id">{item.id}</div>
                                                    <div className="work-item-title">{item.title} </div>
                                                </div>
                                            </div>
                                            <div className="work-item-right">
                                                {
                                                    item.workPriority?.iconUrl ?
                                                        <img
                                                            src={'/images/' + item.workPriority?.iconUrl}
                                                            alt=""
                                                            className="svg-icon"

                                                        />
                                                        :
                                                        <img
                                                            src={'/images/proivilege1.png'}
                                                            alt=""
                                                            className="svg-icon"
                                                        />
                                                }
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
                                                <div className="relation-add-table-page" onClick={() => loadNextPage()}>{pageText}</div>
                                                :
                                                <div className="relation-add-table-page">到底啦~</div>
                                        }
                                    </>

                                }
                            </div>
                            :
                            <div className="relation-add-table">
                                <Empty image = "/images/nodata.png" description = "暂时没有待办~" />
                            </div>
                        }
                    </div>

                </div>

            </div>


        </>
    );
};

export default inject('projectStore', 'workStore', 'workRelation')(observer(WorkChildAddmodal));
