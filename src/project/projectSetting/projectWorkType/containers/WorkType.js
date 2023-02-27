import React, { Fragment, useEffect, useState } from "react";
import { Input, Table, Space, message, Row, Col } from "antd";
import WorkTypeAddmodal from "../components/WorkTypeAddModal";
import WorkTypeEditmodal from "../components/WorkTypeEditModal"
import { observer, inject } from "mobx-react";
import Breadcumb from "../../../../common/breadcrumb/Breadcrumb";


const WorkType = (props) => {
    // 初始化
    const { projectWorkStore } = props;
    const { workAllTypeList, findWorkTypeDmList, deleteWorkTypeCustomList, setWorkTypeList } = projectWorkStore;

    const projectId = props.match.params.id;
    useEffect(() => {
        findWorkTypeDmList({projectId: projectId})
        // getFormList()
        return;
    }, []);
    const path = props.match.path.split("/")[2];
    const deleWorkType = (id) => {
        deleteWorkTypeCustomList({id: id}).then(res => {
            if (res.code === 3001) {
                message.error(res.msg);
            }
            if (res.code === 0) {
                message.success(res.data);
                findWorkTypeDmList({projectId: projectId})
            }
        })
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
        props.history.push(`/index/${path}/${projectId}/projectSetDetail/projectFlowDetail/${id}`)
    }

    const goForm = (id) => {
        props.history.push(`/index/${path}/${projectId}/projectSetDetail/projectFormDetail/${id}`)
    }

    const columns = [
        {
            title: "类型名称",
            dataIndex: ["workType","name"],
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
            dataIndex: ["workType","desc"],
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
                    {
                        record.workType.grouper === "custom" && <>
                            <WorkTypeEditmodal
                                name="编辑"
                                id={record.id}
                            >
                                编辑
                            </WorkTypeEditmodal>
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
            <Col lg={{ span: "18", offset: "3" }} xxl={{ span: "14", offset: "4" }}>
                <div className="project-work-type">
                    <Breadcumb
                        firstText="事项类型"
                    >
                        <div className="add-botton">
                            <WorkTypeAddmodal
                                name="添加事件类型"
                                type="add"
                                workAllTypeList = {workAllTypeList}
                            ></WorkTypeAddmodal>
                        </div>
                    </Breadcumb>
                    <div style={{ padding: "20px 0" }}>
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
export default inject("projectWorkStore")(observer(WorkType));