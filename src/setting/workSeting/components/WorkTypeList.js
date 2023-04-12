import React, { Fragment, useEffect, useState } from "react";
import { Input, Table, Space, message, Row, Col } from "antd";
import WorkTypeAddmodal from "./WorkTypeAddModal";
import { observer, inject } from "mobx-react";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
const { Search } = Input;


const WorkTypeList = (props) => {
    // 初始化
    const { orgaStore } = props;
    const { workAllTypeList, getAllWorkTypeList, addCustomWorkTypeList, findWorkTypeListById,
        editWorkTypeList, deleteWorkTypeCustomList, setWorkTypeList, fromList,
        getFormList, flowList, getFlowList, creatIcon, findIconList
    } = orgaStore;

    useEffect(() => {
        getAllWorkTypeList()
        getFormList()
        return;
    }, []);

    const deleWorkType = (id) => {
        deleteWorkTypeCustomList(id).then(res => {
            if (res.code === 3001) {
                message.error(res.msg);
            }
            if (res.cdoe === 0) {
                message.success(res.data);
            }
        })
    }

    const onSearch = (value) => {
        getAllWorkTypeList({ grouper: "custom", name: value })
    }

    //上移
    const upWorkType = (id) => {
        const newList = workAllTypeList
        const index = workAllTypeList.findIndex((item) => {
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
        const newList = workAllTypeList
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
        // props.history.push("/index/setting/systemFlow")
        props.history.push(`/index/setting/flowDetail/${id}`)
    }

    const goForm = (id) => {
        props.history.push(`/index/setting/projectFormDetail/${id}`)
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
            title: '使用到的项目',
            dataIndex: 'useNumber',
            key: 'flow',
            render: (text, record) => <div onClick={() => goFlow(record.flow.id)} className="span-botton">{text}个项目</div>
        },
        {
            title: "操作",
            key: "action",
            align: "left",
            width: '20%',
            render: (text, record) => (
                <Space size="middle">
                    {
                        record.grouper === "custom" && <>
                            <WorkTypeAddmodal
                                name="编辑"
                                type="edit"
                                id={record.id}
                                addWorkTypeList={addCustomWorkTypeList}
                                editWorkList={editWorkTypeList}
                                findWorkListById={findWorkTypeListById}
                                fromList={fromList}
                                getFormList={getFormList}
                                flowList={flowList}
                                getFlowList={getFlowList}
                                creatIcon={creatIcon}
                                findIconList={findIconList}
                            // grouper="custom"
                            >
                                编辑
                            </WorkTypeAddmodal>
                            <svg
                                className="svg-icon" aria-hidden="true"
                                style={{ cursor: "pointer" }}
                                onClick={() => deleWorkType(record.id)}
                            >
                                <use xlinkHref="#icon-delete"></use>
                            </svg>


                        </>
                    }
                    <svg
                        className="svg-icon" aria-hidden="true"
                        style={{ cursor: "pointer" }}
                        onClick={() => upWorkType(record.id)}
                    >
                        <use xlinkHref="#icon-totop"></use>
                    </svg>

                    <svg
                        className="svg-icon" aria-hidden="true"
                        style={{ cursor: "pointer" }}
                        onClick={() => downWorkType(record.id)}
                    >
                        <use xlinkHref="#icon-todown"></use>
                    </svg>
                </Space>
            ),
        },
    ];

    return (
        <Row>
            <Col lg={{  span: "18", offset: "3" }} xxl={{ span: "14", offset: "4" }}>
                <div className="work-type">
                    {/* <Breadcumb
                        firstText="事项类型管理"
                        secondText="事项类型列表"
                    /> */}
                    <Breadcumb
                        firstText="事项类型"
                    >
                        <div className="add-botton">
                            <WorkTypeAddmodal
                                name="添加事件类型"
                                type="add"
                                addWorkTypeList={addCustomWorkTypeList}
                                fromList={fromList}
                                getFormList={getFormList}
                                flowList={flowList}
                                getFlowList={getFlowList}
                                creatIcon={creatIcon}
                                findIconList={findIconList}
                                bottonType="primary"
                            // grouper="custom"
                            ></WorkTypeAddmodal>
                        </div>
                    </Breadcumb>
                    <div style={{ padding: "20px 0" }}>
                        {/* <div className="work-type-search-add">
                            <Search
                                placeholder="模板名称"
                                allowClear
                                onSearch={onSearch}
                                style={{ width: 200 }}
                            />

                        </div> */}
                        <Table
                            columns={columns}
                            rowKey={(record) => record.id}
                            loading={loading}
                            dataSource={workAllTypeList}
                            pagination={false}
                        />
                    </div>
                </div>
            </Col>
        </Row>
    );
};
export default inject("orgaStore")(observer(WorkTypeList));