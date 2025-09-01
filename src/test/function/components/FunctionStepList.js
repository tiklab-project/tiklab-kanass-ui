import React, {useEffect, useState} from 'react';
import IconCommon from "../../../common/caseCommon/IconCommon";
import {inject, observer} from "mobx-react";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {MenuOutlined, PlusOutlined, UpOutlined, CheckOutlined, CloseOutlined, FormOutlined} from "@ant-design/icons";
import {Row, Col, Empty, Popconfirm, Select, Form, Input, Button, Space, message} from "antd";
import stepCommonStore from "../../common/stepcommon/store/StepCommonStore";
import {CASE_TYPE} from "../../../common/dictionary/dictionary";
import {useLocation} from "react-router";
import functionInstanceStore from "../store/functionInstanceStore";
import funcUnitStepStore from "../store/funcUnitStepStore";
import "../../common/styles/testcaseStyle.scss"
import HideDelete from "../../../common/caseCommon/hideDelete/HideDelete";

const {TextArea} = Input;

const {findStepCommonList,updateStepCommon,deleteStepCommon} = stepCommonStore
const {setFunctionStepResult} = functionInstanceStore;
const {createFuncUnitStep, updateFuncUnitStep, findFuncUnitStep} = funcUnitStepStore;

const FunctionStepList = ({functionId,funcUnitStore}) => {
    const {findFuncUnit} = funcUnitStore
    const [stepList, setStepList] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingStepId, setEditingStepId] = useState(null);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();

    const pathname = useLocation().pathname
    const projectId = localStorage.getItem("projectId")
    const testPlanId = sessionStorage.getItem("testPlanId")

    useEffect(async ()=> {
        await findList()
    },[functionId])

    const findList = async () =>{
        let value ={
            caseId:functionId,
            caseType:CASE_TYPE.FUNCTION,
        }

        // if(pathname.startsWith("/plan")){
        //     value = {
        //         caseId:functionId,
        //         caseType:CASE_TYPE.FUNCTION,
        //         isPlanEntry:true,
        //         testPlanId:testPlanId
        //     }
        // }

        let list = await findStepCommonList(value)
        setStepList(list)
    }

    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        const reorderedItems = Array.from(stepList);
        const [dragItem] = reorderedItems.splice(result.source.index, 1);

        let param = {
            //排序设置成当前位置
            sort:result.destination.index,
            //源排序位置
            oldSort:result.source.index,
            id:dragItem.id,
            caseId:dragItem.caseId
        }

        updateStepCommon(param).then(()=>findList())
    };

    const setStepResult =async (value,source) =>{
        const data = {
            functionStepId: source.id,
            functionId: source.caseId,
            result: value,
            testPlanId: testPlanId,
            projectId: projectId,
        };

        await setFunctionStepResult(data)
    }

    const handleAddStep = async () => {
        try {
            const values = await form.validateFields();
            values.funcUnitId = functionId;
            
            const res = await createFuncUnitStep(values);
            if(res.code === 0) {
                await findList();
                await findFuncUnit(functionId);
                message.success("添加成功");
                form.resetFields();
                setShowAddForm(false);
            } else {
                message.error("添加失败");
            }
        } catch (error) {
            console.error('添加步骤失败:', error);
        }
    };

    const handleEditStep = async (stepId) => {
        try {
            const values = await editForm.validateFields();
            values.id = stepId;
            
            const res = await updateFuncUnitStep(values);
            if(res.code === 0) {
                await findList();
                message.success("保存成功");
                setEditingStepId(null);
                editForm.resetFields();
            } else {
                message.error("保存失败");
            }
        } catch (error) {
            console.error('编辑步骤失败:', error);
        }
    };

    const startEdit = async (stepId) => {
        try {
            const info = await findFuncUnitStep(stepId);
            editForm.setFieldsValue(info);
            setEditingStepId(stepId);
        } catch (error) {
            console.error('获取步骤信息失败:', error);
        }
    };

    const cancelEdit = () => {
        setEditingStepId(null);
        editForm.resetFields();
    };

    const renderItemsInfo = (item,provided,step) =>{
        const isEditing = editingStepId === item.id;

        return(
            <Row className={"step-item-content"}>
                <Col span={1}>
                    <div
                        {...provided.dragHandleProps}
                        className={"step-item-box-icon"}
                    >
                        <MenuOutlined />
                    </div>
                </Col>
                <Col span={1}>
                    <div>{item.sort+1}</div>
                </Col>
                <Col span={8}>
                    {isEditing ? (
                        <Form.Item 
                            name="described"
                            rules={[{ required: true, message: '请输入步骤描述' }]}
                            style={{marginBottom: 0}}
                        >
                            <TextArea
                                placeholder="请输入步骤描述"
                                autoSize={{minRows: 3, maxRows: 4}}
                            />
                        </Form.Item>
                    ) : (
                        <div className={"text-ellipsis"}>{step?.described}</div>
                    )}
                </Col>
                <Col span={7}>
                    {isEditing ? (
                        <Form.Item 
                            name="expect"
                            rules={[{ required: true, message: '请输入预期结果' }]}
                            style={{marginBottom: 0}}
                        >
                            <TextArea
                                placeholder="请输入预期结果"
                                autoSize={{minRows: 3, maxRows: 4}}
                            />
                        </Form.Item>
                    ) : (
                        step?.expect ? <div className={"text-ellipsis"}>{step?.expect}</div> : null
                    )}
                </Col>
                {/*{pathname.startsWith('/plan') && (*/}
                {/*    <Col span={4}>*/}
                {/*        <div className="text-ellipsis">*/}
                {/*            <FunctionResultSelect*/}
                {/*                selectChange={setStepResult}*/}
                {/*                record={item}*/}
                {/*            />*/}
                {/*        </div>*/}
                {/*    </Col>*/}
                {/*)}*/}
                <Col style={{marginLeft: "auto",height:"20px"}}>
                    {isEditing ? (
                        <Space>
                            <CheckOutlined
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditStep(item.id);
                                }}
                                style={{cursor: "pointer", fontSize: "16px"}}
                            />
                            <CloseOutlined
                                onClick={(e) => {
                                    e.stopPropagation();
                                    cancelEdit();
                                }}
                                style={{cursor: "pointer", fontSize: "16px"}}
                            />
                        </Space>
                    ) : (
                        <Space>
                            {/*<IconCommon*/}
                            {/*    className={"icon-s"}*/}
                            {/*    icon={"bianji11"}*/}
                            {/*    onClick={(e) => {*/}
                            {/*        e.stopPropagation();*/}
                            {/*        startEdit(item.id);*/}
                            {/*    }}*/}
                            {/*    style={{cursor: "pointer"}}*/}
                            {/*/>*/}
                            <FormOutlined
                                style={{fontSize:16,cursor: "pointer"}}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    startEdit(item.id);
                                }}
                            />
                            <HideDelete deleteFn={()=>deleteFn(item)}/>


                        </Space>
                    )}
                </Col>
            </Row>
        )
    }


    const renderItems = (list) => {
        return list.map((item, index) => {
            let step = item.funcUnitStep
            return <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                    <>
                        <div
                            className={"step-item-box"}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={{
                                // backgroundColor: snapshot.isDragging ? 'var(--pi-bg-grey-200)' : 'white',
                                ...provided.draggableProps.style,
                            }}
                        >
                            {editingStepId === item.id ? (
                                <Form form={editForm} layout="vertical">
                                    {renderItemsInfo(item, provided, step)}
                                </Form>
                            ) : (
                                renderItemsInfo(item, provided, step)
                            )}
                        </div>
                    </>
                )}
            </Draggable>
        });
    };

    const deleteFn = async (item) =>{

        await deleteStepCommon(item.id, CASE_TYPE.FUNCTION)
        await findList()
        await findFuncUnit(functionId)
    }

    return (
        <>
            <div>
                <div className={"title-bold"}>
                    测试步骤
                    <span className={"list-size-title"}> {stepList.length}</span>
                </div>
            </div>
            <div className={"table-list-box"}>
                {/*<div className={"display-flex-between"} style={{margin: "10px 5px"}}>*/}
                {/*     <div className={"list-size-title"}> 共{stepList.length}个</div>*/}
                {/*</div>*/}

                {/* 添加步骤表单 */}
                <div style={{
                    marginTop: "5px",
                    padding: "7px",
                    border: "1px solid #eee",
                    borderRadius: "5px",
                    background: "#fafafa",
                }}>
                    <div style={{textAlign: "center"}}>
                        {
                            !showAddForm && <span
                                className="link-text"
                                onClick={() => setShowAddForm(!showAddForm)}
                                style={{cursor: "pointer", fontSize: "14px"}}
                            >
                                添加步骤
                            </span>
                        }

                    </div>
                    {showAddForm && (
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleAddStep}
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="步骤描述"
                                        name="described"
                                        rules={[{required: true, message: '请输入步骤描述'}]}
                                    >
                                        <TextArea
                                            placeholder="请输入步骤描述"
                                            autoSize={{minRows: 3, maxRows: 6}}
                                            className={"function-add-textarea"}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="预期结果"
                                        name="expect"
                                        rules={[{required: true, message: '请输入预期结果'}]}
                                    >
                                        <TextArea
                                            placeholder="请输入预期结果"
                                            autoSize={{minRows: 3, maxRows: 6}}
                                            className={"function-add-textarea"}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item style={{textAlign: "right", marginBottom: 0}}>
                                <Space>
                                    <Button type="primary" htmlType="submit">
                                        保存
                                    </Button>
                                    <Button onClick={() => {
                                        form.resetFields();
                                        setShowAddForm(false);
                                    }}>
                                        取消
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    )}

                </div>

                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="list">
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                {/*<div className={"step-item-box"}>*/}
                                {/*    <Row*/}
                                {/*        gutter={[10, 0]}*/}
                                {/*        className={"step-item-content-header"}*/}
                                {/*        style={{padding: "5px 10px"}}*/}
                                {/*    >*/}
                                {/*        <Col span={1}>*/}
                                {/*            <MenuOutlined/>*/}
                                {/*        </Col>*/}
                                {/*        <Col span={1} className={"case-step-header-title"}>序号</Col>*/}
                                {/*        <Col span={8} className={"case-step-header-title"}>描述</Col>*/}
                                {/*        <Col span={7} className={"case-step-header-title"}>期望</Col>*/}
                                {/*        {pathname.startsWith('/plan') && (*/}
                                {/*            <Col span={4} className={"case-step-header-title"}>实际结果</Col>*/}
                                {/*        )}*/}
                                {/*        <Col style={{marginLeft: "auto", height: "20px"}}*/}
                                {/*             className={"case-step-header-title"}>操作</Col>*/}
                                {/*    </Row>*/}
                                {/*</div>*/}
                                <div>
                                    {
                                        stepList && stepList.length > 0
                                            ? renderItems(stepList)
                                            // : <Empty description={<span>暂无步骤</span>}/>
                                            : <div style={{height: "100px"}}/>
                                    }
                                </div>
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>




            </div>
        </>
    );
};

export default inject("funcUnitStore")(observer(FunctionStepList));