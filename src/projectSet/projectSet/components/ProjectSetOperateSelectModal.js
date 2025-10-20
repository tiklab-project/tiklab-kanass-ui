import {Dropdown, Form, Menu, message, Modal} from "antd";
import React, {useEffect, useState} from "react";
import moment from "moment/moment";
import {withRouter} from "react-router";
import DeleteProjectSetModal from "./DeleteProjectSetModal";
import EditProjectSetModal from "./EditProjectSetModal";
import {PrivilegeButton} from "tiklab-privilege-ui";
import "./ProjectSetOperateSelectModal.scss"

const ProjectSetOperateSelectModal = (props) => {

    const { getPopupContainer, projectSetInfo, projectSetStore  } = props
    const { deleProjectSet, updateProjectSet, findProjectSetPage, getUseList, uselist } = projectSetStore

    const [confirmForm] = Form.useForm();// 删除
    const [form] = Form.useForm();// 修改
    const [deleteModalVisible, setDeleteModalVisible] = useState( false)
    const [editModalVisible, setEditModalVisible] = useState( false)
    const dateFormat = 'YYYY/MM/DD';


    useEffect(() => {
        if (editModalVisible || deleteModalVisible){
            info()
            getUseList().then(res => {
                if (res.code === 0) {
                    console.log(uselist)
                }
            })
        }
        return;
    }, [editModalVisible, deleteModalVisible])

    const info = () => {
        form.setFieldsValue({
            name: projectSetInfo.name,
            remark: projectSetInfo.remark,
            master: projectSetInfo.master.id,
            projectSetLimits: projectSetInfo.projectSetLimits,
            startTime: [moment(projectSetInfo.startTime, dateFormat), moment(projectSetInfo.endTime, dateFormat)]
        })
    };

    const cancel = () => {
        form.setFieldsValue({
            name: projectSetInfo.name,
            remark: projectSetInfo.remark,
            master: projectSetInfo.master.id,
            projectSetLimits: projectSetInfo.projectSetLimits,
            startTime: [moment(projectSetInfo.startTime, dateFormat), moment(projectSetInfo.endTime, dateFormat)]
        })
        setEditModalVisible(false)
    }

    const onFinish = () => {
        form.validateFields().then((values) => {
            const time = values["startTime"]
            const data = {
                ...values,
                startTime: time[0].format("YYYY-MM-DD"),
                endTime: time[1].format("YYYY-MM-DD"),
                master: { id: values.master },
                projectSetLimits: values.projectSetLimits,
                id: projectSetInfo.id
            }

            updateProjectSet(data).then(res => {
                if (res.code === 0) {
                    findProjectSetPage()
                }
                setEditModalVisible(false)
            })

        })
    }


    // 删除确认
    const handleOk = () => {
        deleProjectSet(projectSetInfo.id).then(response => {
            if (response.code === 0) {
                findProjectSetPage()
            }
        })
        setDeleteModalVisible(false);
    };
    // 删除取消
    const handleCancel = () => {
        setDeleteModalVisible(false);
    };

    const selectAction = (value) => {

        if(value.key === "delete"){
            setDeleteModalVisible(true);
        }else if(value.key === "edit") {
            setEditModalVisible(true)
        }

    }

    const moreMenu = () => {
        return <div className="projectSet-dropdown-more">
            <PrivilegeButton code={"project_set_update"}>
                <div onClick={() => setEditModalVisible(true)} className="dropdown-more-item">
                    <svg style={{marginRight:"5px"}} className="icon-16" aria-hidden="true">
                        <use xlinkHref="#icon-edit"></use>
                    </svg>
                    <span>编辑</span>
                </div>
            </PrivilegeButton>
            <PrivilegeButton code={"project_set_delete"}>
                <div onClick={() => setDeleteModalVisible(true)} className="dropdown-more-item">
                    <svg style={{marginRight:"5px"}} className="icon-16" aria-hidden="true">
                        <use xlinkHref="#icon-delete"></use>
                    </svg>
                    <span>删除</span>
                </div>
            </PrivilegeButton>
        </div>
    };

    return (

        <>
            <Dropdown
                overlay={() => moreMenu()}
                placement="bottomLeft"
                trigger="click"
                getPopupContainer = {getPopupContainer ? () => getPopupContainer.current : null}
            >
                <svg style={{
                    width: "22px",
                    height: "22px"
                }} className="projectSet-action-icon" aria-hidden="true">
                    <use xlinkHref="#icon-more-default"></use>
                </svg>

            </Dropdown>

            <DeleteProjectSetModal
                isModalVisible={deleteModalVisible}
                handleOk={handleOk}
                handleCancel={handleCancel}
            />

            <EditProjectSetModal
                form={form}
                editModalVisible={editModalVisible}
                onFinish={onFinish}
                cancel={cancel}
                useList={uselist}
            />

        </>



    );
};

export default withRouter(ProjectSetOperateSelectModal);