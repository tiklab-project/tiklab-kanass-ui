import React, { Fragment, useEffect, useState } from "react";
import { Input, Table, Space, message, Row, Col } from "antd";
import WorkTypeAddmodal from "./WorkTypeAddModal";
import { observer, inject } from "mobx-react";
import { getUser } from 'tiklab-core-ui';
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";

const { Search } = Input;


const WorkTypeSystem = (props) => {
    // 初始化
    const { orgaStore } = props;
    const { workSystemTypeList, getSystemWorkTypeList,
        addSystemWorkTypeList, findWorkTypeListById,
        editWorkTypeList, deleteWorkTypeSystemList, setWorkTypeList, fromList,
        getFormList, flowList, getFlowList, creatIcon, findIconList
    } = orgaStore;
    useEffect(() => {
        getSystemWorkTypeList({grouper: "system"})
        getFormList()
        return;
    }, []);

    const deleWorkType = (id) => {
        deleteWorkTypeSystemList(id).then(res => {
            if (res.code === 3001) {
                message.error(res.msg);
            }
            if (res.cdoe === 0) {
                message.success(res.data);
            }
        })
    }


  

    //上移
    const upWorkType = (id) => {
        const newList = workSystemTypeList
        const index = workSystemTypeList.findIndex((item) => {
            return item.id === id
        })
        if (index === 0) {
            message.warning('已是最高了！');
        } else {
            const newItem = newList[index]
            newList[index] = newList[index - 1]
            newList[index - 1] = newItem
            setWorkTypeList(newList)
        }

    }

    // 下移
    const downWorkType = (id) => {
        const newList = workSystemTypeList
        const index = newList.findIndex((item) => {
            return item.id === id
        })
        console.log(newList.length)
        if (index === newList.length - 1) {
            message.warning('已是最低了！');
        } else {
            const newItem = newList[index]
            newList[index] = newList[index + 1]
            newList[index + 1] = newItem
            setWorkTypeList(newList)
        }

    }

    const [loading, setLoading] = useState(false)
    const goFlow = (id) => {
        props.history.push("/index/organ/workTypeFlow/" + id)
    }

    const goForm = (id) => {
        props.history.push("/index/organ/workTypeForm/" + id)
    }

    const columns = [
        {
            title: "类型名称",
            dataIndex: "name",
            key: "name",
            render: (text, record) => (
                <div className="work-type-name" >
                    <div className="work-type-icon">
                        {
                            record.iconUrl ?
                                <img
                                    src={('/images/' + record.iconUrl)}
                                    alt=""
                                    className="img-icon"
                                />
                                :
                                <img
                                    src={('images/workType1.png')}
                                    alt=""
                                    className="img-icon"
                                />
                        }
                    </div>
                    <div className="work-type-text">{text}</div>
                </div>
            )
        },
        {
            title: "描述",
            dataIndex: "desc",
            key: "desc",
        },
        {
            title: '表单配置',
            dataIndex: ['form', 'name'],
            key: 'form',
            render: (text, record) => <div onClick={() => goForm(record.form.id)} className="span-botton">{text}</div>,
        },
        {
            title: '流程配置',
            dataIndex: ['flow', 'name'],
            key: 'flow',
            render: (text, record) => <div onClick={() => goFlow(record.flow.id)} className="span-botton">{text}</div>
        },
        {
            title: "操作",
            key: "action",
            align: "left",
            width: '20%',
            render: (text, record) => (
                <Space size="middle">
                    <WorkTypeAddmodal
                        name="编辑"
                        type="edit"
                        id={record.id}
                        addWorkTypeList={addSystemWorkTypeList}
                        editWorkList={editWorkTypeList}
                        findWorkListById={findWorkTypeListById}
                        fromList={fromList}
                        getFormList={getFormList}
                        flowList={flowList}
                        getFlowList={getFlowList}
                        creatIcon={creatIcon}
                        findIconList={findIconList}
                        grouper="system"
                    >
                        编辑
                    </WorkTypeAddmodal>
                    {/* <Button
                        type="link"
                        onClick={() => deleWorkType(record.id)}
                    >
                        删除
                    </Button> */}
                    <svg 
                        className="svg-icon" aria-hidden="true" 
                        style={{ cursor: "pointer", marginRight: "16px" }}
                        onClick={() => deleWorkType(record.id)}
                    >
                        <use xlinkHref="#icon-delete"></use>
                    </svg>

                    <svg 
                        className="svg-icon" aria-hidden="true" 
                        style={{ cursor: "pointer", marginRight: "16px" }}
                        onClick={() => upWorkType(record.id)}
                    >
                        <use xlinkHref="#icon-totop"></use>
                    </svg>

                    <svg 
                        className="svg-icon" aria-hidden="true" 
                        style={{ cursor: "pointer", marginRight: "16px" }}
                        onClick={() => downWorkType(record.id)}
                    >
                        <use xlinkHref="#icon-todown"></use>
                    </svg>

                    {/* <Button
                        type="link"
                        onClick={() => upWorkType(record.id)}
                    >
                        上移
                    </Button> */}
                    {/* <Button
                        type="link"
                        onClick={() => downWorkType(record.id)}
                    >
                        下移
                    </Button> */}
                </Space>
            ),
        },
    ];

    return (
        <Row>
            <Col lg={{ span: 24 }} xxl={{ span: "18", offset: "3" }}>
                <div className="work-type">
                    <Breadcumb
                        firstText="事项类型"
                    >
                        <div className="add-botton">
                            <WorkTypeAddmodal
                                name="添加系统事件类型"
                                type="add"
                                grouper="system"
                                addWorkTypeList={addSystemWorkTypeList}
                                fromList={fromList}
                                getFormList={getFormList}
                                flowList={flowList}
                                getFlowList={getFlowList}
                                creatIcon={creatIcon}
                                findIconList={findIconList}
                                className="111"
                                bottonType = "dashed"
                                style={{ marginRight: "10px" }}
                            ></WorkTypeAddmodal>
                            
                        </div>
                    </Breadcumb>
                    <div style={{ padding: "20px 0" }}>
                        {/* <div className="work-type-search-add">
                            <Search
                                placeholder="类型名称"
                                allowClear
                                onSearch={onSearch}
                                style={{ width: 200 }}
                            />

                        </div> */}
                        <Table
                            columns={columns}
                            rowKey={(record) => record.id}
                            loading={loading}
                            dataSource={workSystemTypeList}
                            pagination={false}
                        />
                    </div>
                </div>
            </Col>
        </Row>
    );
};
export default inject("orgaStore")(observer(WorkTypeSystem));