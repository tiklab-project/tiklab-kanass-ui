import React, { Fragment, useEffect, useState } from "react";
import { Input, Table, Space, message, Row, Col } from "antd";
import WorkTypeAddmodal from "./WorkTypeAddModal";
import { observer, inject, Provider } from "mobx-react";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import WorkSetingStore from "../store/WorkSetingStore"
import { getUser } from "tiklab-core-ui";
import ImgComponent from "../../../common/imgComponent/ImgComponent";

const WorkTypeSystem = (props) => {
    const store = {
        workSetingStore: WorkSetingStore
    }
    const { workSystemTypeList, getSystemWorkTypeList,
        addSystemWorkTypeList, findWorkTypeListById,
        editWorkTypeList, deleteWorkTypeSystemList, setWorkTypeList, fromList,
        getFormList, flowList, getFlowList, creatIcon, findIconList
    } = WorkSetingStore;

    const tenant = getUser().tenant;
    useEffect(() => {
        getSystemWorkTypeList({ grouper: "system" })
        // getFormList()
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
        props.history.push("/setting/flowDetailDesign/" + id)
    }

    const goForm = (id) => {
        props.history.push("/setting/FormDetailSys/" + id)
    }

    const columns = [
        {
            title: "类型名称",
            dataIndex: "name",
            key: "name",
            render: (text, record) => (
                <div className="work-type-name" >
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
            title: '流程',
            dataIndex: ['flow', 'name'],
            key: 'flow',
            render: (text, record) => <div onClick={() => goFlow(record.flow.id)} className="span-botton">流程配置</div>
        },
        {
            title: '表单',
            dataIndex: ['form', 'name'],
            key: 'form',
            render: (text, record) => <div onClick={() => goForm(record.form.id)} className="span-botton">表单配置</div>
        },
        {
            title: '权限',
            dataIndex: 'useNumber',
            key: 'flow',
            render: (text, record) => <div onClick={() => viewPrivilege(record)} className="span-botton">权限配置</div>
        },
        {
            title: '使用到的项目',
            dataIndex: 'useNumber',
            key: 'flow',
            render: (text, record) => <div>{text}个项目</div>
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

    return (<Provider {...store}>
        <Row>
            <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
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
                                bottonType="dashed"
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
                            scroll={{ x: "100%" }}
                        />
                    </div>
                </div>
            </Col>
        </Row>
    </Provider>

    );
};
export default observer(WorkTypeSystem);