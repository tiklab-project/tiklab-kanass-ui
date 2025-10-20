import React, { Fragment, useEffect, useRef, useState } from "react";
import {Table, Space, message, Row, Col, Empty} from "antd";
import WorkTypeAddmodal from "./WorkTypeAddModal";
import { observer, inject, Provider } from "mobx-react";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import WorkSetingStore from "../store/WorkSetingStore"
import {getUser, getVersionInfo} from "tiklab-core-ui";
import DeleteModal from "../../../common/deleteModal/deleteModal";
import ImgComponent from "../../../common/imgComponent/ImgComponent";
import WorkTypeFree from "./WorkTypeFree";
import {PrivilegeButton} from "tiklab-privilege-ui";
import EnhanceEntranceCloseModal from "../../../common/enhanceEntrance/EnhanceEntranceCloseModal";

const WorkTypeList = (props) => {
    const store = {
        workSetingStore: WorkSetingStore
    }
    const { workAllTypeList, getAllWorkTypeList, deleteWorkTypeCustomList, setWorkTypeList,
    } = WorkSetingStore;
    const versionInfo = getVersionInfo();
    const [visibleFree, setVisibleFree] = useState(false);
    const tenant = getUser().tenant;
    const [formIds, setFormIds] = useState([])
    useEffect(() => {
        getAllWorkTypeList().then(res => {
            if(res.code === 0){
                const data = res.data;
                data.map(item => {
                    const formId = item.form.id;
                    formIds.push(formId)
                })
                setFormIds(formIds);
            }
        })
        // getFormList()
        return;
    }, []);

    const deleWorkType = (id) => {
        if (versionInfo?.expired === true){
            setVisibleFree(true);
        }else {
            deleteWorkTypeCustomList(id).then(res => {
                if (res.code === 3001) {
                    message.error(res.msg);
                }
                if (res.cdoe === 0) {
                    message.success(res.data);
                }
            })
        }

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
    const goFlow = (id, grouper) => {
        // props.history.push("/setting/systemFlow")
        if (grouper === "custom" && versionInfo?.expired === true){
            setVisibleFree(true);
        }else {
            props.history.push(`/setting/flowDetailDesign/${id}`)
        }

    }

    const goForm = (id, grouper) => {
        if (grouper === "custom" && versionInfo?.expired === true){
            setVisibleFree(true);
        }else {
            props.history.push(`/setting/FormDetail/${id}`)
        }
    }

    const viewPrivilege = (record) => {
        props.history.push({pathname:`/setting/workPrivilegeRoleList/${record.id}`});
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
                            className="icon-20"
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
            render: (text, record) => {
                return(
                    <PrivilegeButton code={"work_type_update_flow"} {...props}>
                        <div onClick={() => goFlow(record.flow.id, record.grouper)} className="span-botton">流程配置</div>
                    </PrivilegeButton>
                )
            }
        },
        {
            title: '表单',
            dataIndex: ['form', 'name'],
            key: 'form',
            render: (text, record) => {
                return (
                    <PrivilegeButton code={"work_type_update_form"} {...props}>
                        <div onClick={() => goForm(record.form.id, record.grouper)} className="span-botton">表单配置</div>
                    </PrivilegeButton>
                )
            }
        },
        {
            title: '权限',
            dataIndex: 'useNumber',
            key: 'flow',
            render: (text, record) => {
                return(
                    <PrivilegeButton code={"work_type_update_permissions"} {...props}>
                        <div onClick={() => viewPrivilege(record)} className="span-botton">权限配置</div>
                    </PrivilegeButton>
                )
            }
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
            render: (text, record) => (
                <Space size="middle">

                    {/* <svg
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
                    </svg> */}
                    {
                        record.grouper === "custom" ? <>
                            <PrivilegeButton code={"work_type_update"} {...props}>
                                <WorkTypeAddmodal
                                    name="编辑"
                                    type="edit"
                                    id={record.id}
                                    grouper="custom"
                                    visibleFree={visibleFree}
                                    setVisibleFree={setVisibleFree}
                                >
                                    编辑
                                </WorkTypeAddmodal>
                            </PrivilegeButton>
                            <PrivilegeButton code={"work_type_delete"} {...props}>
                                <DeleteModal deleteFunction={deleWorkType} id={record.id} getPopupContainer={workType.current} />
                            </PrivilegeButton>



                        </>
                        :
                        <div>---</div>
                    }
                    
                </Space>
            ),
        },
    ];
    const workType = useRef(null)
    return (<Provider {...store}>
        <div className="work-type" ref={workType}>
            <Breadcumb
                firstText="事项类型"
            >
                <div className="add-botton">
                    <PrivilegeButton code={"work_type_add"} {...props}>
                        <WorkTypeAddmodal
                            name="添加事项类型"
                            type="add"
                            grouper="custom"
                            bottonType="primary"
                            formIds = {formIds}
                            visibleFree={visibleFree}
                            setVisibleFree={setVisibleFree}
                        ></WorkTypeAddmodal>
                    </PrivilegeButton>
                </div>
            </Breadcumb>
            <div style={{ padding: "20px 0" }}>
                <Table
                    columns={columns}
                    rowKey={(record) => record.id}
                    loading={loading}
                    dataSource={workAllTypeList}
                    pagination={false}
                    scroll={{x: "100%"}}
                    locale={{
                        emptyText: <Empty
                            imageStyle={{height: 100}}
                            description={<span>暂无数据</span>}
                        />
                    }}
                />
            </div>
        </div>
        <EnhanceEntranceCloseModal
            config={{title:"自定义事项类型", desc:"自定义你的事项，以及响应的流程和表单"}}
            enhanceModal={visibleFree} setEnhanceModal={setVisibleFree}
        />
    </Provider>

    );
};
export default observer(WorkTypeList);