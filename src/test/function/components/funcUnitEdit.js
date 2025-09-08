
import React, {useEffect, useRef, useState} from 'react';
import { observer, inject } from "mobx-react";
import {Form, Modal, Input, TreeSelect, Button, Select} from 'antd';
import {useHistory} from "react-router";
import FuncUnitStepTable from "./FunctionStepList";
import FunctionStepAddList from "./FunctionStepAddList";
import funcUnitStepStore from "../store/funcUnitStepStore";
const { TreeNode } = TreeSelect;
import {Axios} from "tiklab-core-ui";
import "./funcUnitEdit.scss"
import IconCommon from "../../../common/caseCommon/IconCommon";
import {createWorkTestCaseFn} from "../../testcase/components/testCaseTableFn";
import Demand from "../../defectBind/workItem/components/Demand";
import WorkItemStore from "../../defectBind/workItem/store/WorkItemStore";
import {createWorkItemBindFn} from "../../../work/components/WorkTestCaseFn";

// 添加与编辑
const FuncUnitEdit = (props) => {
    const { funcUnitStore,categoryStore,findPage, demand, workInfo, searchWorkTestPage} = props;
    const {createFuncUnit,} = funcUnitStore
    const {findCategoryListTreeTable,categoryTableList} = categoryStore;
    const {createFuncUnitStep} = funcUnitStepStore;
    const { findWorkItemList, findWorkItem, } = WorkItemStore;

    const history = useHistory()
    const [form] = Form.useForm();
    const [visible, setVisible] = React.useState(false);
    const projectId = localStorage.getItem("projectId")
    const [stepList, setStepList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [workItemList, setWorkItemList] = useState([]);
    const [totalPage, setTotalPage] = useState(1);
    const formRef = useRef();
    // 弹框展示
    const showModal = () => {
        findCategoryListTreeTable({projectId: projectId}).then(res=>{
            if (res.length > 0){
                console.log("初始化模块：  ",res[0]?.id)
                form.setFieldsValue({
                    category: res[0]?.id
                })
            }
        })
        setStepList([]);
        setVisible(true);
    };

    const getModalWidth = () => {
        const width = window.innerWidth;

        if (width >= 1600) {
            return 1000;
        } else if (width < 1600 && width >= 1200) {
            return 987;
        } else if (width < 1200 && width >= 992) {
            return 700;
        } else if (width < 992 && width >= 768) {
            return 700;
        } else if (width < 768){
            return 700;
        }
    }

    const getModalHeight = () => {
        const height = window.innerHeight;

        if (height >= 900) {
            return 600;
        } else if (height >= 768) {
            return 550;
        } else if (height >= 576) {
            return 480;
        } else {
            return 480;
        }
    };

    // 提交
    const onFinish = async () => {
        let values = await form.validateFields();
        values.testCase={
            module:{id:values.category},
            projectId:projectId,
            name:values.name,
            caseType:"function",
            desc:values.desc,
            status: 0,
            precondition: values.precondition,
            director: {id: values.director},
            priorityLevel: values.priorityLevel,
            demand: {id:demand ? demand : values.demand},
        }
        delete values.name
        delete values.desc


        createFuncUnit(values).then((res)=> {
            for (const step of stepList) {
                step.funcUnitStep={
                    ...step.funcUnitStep,
                    funcUnitId:res.data,
                }
                createFuncUnitStep(step.funcUnitStep);
            }
            if(res.code===0){
                findPage&&findPage()
                sessionStorage.setItem(`functionId`,res.data);
                // history.push(`/project/${projectId}/testcase/function/${res.data}`)
            }
            if (workInfo){
                // 关联从事项新增的功能用例
                console.log("testCaseId",res.data)
                console.log("workItemId",workInfo?.id)
                console.log("projectId",projectId)
                createWorkTestCaseFn(res.data, workInfo?.id, projectId).then(res=>{
                    searchWorkTestPage()
                })

                if (workInfo.workTypeCode === "defect"){
                    createWorkItemBindFn(res.data, workInfo?.id, projectId)
                }
            }
        })

        setVisible(false);
    };


    const onCancel = () => { setVisible(false) };

    /**
     * 查询需求
     */
    const findDemandList = (param)=>{
        let params = {
            projectId:projectId,
            workTypeCode:"demand",
            pageParam: {
                pageSize: 10,
                currentPage:1
            },
            ...param
        }
        findWorkItemList(params).then(res=>{
            if(res.code===0){
                setWorkItemList(res.data.dataList);
                setTotalPage(res.data.totalPage)
            }else {
                // messageFn("error","TeamWire连接失败!")
            }
        })
    }

    const moduleTree= (dataList)=>{
        return dataList?.map(item=> {
                return item.children ?
                    <TreeNode value={item.id} title={item.moduleName} key={item.id}>
                        {
                            moduleTree(item.children)
                        }
                    </TreeNode>
                    :
                    <TreeNode value={item.id} title={item.moduleName} key={item.id}/>

        })
    }

    useEffect(async () => {
        if (visible){
            const params = {domainId:projectId};
            const dmUserRes = await Axios.post("/dmUser/findDmUserPage",params);
            if(dmUserRes.code===0){
                setUserList(dmUserRes.data.dataList)
            }
            findDemandList();
        }
    }, [visible]);

    useEffect(() => {
        if (workInfo){
            form.setFieldsValue({
                name: workInfo.title,
                category: workInfo.module?.id ? workInfo.module.id : null,
            })
        }
    }, [workInfo]);

    return (
        <>
            {
                workInfo ?
                    <div style={{cursor: "pointer", display: "flex", alignItems: "center"}} onClick={showModal}>
                        <svg className="img-icon-right" aria-hidden="true">
                            <use xlinkHref="#icon-add2"></use>
                        </svg>
                        <span>{props.name}</span>
                    </div>
                    :
                    <Button type={"primary"} onClick={showModal}>{props.name}</Button>
            }

            <Modal
                destroyOnClose={true}
                title={props.name}
                visible={visible}
                onCancel={onCancel}
                onOk={onFinish}
                okText="提交"
                cancelText="取消"
                centered
                width={getModalWidth()}
                bodyStyle={{height:`${getModalHeight()}`}}
                closable={true}
            >

                <div className={"func-add-form"} ref={formRef}>
                    <div className={"func-add-form-left"}>
                        <Form
                            form={form}
                            onFinish={onFinish}
                            preserve={false}
                            layout={"vertical"}
                        >
                            <Form.Item
                                label="名称"
                                rules={[{ required: true, message:"请添加名称"  }]}
                                name="name"
                            >
                                <Input placeholder="请输入名称" />
                            </Form.Item>
                            <Form.Item
                                label="前置条件"
                                name="precondition"
                            >
                                <Input.TextArea placeholder="请输入前置条件" />
                            </Form.Item>
                        </Form>
                        <FunctionStepAddList stepList={stepList} setStepList={setStepList} {...props} />
                    </div>
                    <div className={"func-add-form-right"}>
                        <Form
                            form={form}
                            onFinish={onFinish}
                            preserve={false}
                            layout={"vertical"}
                        >
                            {
                                !demand && <Form.Item
                                    label="关联需求"
                                    name="demand"
                                >
                                    <Select
                                        getPopupContainer={() => formRef.current}
                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                        placeholder="选择需求"
                                        allowClear
                                        className={"func-select"}
                                        bordered={false}
                                        showSearch={true}
                                        optionFilterProp="label"
                                    >
                                        {
                                            workItemList && workItemList.map(item => {
                                                return <Option key={item?.id}
                                                               value={item?.id}
                                                               label={item?.title}
                                                >{item?.title}</Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            }

                            <Form.Item
                                label="模块"
                                name="category"
                                rules={[{ required: true, message:"请选择模块"  }]}
                            >
                                <TreeSelect
                                    getPopupContainer={() => formRef.current}
                                    showSearch
                                    style={{ width: '100%' }}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    placeholder="选择模块"
                                    allowClear
                                    // value = {parentId}
                                    // onChange={(value)=> setParentId(value)}
                                    treeDefaultExpandAll
                                    disabled={props.type === 'add' && props.parent !== undefined}
                                    className={"func-select"}
                                    bordered={false}
                                >
                                    {
                                        moduleTree(categoryTableList)
                                    }
                                </TreeSelect>

                            </Form.Item>
                            <Form.Item
                                label="负责人"
                                name="director"
                            >
                                    <Select
                                        className={"func-select"}
                                        bordered={false}
                                        placeholder={"选择负责人"}
                                        getPopupContainer={() => formRef.current}
                                    >
                                        {
                                            userList && userList.map(item => {
                                                return <Option key={item?.user?.id}
                                                               value={item?.user?.id}>{item?.user?.nickname}</Option>
                                            })
                                        }
                                    </Select>
                            </Form.Item>

                            <Form.Item label={"优先级"} name="priorityLevel" >
                                <Select
                                    defaultValue={1}
                                    placeholder={"选择优先级"}
                                    style={{flex: 1}}
                                    getPopupContainer={() => formRef.current}
                                    className={"func-select"}
                                    bordered={false}
                                >
                                    <Option value={0}>
                                        <div style={{display: "flex", gap: "10px", alignItems: "center"}}>
                                            <IconCommon
                                                className={"icon-16"}
                                                icon={"icon_level1"}
                                                style={{cursor: "pointer"}}
                                            />
                                            <div>低</div>
                                        </div>
                                    </Option>
                                    <Option value={1}>
                                        <div style={{display: "flex", gap: "10px", alignItems: "center"}}>
                                            <IconCommon
                                                className={"icon-16"}
                                                icon={"icon_level2"}
                                                style={{cursor: "pointer"}}
                                            />
                                            <div>中</div>
                                        </div>
                                    </Option>
                                    <Option value={2}>
                                        <div style={{display: "flex", gap: "10px", alignItems: "center"}}>
                                            <IconCommon
                                                className={"icon-16"}
                                                icon={"icon_level3"}
                                                style={{cursor: "pointer"}}
                                            />
                                            <div>高</div>
                                        </div>
                                    </Option>
                                </Select>
                            </Form.Item>

                            <Form.Item label={"用例类型"} name="caseTye" >
                                <Select
                                    defaultValue={0}
                                    placeholder={"选择用例类型"}
                                    style={{flex: 1}}
                                    getPopupContainer={() => formRef.current}
                                    className={"func-select"}
                                    bordered={false}
                                >
                                    <Option value={0}>
                                        <div style={{display: "flex", gap: "10px", alignItems: "center"}}>
                                            功能用例
                                        </div>
                                    </Option>
                                </Select>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default inject("funcUnitStore","categoryStore")(observer(FuncUnitEdit));