import React, { Fragment, useEffect, useRef, useState } from "react";
import { Input, Space, message, Row, Col, Table } from "antd";
import WorkPriorityAddmodal from "./WorkPriorityAddModal";
import { observer, inject, Provider } from "mobx-react";
import "./WorkPriority.scss";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import WorkSetingStore from "../store/WorkSetingStore";
import DeleteModal from "../../../common/deleteModal/deleteModal";
import ImgComponent from "../../../common/imgComponent/ImgComponent";
const WorkPriority = (props) => {
    const store = {
        workSetingStore: WorkSetingStore
    }
    const { workPrioritylist, getWorkPriorityList,
        addWorkPriorityList, findWorkPriorityListById,
        editWorkPriorityList, deleteWorkPriorityList,
        setWorkPriorityList
    } = WorkSetingStore;

    useEffect(() => {
        getWorkPriorityList()
        return;
    }, []);

    const deleWorkPriority = (id) => {
        deleteWorkPriorityList(id)
    }


    //上移
    const upWorkPriority = (id) => {
        const newList = workPrioritylist
        const index = workPrioritylist.findIndex((item) => {
            return item.id === id
        })
        if (index === 0) {
            message.warning('已是最高了！');
        } else {
            const newItem = newList[index]
            newList[index] = newList[index - 1]
            newList[index - 1] = newItem
            setWorkPriorityList(newList)
        }

    }

    // 下移
    const downWorkPriority = (id) => {
        const newList = workPrioritylist
        const index = newList.findIndex((item) => {
            return item.id === id
        })
        if (index === newList.length - 1) {
            message.warning('已是最低了！');
        } else {
            const newItem = newList[index]
            newList[index] = newList[index + 1]
            newList[index + 1] = newItem
            setWorkPriorityList(newList)
        }
    }

    const [loading, setLoading] = useState(false)
    const columns = [
        {
            title: "优先级名称",
            dataIndex: "name",
            key: "name",
            render: (text, record) => (
                <div className="work-priority-name" >
                    <div className="work-type-icon">
                        <ImgComponent
                            src={record.iconUrl}
                            alt=""
                            className="icon-32"
                        />

                    </div>
                    <div className="work-type-text">{text}</div>
                </div>
            )
        },

        
        {
            title: "分组",
            dataIndex: "group",
            key: "group",
            render: (text) => (
                text === "system" ? <Fragment>系统</Fragment> :
                    (text === "custom" ? <Fragment>自定义</Fragment> : "")
            )
        },
        {
            title: "描述",
            dataIndex: "desc",
            key: "desc",
        },
        {
            title: "操作",
            key: "action",
            align: "left",
            width: '20%',
            render: (text, record) => (
                <Space size="middle">
                    
                    <svg
                        className="svg-icon" aria-hidden="true"
                        style={{ cursor: "pointer" }}
                        onClick={() => upWorkPriority(record.id)}
                    >
                        <use xlinkHref="#icon-totop"></use>
                    </svg>

                    <svg
                        className="svg-icon" aria-hidden="true"
                        style={{ cursor: "pointer" }}
                        onClick={() => downWorkPriority(record.id)}
                    >
                        <use xlinkHref="#icon-todown"></use>
                    </svg>
                    <WorkPriorityAddmodal
                        name="编辑"
                        typeName="优先级"
                        type="edit"
                        id={record.id}
                        editWorkPriorityList={editWorkPriorityList}
                        findWorkPriorityListById={findWorkPriorityListById}

                    >
                        编辑
                    </WorkPriorityAddmodal>
                    {/* <svg className="svg-icon" aria-hidden="true" onClick={() => deleWorkPriority(record.id)}>
                        <use xlinkHref="#icon-delete"></use>
                    </svg> */}
                    <DeleteModal deleteFunction={deleWorkPriority} id={record.id} getPopupContainer={workPriority.current} />
                </Space>
            ),
        },
    ];
    
    const workPriority = useRef(null)
    return (<Provider {...store}>

        <div className="work-priority" ref = {workPriority}>
            <Breadcumb
                firstText="事项优先级"
            >
                <WorkPriorityAddmodal
                    name="添加优先级"
                    typeName="优先级"
                    type="add"
                    group="system"
                    addWorkList={addWorkPriorityList}
                    editWorkPriorityList={editWorkPriorityList}
                ></WorkPriorityAddmodal>
            </Breadcumb>
            <div style={{ padding: "20px 0" }}>
                <Table
                    columns={columns}
                    rowKey={(record) => record.id}
                    loading={loading}
                    dataSource={workPrioritylist}
                    pagination={false}
                    scroll={{x: "100%"}}
                />
            </div>
        </div>
    </Provider>

    );
}
export default observer(WorkPriority);