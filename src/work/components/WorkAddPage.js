/*
 * @Descripttion: 事项添加信息页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-01-15 14:34:23
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-25 15:53:16
 */
import React, {useState, useEffect, useImperativeHandle, Fragment, useRef} from "react";
import {Form, Input, Select, DatePicker, message, Checkbox, Table, Tooltip, Space, Upload, Empty} from "antd";
import { observer, inject } from "mobx-react";
import 'moment/locale/zh-cn';
import moment from 'moment';
import { getUser } from "tiklab-core-ui";
import "./WorkAddPage.scss";
import Button from "../../common/button/Button";
import { DocumentEditor, PreviewEditor } from "tiklab-slate-ui";
import { setSessionStorage } from "../../common/utils/setSessionStorage";
import { appendNodeInTree } from "../../project/stagePlan/component/StageListTreeChange";
import ProductModuleStore from "../../product/module/store/ProductModuleStore";
import ModuleStore from "../../project/setting/module/store/ModuleStore";
import ProductStore from "../../product/product/store/ProductStore";
import ProjectSetStore from "../../projectSet/projectSet/store/ProjectSetStore";
import setImageUrl from "../../common/utils/setImageUrl";
import DeleteModal from "../../common/deleteModal/deleteModal";
import InputWithCount from "../../common/inputWithCount/InputWithCount";
import ProjectStore from "../../project/project/store/ProjectStore";
const { Dragger } = Upload;

const { RangePicker } = DatePicker;

const getModuleStore = (path) =>{
    if (path.includes("/product")){
        return ProductModuleStore
    }else {
        return ModuleStore
    }
}
const getProjectStore = (productId) =>{
    if (productId){
        return ProductStore
    }else {
        return ProjectSetStore
    }
}
const WorkAddPage = (props) => {
    const [form] = Form.useForm();
    const path = props.match.path;
    // 全局不一定存在
    const [project, setProject] = useState(JSON.parse(localStorage.getItem("project")));
    const { workStore, workType, workAddPageRef, setShowAddModel, setIsEditStart, handleCancel, stageTreeList } = props;
    const { selectSprintList, userList,
        getModuleList, findSelectSprintList, findStageList, stageList, getSelectUserList, addWork,
        findPriority, priorityList, workId, findFormConfig,
        findFieldList, setWorkId, findWorkItemById, workShowType, getWorkBoardList,
        selectVersionList, findSelectVersionList, workList, total, setTotal, setWorkList, searchCondition,
        findWorkItemCreateMetaData, createWorkAttach
    } = workStore;
    const {moduleList, findModuleList} = getModuleStore(path)

    const projectId = props.match.params.id ? props.match.params.id : null;
    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    const versionId = props.match.params.version ? props.match.params.version : null;
    const productId = props.match.params.productId ? props.match.params.productId : null;
    const projectSetId = props.match.params.projectSetId ? props.match.params.projectSetId : null;
    const productPlanId = props.match.params.productPlanId ? props.match.params.productPlanId : null;

    const {findProjectList} = getProjectStore(productId)
    const [projectList, setProjectList] = useState([])

    // console.log(project)
    const [projectType, setProjectType] = useState(project ? project?.projectType?.type : null);
    const ticket = getUser().ticket;
    const tenant = getUser().tenant;
    const [slateValue, setSlateValue] = useState("[{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]}]");
    const [selectItem, setSelectItem] = useState([]);
    const [loading, setLoading] = useState(false);
    const [createNext, setCreateNext] = useState(false);
    const urlParams = new URLSearchParams(props.history.location.search)
    let workItemType = urlParams.get("workItemType")
    let caseId = urlParams.get("caseId")
    const [editorType, setEditorType] = useState(false);
    const editorRef = useRef(null);
    // 获取选中项目的事项类型id
    const [selectProjectWorkType, setSelectProjectWorkType] = useState(null);

    // 上传附件的信息
    const upload_url = env === "local" ? base_url : "";
    const formRef = useRef();



    useEffect(() => {
        console.log("查看workType", workType)
        form.setFieldsValue({
            planTime: [moment(getNowFormatDate(), dateFormat), moment(getNowFormatDate(), dateFormat)]
        })
        let matchProject = null;
        if (path.includes("/product")){
            findProjectList({productId: productId}).then(res => {
                setProjectList(res.data)
                if (res.data.length > 0){
                    setProject(res.data[0])
                }
            })
        }
        if (path.includes("/projectSet")){
            findProjectList({projectSetId: projectSetId}).then(res => {
                setProjectList(res.data)
                if (res.data.length > 0){
                    setProject(res.data[0])
                }
            })
        }
        // const metaProjectId = projectId;
        // const param = {
        //     projectId: metaProjectId,
        //     workType: workType
        // }
        // findWorkItemCreateMetaData(param).then(res => {
        //
        //     // 事项子类型下拉框
        //     setSelectItem(res.data.fieldList[0][0])
        //     form.setFieldsValue({
        //         eachType: res.data.fieldList[0][0]?.selectItemList[0]?.id,
        //     })
        //
        //
        //
        //     // 设置优先级
        //     form.setFieldsValue({
        //         workPriority: res.data.fieldList[1][0]?.selectItemList[0].id
        //     })
        //
        //     // 设置项目信息
        //     if (project){
        //         form.setFieldsValue({
        //             parentWorkItem: workId,
        //             project: projectId,
        //             sprint: sprintId,
        //             assigner: project?.master.id,
        //             planTime: [moment(getNowFormatDate(), dateFormat), moment(getNowFormatDate(), dateFormat)]
        //         })
        //
        //         // // 设置模块
        //         // form.setFieldsValue({
        //         //     module: res.data.moduleList[0]?.id
        //         // })
        //
        //         // 设置所选版本、迭代、计划
        //         // 敏捷模型
        //         console.log("sprintId:  " + sprintId)
        //         if (projectType === 'scrum'){
        //             if (sprintId) {
        //                 form.setFieldsValue({
        //                     sprint: sprintId
        //                 })
        //             } else {
        //                 if (res.data.sprintList.length > 0) {
        //                     form.setFieldsValue({
        //                         sprint: res.data.sprintList[0]?.id
        //                     })
        //                 } else {
        //                     form.setFieldsValue({
        //                         sprint: null
        //                     })
        //                 }
        //             }
        //         }
        //
        //         // 瀑布模型
        //         if (projectType === 'nomal'){
        //             form.setFieldsValue({
        //                 stage: res.data.stageList[0]?.id
        //             })
        //         }
        //
        //         // 看板模型
        //         if (projectType === 'kanban'){
        //             if (sprintId) {
        //                 form.setFieldsValue({
        //                     sprint: sprintId
        //                 })
        //             } else {
        //                 if (res.data.sprintList.length > 0) {
        //                     form.setFieldsValue({
        //                         sprint: res.data.sprintList[0]?.id
        //                     })
        //                 } else {
        //                     form.setFieldsValue({
        //                         sprint: null
        //                     })
        //                 }
        //             }
        //         }
        //
        //
        //         // 混合模型
        //         if (projectType === 'hybrid'){
        //
        //             if (sprintId) {
        //                 form.setFieldsValue({
        //                     sprint: sprintId
        //                 })
        //             } else {
        //                 if (res.data.sprintList.length > 0) {
        //                     form.setFieldsValue({
        //                         sprint: res.data.sprintList[0]?.id
        //                     })
        //                 } else {
        //                     form.setFieldsValue({
        //                         sprint: null
        //                     })
        //                 }
        //             }
        //
        //             form.setFieldsValue({
        //                 stage: res.data.stageList[0]?.id
        //             })
        //         }
        //
        //         // ipd模型
        //         if (projectType === 'ipd'){
        //             form.setFieldsValue({
        //                 stage: res.data.stageList[0]?.id
        //             })
        //         }
        //
        //         if (projectType !== "nomal" && projectType !== "ipd"){
        //             if (versionId) {
        //                 form.setFieldsValue({
        //                     projectVersion: versionId
        //                 })
        //             } else {
        //                 if (res.data.versionList.length > 0) {
        //                     form.setFieldsValue({
        //                         projectVersion: res.data.versionList[0]?.id
        //                     })
        //                 } else {
        //                     form.setFieldsValue({
        //                         projectVersion: null
        //                     })
        //                 }
        //             }
        //         }
        //     }
        //
        //
        // });
        //
        // if (project?.productId){
        //     findModuleList({ productId: project?.productId }).then(res => {
        //         form.setFieldsValue({
        //             module: res.data[0]?.id
        //         })
        //     });
        // }else{
        //     findModuleList({ projectId: projectId }).then(res => {
        //         form.setFieldsValue({
        //             module: res.data[0]?.id
        //         })
        //     });
        // }
        return;
    }, [projectId, projectSetId, productId])

    useEffect(() => {
        if (project){
            const param = {
                projectId: project.id,
                workType: workType
            }
            findWorkItemCreateMetaData(param).then(res => {

                // 事项子类型下拉框
                setSelectItem(res.data.fieldList[0][0])
                form.setFieldsValue({
                    eachType: res.data.fieldList[0][0]?.selectItemList[0]?.id,
                })



                // 设置优先级
                form.setFieldsValue({
                    workPriority: res.data.fieldList[1][0]?.selectItemList[0].id
                })

                // 设置项目信息

                form.setFieldsValue({
                    parentWorkItem: workId,
                    project: project.id,
                    sprint: sprintId,
                    assigner: project?.master.id,
                    planTime: [moment(getNowFormatDate(), dateFormat), moment(getNowFormatDate(), dateFormat)]
                })

                // // 设置模块
                // form.setFieldsValue({
                //     module: res.data.moduleList[0]?.id
                // })

                // 设置所选版本、迭代、计划
                // 敏捷模型
                console.log("sprintId:  " + sprintId)
                if (projectType === 'scrum'){
                    if (sprintId) {
                        form.setFieldsValue({
                            sprint: sprintId
                        })
                    } else {
                        if (res.data.sprintList.length > 0) {
                            form.setFieldsValue({
                                sprint: res.data.sprintList[0]?.id
                            })
                        } else {
                            form.setFieldsValue({
                                sprint: null
                            })
                        }
                    }
                }

                // 瀑布模型
                if (projectType === 'nomal'){
                    form.setFieldsValue({
                        stage: res.data.stageList[0]?.id
                    })
                }

                // 看板模型
                if (projectType === 'kanban'){
                    if (sprintId) {
                        form.setFieldsValue({
                            sprint: sprintId
                        })
                    } else {
                        if (res.data.sprintList.length > 0) {
                            form.setFieldsValue({
                                sprint: res.data.sprintList[0]?.id
                            })
                        } else {
                            form.setFieldsValue({
                                sprint: null
                            })
                        }
                    }
                }


                // 混合模型
                if (projectType === 'hybrid'){

                    if (sprintId) {
                        form.setFieldsValue({
                            sprint: sprintId
                        })
                    } else {
                        if (res.data.sprintList.length > 0) {
                            form.setFieldsValue({
                                sprint: res.data.sprintList[0]?.id
                            })
                        } else {
                            form.setFieldsValue({
                                sprint: null
                            })
                        }
                    }

                    form.setFieldsValue({
                        stage: res.data.stageList[0]?.id
                    })
                }

                // ipd模型
                if (projectType === 'ipd'){
                    form.setFieldsValue({
                        stage: res.data.stageList[0]?.id
                    })
                }

                if (projectType !== "nomal" && projectType !== "ipd"){
                        if (versionId) {
                            form.setFieldsValue({
                                projectVersion: versionId
                            })
                        } else {
                            if (res.data.versionList.length > 0) {
                                form.setFieldsValue({
                                    projectVersion: res.data.versionList[0]?.id
                                })
                            } else {
                                form.setFieldsValue({
                                    projectVersion: null
                                })
                            }
                        }
                    }



            });

            if (project?.productId){
                findModuleList({ productId: project?.productId }).then(res => {
                    form.setFieldsValue({
                        module: res.data[0]?.id
                    })
                });
            }else{
                findModuleList({ projectId: projectId }).then(res => {
                    form.setFieldsValue({
                        module: res.data[0]?.id
                    })
                });
            }
        }
        return;
    }, [project]);

    const containerRef = useRef(null);
    const [isEditorFocused, setIsEditorFocused] = useState(false);

    const handleMouseEnter = () => {
        setIsEditorFocused(true);
    };

    const handleMouseLeave = () => {
        setIsEditorFocused(false);
    };

    /**
     * 获取不同的事项类型的类型的选项，比如缺陷类型，需求类型
     */
    const getEachWorkType = () => {
        switch (workType.workType.code) {
            case "demand":
            case "epic":
                findFieldList({ code: "demandType" }).then(res => {
                    if (res.code === 0) {
                        setSelectItem(res.data[0])
                        form.setFieldsValue({
                            eachType: res.data[0]?.selectItemList[0]?.id,
                        })
                    }
                })
                break;
            case "task":
                findFieldList({ code: "taskType" }).then(res => {
                    if (res.code === 0) {
                        setSelectItem(res.data[0])
                        form.setFieldsValue({
                            eachType: res.data[0]?.selectItemList[0]?.id,
                        })
                    }
                })
                break;
            case "defect":
                findFieldList({ code: "bugType" }).then(res => {
                    if (res.code === 0) {
                        setSelectItem(res.data[0])
                        form.setFieldsValue({
                            eachType: res.data[0]?.selectItemList[0]?.id,
                        })
                    }
                })
                break;
            default:
                break;
        }
    }

    /**
     * 在项目内添加事项或者选择项目之后， 设置表单初始化值
     * @param {*} project
     */
    const getProjectValue = (project) => {
        const projectId = project.id;
        const projectType = project.projectType.type;
        setProjectType(projectType)
        form.setFieldsValue({
            parentWorkItem: workId,
            project: projectId,
            sprint: sprintId,
            assigner: project?.master.id,
            planTime: [moment(getNowFormatDate(), dateFormat), moment(getNowFormatDate(), dateFormat)]
        })
        // 获取模块
        getModuleList(projectId).then(res => {
            if (res.code === 0) {
                form.setFieldsValue({
                    module: res.data[0]?.id
                })
            }
        })

        // 如果是敏捷试开发，则获取迭代列表
        if (projectType === "scrum" || projectType === "kanban" || projectType === "hybrid") {
            findSelectSprintList(projectId).then(res => {
                if (res.code === 0) {
                    if (sprintId) {
                        form.setFieldsValue({
                            sprint: sprintId
                        })
                    } else {
                        if (res.data.length > 0) {
                            form.setFieldsValue({
                                sprint: res.data[0]?.id
                            })
                        } else {
                            form.setFieldsValue({
                                sprint: null
                            })
                        }
                    }

                }
            })
        }

        // 如果是瀑布式开发，获取计划
        if ((projectType === "nomal" || projectType === "hybrid" || projectType === "ipd")) {
            findStageList({ projectId: projectId }).then(res => {
                if (res.code === 0) {
                    form.setFieldsValue({
                        stage: res.data[0]?.id
                    })

                }
            })
        }

        // 获取版本
        findSelectVersionList(projectId).then(res => {
            if (res.code === 0) {
                if (versionId) {
                    form.setFieldsValue({
                        projectVersion: versionId
                    })
                } else {
                    if (res.data.length > 0) {
                        form.setFieldsValue({
                            projectVersion: res.data[0]?.id
                        })
                    } else {
                        form.setFieldsValue({
                            projectVersion: null
                        })
                    }
                }


            }
        })
        // 获取成员
        getSelectUserList(projectId);
    }


    // 获取自定义表单
    const getForm = (id) => {
        findFormConfig({ id: id })
    }

    // 选择项目
    const selectProject = (value, option) => {

        const param = {
            projectId: option.project.id,
            workType: workType
        }
        findWorkItemCreateMetaData(param).then(res => {

            // 设置选中项目的事项类型id
            setSelectProjectWorkType(res.data.workTypeDm.id)

            // 事项子类型下拉框
            setSelectItem(res.data.fieldList[0][0])
            form.setFieldsValue({
                eachType: res.data.fieldList[0][0]?.selectItemList[0]?.id,
            })



            // 设置优先级
            form.setFieldsValue({
                workPriority: res.data.fieldList[1][0]?.selectItemList[0].id
            })

            // 设置项目信息
            if (option.project){
                setProjectType(option.project.projectType.type)
                form.setFieldsValue({
                    parentWorkItem: workId,
                    project: option.project.id,
                    sprint: sprintId,
                    assigner: res.data.dmUserPage.dataList[0]?.user.id,
                    planTime: [moment(getNowFormatDate(), dateFormat), moment(getNowFormatDate(), dateFormat)]
                })

                // // 设置模块
                // form.setFieldsValue({
                //     module: res.data.moduleList[0]?.id
                // })

                // 设置所选版本、迭代、计划
                // 敏捷模型
                console.log("sprintId:  " + sprintId)
                if (option.project.projectType.type === 'scrum'){
                    if (sprintId) {
                        form.setFieldsValue({
                            sprint: sprintId
                        })
                    } else {
                        if (res.data.sprintList.length > 0) {
                            form.setFieldsValue({
                                sprint: res.data.sprintList[0]?.id
                            })
                        } else {
                            form.setFieldsValue({
                                sprint: null
                            })
                        }
                    }
                }

                // 瀑布模型
                if (option.project.projectType.type === 'nomal'){
                    form.setFieldsValue({
                        stage: res.data.stageList[0]?.id
                    })
                }

                // 看板模型
                if (option.project.projectType.type === 'kanban'){
                    if (sprintId) {
                        form.setFieldsValue({
                            sprint: sprintId
                        })
                    } else {
                        if (res.data.sprintList.length > 0) {
                            form.setFieldsValue({
                                sprint: res.data.sprintList[0]?.id
                            })
                        } else {
                            form.setFieldsValue({
                                sprint: null
                            })
                        }
                    }
                }


                // 混合模型
                if (option.project.projectType.type === 'hybrid'){

                    if (sprintId) {
                        form.setFieldsValue({
                            sprint: sprintId
                        })
                    } else {
                        if (res.data.sprintList.length > 0) {
                            form.setFieldsValue({
                                sprint: res.data.sprintList[0]?.id
                            })
                        } else {
                            form.setFieldsValue({
                                sprint: null
                            })
                        }
                    }

                    form.setFieldsValue({
                        stage: res.data.stageList[0]?.id
                    })
                }

                // ipd模型
                if (option.project.projectType.type === 'ipd'){
                    form.setFieldsValue({
                        stage: res.data.stageList[0]?.id
                    })
                }

                if (option.project.projectType.type !== "nomal" && option.project.projectType.type !== "ipd"){
                    if (versionId) {
                        form.setFieldsValue({
                            projectVersion: versionId
                        })
                    } else {
                        if (res.data.versionList.length > 0) {
                            form.setFieldsValue({
                                projectVersion: res.data.versionList[0]?.id
                            })
                        } else {
                            form.setFieldsValue({
                                projectVersion: null
                            })
                        }
                    }
                }
            }


        });

        if (project?.productId){
            findModuleList({ productId: project?.productId }).then(res => {
                form.setFieldsValue({
                    module: res.data[0]?.id
                })
            });
        }else{
            findModuleList({ projectId: projectId }).then(res => {
                form.setFieldsValue({
                    module: res.data[0]?.id
                })
            });
        }

        // getProjectValue(option.project)
    }

    //提交表单
    const onFinish = () => {
        form.validateFields().then((values) => {
            if (values.title.length > 64) { // 假设标题最大长度为64
                message.error({
                    content: '标题长度不能超过64个字符',
                    className: 'custom-class',
                    style: {
                        marginTop: '20vh',
                    },
                });
                return;
            }

            console.log(values)
            values.builder = getUser().userId;
            values.planBeginTime = values.planTime[0].format('YYYY-MM-DD HH:mm:ss')
            values.planEndTime = values.planTime[1].format('YYYY-MM-DD 23:59:59')
            values.workType = selectProjectWorkType ? selectProjectWorkType : workType.id;
            values.desc = slateValue;
            values.project = projectId ? projectId : values.project;
            values.fieldId = selectItem?.id;

            // 特殊处理，从testhubo点击过来添加缺陷
            if(workItemType&&workItemType==="defect"){
                values.caseId = caseId
            }
            if (productPlanId){
                values.productPlan = productPlanId
            }

            setLoading(true)
            addWork(values).then((res) => {
                setWorkId(res.data)
                for (let attach of attachList) {
                    attach = {
                        ...attach,
                        workItem: {
                            id: res.data
                        }
                    }

                    createWorkAttach(attach)
                }
                // 有bug
                if (res.code === 0) {
                    findWorkItemById(res.data).then(data => {
                        if (data.code === 0) {
                            setSessionStorage("detailCrumbArray", [{ id: data.data.id, code: data.data.code, title: values.title, iconUrl: workType.workType.iconUrl }])
                            if (path === "/project/:id/stagePlan") {
                                appendNodeInTree(stageTreeList, values.stage, data.data)
                                message.success({
                                    content: '添加成功',
                                    className: 'custom-class',
                                    style: {
                                        marginTop: '20vh',
                                    },
                                    duration: 1
                                });

                            } else {
                                if (workShowType === "bodar") {
                                    getWorkBoardList()
                                    message.success({
                                        content: '添加成功',
                                        className: 'custom-class',
                                        style: {
                                            marginTop: '20vh',
                                        },
                                        duration: 1
                                    });
                                } else {
                                    if(workList.length >= searchCondition.pageParam.pageSize){
                                        workList.pop();
                                    }
                                    workList.unshift(data.data);
                                    setWorkList([...workList])
                                    setTotal(total + 1)
                                    message.success({
                                        content: '添加成功',
                                        className: 'custom-class',
                                        style: {
                                            marginTop: '20vh',
                                        },
                                        duration: 1
                                    });
                                }
                            }
                        }
                    })


                    if(workItemType&&workItemType==="defect"){
                        props.history.replace({pathname:props.history.pathname})
                    }
                } else {
                    message.error({
                        content: '添加失败',
                        className: 'custom-class',
                        style: {
                            marginTop: '20vh',
                        },
                    });
                }

                if (createNext){
                    // 继续创建  清空标题和描述
                    form.resetFields(['title']);
                    editorRef.current.clearEditorContent();
                    setSlateValue("[{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]}]");
                }else {
                    setShowAddModel(false)
                }
                setLoading(false)
            })

        })
    };

    const [attachList, setAttachList] = useState([])
    // 上传附件
    const filesParams = {
        name: 'uploadFile',
        multiple: true,
        action: `${upload_url}/dfs/upload`,
        showUploadList: false,
        headers: {
            ticket: ticket,
            tenant: tenant
        },
        onChange(info) {
            const { status } = info.file;
            if (status === 'done') {
                const res = info.file.response;
                const params = {
                    attachId: res.data,
                    attachmentName: info.file.name,
                    attachmentUrl: res.data,
                    type: info.file.type
                }
                setAttachList([...attachList, params])
                message.success(`${info.file.name} 文件上传成功.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} 文件上传失败.`);
            }
        }
    }
    // 文件列表的
    const attachColums = [
        {
            title: '文件',
            dataIndex: 'attachmentName',
            key: 'name',
            width: "30%",
            render: (text, record) => {
                return (
                    record.type.indexOf("image") === -1 ?
                        <a href={setImageUrl("/file/" + record.attachmentUrl)}
                           target="_blank"
                        >
                            {text}
                        </a>
                        :
                        <a href={setImageUrl("/image/" + record.attachmentUrl)}
                           target="_blank"
                        >
                            {text}
                        </a>
                )
            }
        },
        {
            title: '文件类型',
            dataIndex: "type",
            key: 'type',
            width: "10%",
            render: (text, record) => <Tooltip title={record.attachmentName.split('.').pop()}>{record.attachmentName.split('.').pop()}</Tooltip>
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width: "10%",
            render: (text, record) => <Space size="middle">
                <DeleteModal deleteFunction={deleteAttach} id={record.attachId} getPopupContainer={formRef.current} />
            </Space>
        }
    ]

    const deleteAttach = (attachId) => {
        setAttachList(attachList.filter(item => item.attachId !== attachId))
    }

    // 暴露方法给父级组件
    useImperativeHandle(workAddPageRef, () => ({
        submit: onFinish,
        onReset: onReset
    }))

    const onReset = () => {
        form.resetFields();
    };

    // 设置日期选择器格式
    const dateFormat = 'YYYY-MM-DD';
    const getNowFormatDate = () => {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    }

    const [newWorkItem, setNewWorkItem] = useState();

    /**
     * 修改值
     * @param {字段值} changedValues
     */
    const changeWorkItem = (changedValues) => {
        setNewWorkItem({ ...newWorkItem, ...changedValues })
        setIsEditStart(true)
    }

    /**
     * 修改内容
     * @param {内容} value
     */
    const changeDesc = (value) => {
        setSlateValue(value)
        setIsEditStart(true)
    }

    /**
     * 搜索计划关键字
     * @param {搜索关键字} value
     */
    const searchStage = (value) => {
        console.log(value)
        findStageList({ projectId: projectId, stageName: value })
    }

    /**
     * 点击描述，转为可编辑模式
     */
    const switchEditorDesc = () => {
        setEditorType(false)
    }

    // 转换描述编辑模式
    const editorDesc = () => {
        setEditorType(true);
    }
    // 取消编辑描述
    const cancel = () => {
        setEditorType(true);
        // setSlateValue(workInfo.desc)
    }

    return (
        <Fragment>
            <div className="work-add-page">
                <div className="work-add-page-content">
                    <div className="work-add-page-title">添加{workType.workType.name}</div>
                    <div className="work-add-page-form">
                        <div className="left">
                            <Form
                                initialValues={{ remember: true }}
                                form={form}
                                className="work-add-form"
                                layout="vertical"
                                labelAlign="right"
                                onValuesChange={(changedValues, allValues) => changeWorkItem(changedValues)}
                            >
                                <Form.Item
                                    label="标题"
                                    name="title"
                                    rules={[{ required: true, message: '请输入事项标题!' }]}
                                    // getValueFromEvent={(event) => event.target.value}
                                >
                                    {/*<Input showCount maxLength={64} placeholder="请输入事项标题" />*/}
                                    <InputWithCount maxLength={64} placeholder="请输入事项标题" />
                                </Form.Item>

                                <Form.Item
                                    label="描述"
                                >
                                    {
                                        <div className="work-desc">
                                            <div
                                                ref={containerRef}
                                                onMouseEnter={handleMouseEnter}
                                                onMouseLeave={handleMouseLeave} className="work-item-desc" style={{ width: "100%", border: " #f0f0f0 solid 1px" }}>
                                                <DocumentEditor
                                                    ref={editorRef}
                                                    focusEditor={true}
                                                    value={slateValue}
                                                    onChange={(value) => changeDesc(value)}
                                                    minHeight={150}
                                                    ticket={ticket}
                                                    tenant={tenant}
                                                    base_url={base_url}
                                                    viewImageUrl = "/image"
                                                    img_url = {base_url === '/' ? '' : base_url}
                                                    maxHeight={150}
                                                    {...props}
                                                />
                                            </div>
                                        </div>
                                    }
                                </Form.Item>

                                <Form.Item
                                    label={"附件"}
                                >
                                    <Fragment>
                                        <div ref={formRef}>
                                            {
                                                attachList && attachList.length > 0 && (
                                                    <Fragment>
                                                        <Table columns={attachColums}
                                                               dataSource={attachList}
                                                               pagination={false}
                                                               bordered={false}
                                                               rowKey={(record) => record.attachId}
                                                               scroll={{x: "100%"}}
                                                               locale={{
                                                                   emptyText: <Empty
                                                                       imageStyle={{height: 100}}
                                                                       description={<span>暂无数据</span>}
                                                                   />
                                                               }}
                                                        />
                                                    </Fragment>
                                                )
                                            }
                                        </div>
                                        <div className="work-detail-upload">
                                            <Dragger className="work-detail-upload" {...filesParams}>
                                                <p className="ant-upload-drag-icon">
                                                    <svg className="icon-20" aria-hidden="true">
                                                        <use xlinkHref="#icon-uploadImg-gray"></use>
                                                    </svg>上传附件
                                                </p>
                                            </Dragger>
                                        </div>
                                    </Fragment>
                                </Form.Item>
                            </Form>
                        </div>
                        <div className="right">
                            <Form
                                initialValues={{ remember: true }}
                                form={form}
                                className="work-add-form"
                                layout="vertical"
                                labelAlign="right"
                                onValuesChange={(changedValues, allValues) => changeWorkItem(changedValues)}
                            >
                                {
                                    (path.includes("/projectSet") || path.includes("/product") || path === "/worklist" || path === "/workbodar") &&
                                    <Form.Item
                                        label="所属项目"
                                        name="project"
                                        rules={[{ required: true, message: '请输入!' }]}
                                        bordered={false}
                                    >
                                        <Select
                                            bordered={false}
                                            style={{backgroundColor: '#f0f0f0'}}
                                            placeholder="项目"
                                            allowClear
                                            className="work-select"
                                            key="selectProject"
                                            onSelect={selectProject}
                                        >
                                            {
                                                projectList && projectList.map((item) => {
                                                    return <Select.Option project={item} value={item.id} key={item.id}>{item.projectName}</Select.Option>
                                                })
                                            }
                                        </Select>
                                    </Form.Item>
                                }
                                {
                                    selectItem &&
                                    <Form.Item
                                        label={selectItem?.name || "事项类型"}
                                        name="eachType"
                                        // wrapperCol={{
                                        //     span: 10,
                                        // }}
                                    >
                                        <Select
                                            bordered={false}
                                            style={{backgroundColor: '#f0f0f0'}}
                                            placeholder="无"
                                            className="work-select"
                                            key="selectEachType"
                                            allowClear
                                        >
                                            {
                                                selectItem && selectItem?.selectItemList?.map((item) => {
                                                    return <Select.Option value={item.id} key={item.id}>
                                                        <img
                                                            src={('images/project1.png')}
                                                            alt=""
                                                            className="img-icon-right"
                                                        />
                                                        {item.name}
                                                    </Select.Option>
                                                })
                                            }
                                        </Select>
                                    </Form.Item>
                                }
                                <Form.Item
                                    label="优先级"
                                    name="workPriority"
                                    rules={[{ required: false, message: '请输入优先级!' }]}
                                    // wrapperCol={{
                                    //     span: 10,
                                    // }}
                                >
                                    <Select
                                        bordered={false}
                                        style={{backgroundColor: '#f0f0f0'}}
                                        placeholder="优先级"
                                        allowClear
                                        className="work-select"
                                        key="selectWorkPriority"
                                    >
                                        {
                                            priorityList && priorityList.map((item) => {
                                                return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label="负责人"
                                    name="assigner"
                                    rules={[{ required: true, message: '请输入负责人!' }]}
                                    // wrapperCol={{
                                    //     span: 10,
                                    // }}
                                >
                                    <Select
                                        bordered={false}
                                        style={{backgroundColor: '#f0f0f0'}}
                                        placeholder="负责人"
                                        className="work-select"
                                        key="selectWorkUser"
                                        showSearch
                                    >
                                        {
                                            userList && userList.map((item) => {
                                                return <Select.Option value={item.user?.id} key={item.user?.id}>{item.user?.nickname ? item.user?.nickname : item.user?.name}</Select.Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="planTime"
                                    label="计划日期"
                                    // wrapperCol={{
                                    //     span: 10,
                                    // }}
                                >
                                    <RangePicker />
                                </Form.Item>

                                <Form.Item
                                    label="所属模块"
                                    name="module"
                                    rules={[{ required: false, message: '请输入所属模块!' }]}
                                >
                                    <Select
                                        bordered={false}
                                        style={{backgroundColor: '#f0f0f0'}}
                                        placeholder="模块"
                                        allowClear
                                        className="work-select"
                                        key="selectModule"
                                    >
                                        {
                                            moduleList && moduleList.map((item) => {
                                                return <Select.Option value={item.id} key={item.id}>{item.moduleName}</Select.Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                                {
                                    (projectType === "nomal" || projectType === "ipd" || projectType === "hybrid") && <Form.Item
                                        label="所属阶段"
                                        name="stage"
                                        rules={[{ required: true, message: '请输入所属阶段!' }]}
                                    >
                                        <Select
                                            bordered={false}
                                            style={{backgroundColor: '#f0f0f0'}}
                                            placeholder="阶段"
                                            allowClear
                                            className="work-select"
                                            key="selectSprint"
                                            onSearch={searchStage}
                                            showSearch
                                        >
                                            {
                                                stageList && stageList.map((item) => {
                                                    return <Select.Option value={item.id} key={item.id}>{item.stageName}</Select.Option>
                                                })
                                            }
                                        </Select>
                                    </Form.Item>
                                }
                                {
                                    (projectType === "scrum" || projectType === "kanban" || projectType === "hybrid") && <Form.Item
                                        label="所属迭代"
                                        name="sprint"
                                        rules={[{ required: false, message: '请输入所属迭代!' }]}
                                    >
                                        <Select
                                            bordered={false}
                                            style={{backgroundColor: '#f0f0f0'}}
                                            placeholder="迭代"
                                            allowClear
                                            className="work-select"
                                            key="selectSprint"
                                        >
                                            {
                                                selectSprintList && selectSprintList.map((item) => {
                                                    return <Select.Option value={item.id} key={item.id}>{item.sprintName}</Select.Option>
                                                })
                                            }
                                        </Select>
                                    </Form.Item>
                                }

                                {
                                    (projectType !== "nomal" && projectType !== "ipd") &&
                                    <Form.Item
                                        label="所属版本"
                                        name="projectVersion"
                                        rules={[{ required: false, message: '请输入所属版本!' }]}
                                    >
                                        <Select
                                            placeholder="版本"
                                            allowClear
                                            className="work-select"
                                            key="selectProjectVersion"
                                        >
                                            {
                                                selectVersionList && selectVersionList.map((item) => {
                                                    return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                                })
                                            }
                                        </Select>
                                    </Form.Item>
                                }

                                <Form.Item
                                    name="planTakeupTime"
                                    label="计划用时"
                                    hidden={true}
                                >
                                    <Input suffix="小时" type="number" className="" />
                                </Form.Item>
                            </Form>
                        </div>
                    </div>

                    <div className="work-add-button">
                        <Checkbox style={{marginRight: "auto"}} onChange={() => setCreateNext(!createNext)}>继续创建下一条</Checkbox>
                        <Button loading={loading} type="primary" onClick={() => onFinish()}>创建</Button>
                        <Button onClick={() => handleCancel()}>取消</Button>
                    </div>
                </div>
            </div>
        </Fragment >
    )
}
export default inject("workStore")(observer(WorkAddPage));
