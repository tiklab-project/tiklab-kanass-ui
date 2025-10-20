import {Dropdown, Form, Menu, message, Modal} from "antd";
import React, {useEffect, useState} from "react";
import DeleteProjectModal from "./DeleteProjectModal";
import moment from "moment/moment";
import ProjectBasicInfoStore from "../../setting/basicInfo/store/ProjectBasicInfoStore";
import EditProjectModal from "./EditProjectModal";
import {withRouter} from "react-router";
import {PrivilegeButton} from "tiklab-privilege-ui";
import "./ProjectOperateSelectModal.scss"

const ProjectOperateSelectModal = (props) => {

    const { getPopupContainer, projectInfo, projectStore } = props
    const {deleproList, updateProject, searchpro, projectTypelist, getProjectTypeList, findProjectPage} = projectStore;
    const {findDmUserList} = ProjectBasicInfoStore;


    const [confirmForm] = Form.useForm();// 删除
    const [form] = Form.useForm();// 修改
    const [deleteModalVisible, setDeleteModalVisible] = useState( false)
    const [editModalVisible, setEditModalVisible] = useState( false)
    const dateFormat = 'YYYY/MM/DD';

    const projectLimits = [
        {
            name: "公共项目",
            id: "0"
        },
        {
            name: "私密项目",
            id: "1"
        }
    ]

    // 状态类型
    const status = [
        {
            name: "未开始",
            id: "1"
        },
        {
            name: "进行中",
            id: "2"
        },
        {
            name: "已结束",
            id: "3"
        }
    ]

    // 周期
    const rangeConfig = {
        rules: [
            {
                type: 'array',
                required: true,
                message: '请选择计划时间',
            }
        ]
    };

    const [dmUser, setDmUser] = useState([])
    const [loading,setLoading] = useState( false)

    useEffect(() => {

        if (deleteModalVisible || editModalVisible){
            info()
            getProjectTypeList()
            findDmUserList({domainId : projectInfo.id}).then(res=> {
                if(res.code === 0){
                    setDmUser(res.data)
                }
            })
        }
        return;
    }, [deleteModalVisible, editModalVisible])
    const info = () => {
        setLoading(true)
        searchpro(projectInfo.id).then((response) => {
            const time = response["startTime"]
            if (response.code === 0) {
                const data = response.data;
                // setProjectInfo(data)
                // setIconUrl(data.iconUrl)
                form.setFieldsValue({
                    projectName: data.projectName,
                    projectType: data.projectType.id,
                    desc: data.desc,
                    projectState: data.projectState,
                    master: data.master.id,
                    projectLimits: data.projectLimits,
                    startTime: [moment(data.startTime, dateFormat), moment(data.endTime, dateFormat)]
                })
            }
            setLoading( false)

        })
    };

    // 修改确认
    const onFinish = () => {
        form.validateFields().then((values) => {
            const time = values["startTime"]
            const data = {
                ...values,
                startTime: time[0].format("YYYY-MM-DD"),
                endTime: time[1].format("YYYY-MM-DD"),
                master: {id: values.master},
                projectType: {
                    id: values.projectType
                },
                projectLimits: values.projectLimits,
                id: projectInfo.id
            }
            updateProject(data).then(res => {
                if (res.code === 0) {
                    message.success("修改成功");
                    setEditModalVisible(false)
                    findProjectPage()
                }
            })
        }).catch((errorInfo) => {
            // 显示具体错误信息
            if (errorInfo.errorFields){
                console.log("表单验证失败",errorInfo.errorFields);
            }else {
                message.error(`编辑失败，请检查网络连接：${errorInfo}`);
            }
        });
    };

    const cancel = () => {
        form.setFieldsValue({
            projectName: projectInfo.projectName,
            projectType: projectInfo.projectType.id,
            desc: projectInfo.desc,
            projectState: projectInfo.projectState,
            master: projectInfo.master.id,
            projectLimits: projectInfo.projectLimits,
            startTime: [moment(projectInfo.startTime, dateFormat), moment(projectInfo.endTime, dateFormat)]
        })
        setEditModalVisible(false);
    }

    // 删除确认
    const handleOk = () => {
        confirmForm.validateFields().then((fieldsValue) => {
            deleproList(projectInfo.id).then(response => {
                if (response.code === 0) {
                    message.success('删除成功');
                    setDeleteModalVisible(false);
                    findProjectPage()
                }
            }).catch((error) => {
                console.error("Error deleting project:", error);
            });
        }).catch((errorInfo) => {
            // 验证失败时的处理
            console.error("Validation failed:", errorInfo);
        });
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
        return <div className="project-dropdown-more">
            {
                projectInfo.updatePermission &&
                <div onClick={() => setEditModalVisible(true)} className="dropdown-more-item">
                    <svg style={{marginRight:"5px"}} className="icon-16" aria-hidden="true">
                        <use xlinkHref="#icon-edit"></use>
                    </svg>
                    <span>编辑</span>
                </div>
            }
            {
                projectInfo.deletePermission &&
                <div onClick={() => setDeleteModalVisible(true)} className="dropdown-more-item">
                    <svg style={{marginRight:"5px"}} className="icon-16" aria-hidden="true">
                        <use xlinkHref="#icon-delete"></use>
                    </svg>
                    <span>删除</span>
                </div>
            }
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
                }} className="operate-icon" aria-hidden="true">
                    <use xlinkHref="#icon-more-default"></use>
                </svg>

            </Dropdown>

            <DeleteProjectModal
                isModalVisible={deleteModalVisible}
                handleOk={handleOk}
                handleCancel={handleCancel}
                confirmForm={confirmForm}
                projectInfo={projectInfo}
            />

            <EditProjectModal
                modalVisible={editModalVisible}
                onFinish={onFinish}
                cancel={cancel}
                form={form}
                projectInfo={projectInfo}
                projectTypeList={projectTypelist}
                projectLimits={projectLimits}
                status={status}
                dmUser={dmUser}
                rangeConfig={rangeConfig}
                loading={loading}
            />
        </>



    );
};

export default withRouter(ProjectOperateSelectModal);