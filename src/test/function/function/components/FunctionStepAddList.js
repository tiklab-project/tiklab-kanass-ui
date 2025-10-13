import React, {useEffect, useState, useRef} from 'react';
import IconCommon from "../../../../common/caseCommon/IconCommon";
import {inject, observer} from "mobx-react";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {MenuOutlined, PlusOutlined, UpOutlined, CheckOutlined, CloseOutlined, FormOutlined} from "@ant-design/icons";
import {Row, Col, Empty, Popconfirm, Select, Form, Input, Button, Space, message, Tooltip} from "antd";
import stepCommonStore from "../../../common/stepcommon/store/StepCommonStore";
import {CASE_TYPE} from "../../../../common/dictionary/dictionary";
import {useLocation} from "react-router";
import functionInstanceStore from "../store/functionInstanceStore";
import funcUnitStepStore from "../store/funcUnitStepStore";
import "../../../common/styles/testcaseStyle.scss"
import HideDelete from "../../../../common/caseCommon/hideDelete/HideDelete";

const {TextArea} = Input;

const {findStepCommonList,updateStepCommon,deleteStepCommon} = stepCommonStore
const {setFunctionStepResult} = functionInstanceStore;
const {createFuncUnitStep, updateFuncUnitStep, findFuncUnitStep} = funcUnitStepStore;

const FunctionStepAddList = (props) => {
    const {funcUnitStore, stepList, setStepList} = props;
    const {findFuncUnit} = funcUnitStore;
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingStepId, setEditingStepId] = useState(null);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const describedInputRef = useRef(null);

    const pathname = useLocation().pathname
    const projectId = localStorage.getItem("projectId")
    const testPlanId = sessionStorage.getItem("testPlanId")

    // useEffect(async ()=> {
    //     if (type === "edit" && functionId){
    //         await findList()
    //     }
    // },[functionId])

    // const findList = async () =>{
    //     let value ={
    //         caseId:functionId,
    //         caseType:CASE_TYPE.FUNCTION,
    //     }
    //
    //     let list = await findStepCommonList(value)
    //     setStepList(list)
    // }

    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        // 如果拖拽到相同位置，不需要处理
        if (result.source.index === result.destination.index) {
            return;
        }

        const reorderedItems = Array.from(stepList);
        const [dragItem] = reorderedItems.splice(result.source.index, 1);

        // 插入到目标位置
        reorderedItems.splice(result.destination.index, 0, dragItem);

        // 更新所有项目的 sort 值为新的索引位置
        const updatedItems = reorderedItems.map((item, index) => ({
            ...item,
            sort: index // 使用数组索引作为排序值
        }));

        // 只更新前端状态
        setStepList(updatedItems);
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

    const generateRandomId = (length = 16) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;

        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    const handleAddStep = async () => {
        try {
            let formValues = await form.validateFields();
            const values = {
                funcUnitStep: formValues,
                id: generateRandomId(16),
                sort: stepList.length
            };

            setStepList([...stepList, values]);

            message.success("添加成功");
            form.resetFields();
            setShowAddForm(false);
        } catch (error) {
            message.success("添加失败");
            console.error('添加步骤失败:', error);
        }
    };

    const handleKeyPressAdd = (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            handleAddStep();
        }
    };

    const handleKeyPressEdit = (e, stepId) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            handleEditStep(stepId);
        }
    };

    const showAddFormHandler = () => {
        setShowAddForm(true);
        // 使用setTimeout确保DOM更新后再聚焦
        setTimeout(() => {
            if (describedInputRef.current) {
                describedInputRef.current.focus();
            }
        }, 100);
    };

    const handleEditStep = async (stepId) => {
        try {
            const formValues = await editForm.validateFields();
            stepList.map(item => {
                if (item.id === stepId) {
                    item.funcUnitStep = formValues;
                }
            })
            message.success("修改成功");
            setEditingStepId(null);
            editForm.resetFields();

        } catch (error) {
            message.error("修改失败");
            console.error('编辑步骤失败:', error);
        }
    };

    const startEdit = async (stepId) => {
        try {
            console.log("stepList",stepList);
            console.log("编辑的id",stepId);
            // const info = await findFuncUnitStep(stepId);
            const editInfo = stepList.filter(item => item.id === stepId);
            const info = editInfo[0].funcUnitStep;
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
            <Row className={"step-item-content step-row"}>
                <Col className={"step-cell"}>
                    <div
                        {...provided.dragHandleProps}
                        className={"step-item-box-icon"}
                    >
                        <MenuOutlined />
                        <div className={"step-item-box-index"}>{item.sort+1}</div>
                    </div>
                </Col>
                <Col span={9} className={"step-cell step-item-box-text"}>
                    {isEditing ? (
                        <Form.Item
                            name="described"
                            rules={[{ required: true, message: '请输入步骤描述' }]}
                            style={{marginBottom: 0, width: "100%"}}
                        >
                            <TextArea
                                placeholder="请输入步骤描述(Ctrl+Enter快速保存)"
                                autoSize={{minRows: 3, maxRows: 4}}
                                onKeyDown={(e) => handleKeyPressEdit(e, item.id)}
                                bordered={false}
                            />
                        </Form.Item>
                    ) : (
                        <div onClick={(e) => {
                            e.stopPropagation();
                            startEdit(item.id);
                        }} className={"text-display"}>{step?.described}</div>
                    )}
                </Col>
                <Col span={9} className={"step-cell step-item-box-text"}>
                    {isEditing ? (
                        <Form.Item
                            name="expect"
                            rules={[{ required: true, message: '请输入预期结果' }]}
                            style={{marginBottom: 0, width: "100%"}}
                        >
                            <TextArea
                                placeholder="请输入预期结果(Ctrl+Enter快速保存)"
                                autoSize={{minRows: 3, maxRows: 4}}
                                onKeyDown={(e) => handleKeyPressEdit(e, item.id)}
                                bordered={false}
                            />
                        </Form.Item>
                    ) : (
                        step?.expect ? <div onClick={(e) => {
                            e.stopPropagation();
                            startEdit(item.id);
                        }} className={"text-display"}>{step?.expect}</div> : null
                    )}
                </Col>
                <Col className={"step-cell"} style={{marginLeft: "auto",height:"20px"}}>
                    {isEditing ? (
                        <Space>
                            <Tooltip title={"Ctrl + Enter 快速保存"} mouseEnterDelay={0.5}>
                                <CheckOutlined
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditStep(item.id);
                                    }}
                                    style={{cursor: "pointer", fontSize: "16px"}}
                                />
                            </Tooltip>
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
                            <FormOutlined
                                style={{fontSize:16,cursor: "pointer"}}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    startEdit(item.id);
                                }}
                            />
                            <HideDelete privilegeCode={'test_case_update'} projectId={projectId} deleteFn={()=>deleteFn(item)}/>
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

        // await deleteStepCommon(item.id, CASE_TYPE.FUNCTION)
        // await findList()
        // await findFuncUnit(functionId)
        setStepList(stepList.filter(step => step.id !== item.id))
    }

    return (
        <>
            <div>
                <div className={"title-bold"}>
                    <div>
                        测试步骤
                        <span className={"list-size-title"}> {stepList.length}</span>
                    </div>
                </div>
            </div>
            <div className={"table-list-box"}>
                {/*<div className={"display-flex-between"} style={{margin: "10px 5px"}}>*/}
                {/*     <div className={"list-size-title"}> 共{stepList.length}个</div>*/}
                {/*</div>*/}

                {/* 添加步骤表单 */}

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
                                <div>
                                    {
                                        stepList && stepList.length > 0
                                            ? renderItems(stepList)
                                            : <div style={{height: "0px"}}/>
                                    }
                                </div>
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                <div className={"step-item-box"} style={{marginTop: "10px"}}>
                    <div style={{textAlign: "center"}}>
                        {
                            !showAddForm &&
                                <span
                                    className="link-text"
                                    onClick={showAddFormHandler}
                                    style={{cursor: "pointer", fontSize: "14px", display: "inline-flex", alignItems: "center"}}
                                >
                                    <svg className="icon-20" aria-hidden="true" style={{marginRight: "5px"}}>
                                        <use xlinkHref="#icon-add2"></use>
                                    </svg>
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
                            <Row className={"step-item-content"}>
                                <Col className={"step-cell"}>
                                    <div className={"step-item-box-icon"}>
                                        <MenuOutlined />
                                        <div className={"step-item-box-index"}>{stepList.length + 1}</div>
                                    </div>
                                </Col>
                                <Col span={9} className={"step-cell step-item-box-text"}>
                                    <Form.Item
                                        name="described"
                                        rules={[{required: true, message: '请输入步骤描述'}]}
                                        style={{marginBottom: 0, width: "100%"}}
                                    >
                                        <TextArea
                                            ref={describedInputRef}
                                            placeholder="请输入步骤描述(Ctrl+Enter快速保存)"
                                            autoSize={{minRows: 3, maxRows: 4}}
                                            onKeyDown={handleKeyPressAdd}
                                            bordered={false}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={9} className={"step-cell step-item-box-text"}>
                                    <Form.Item
                                        name="expect"
                                        rules={[{required: true, message: '请输入预期结果'}]}
                                        style={{marginBottom: 0, width: "100%"}}
                                    >
                                        <TextArea
                                            placeholder="请输入预期结果(Ctrl+Enter快速保存)"
                                            autoSize={{minRows: 3, maxRows: 4}}
                                            onKeyDown={handleKeyPressAdd}
                                            bordered={false}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col style={{marginLeft: "auto", height: "20px"}}>
                                    <Space>
                                        <Tooltip title={"Ctrl + Enter 快速保存"} mouseEnterDelay={0.5}>
                                            <CheckOutlined
                                                onClick={handleAddStep}
                                                style={{cursor: "pointer", fontSize: "16px"}}
                                            />
                                        </Tooltip>
                                        <CloseOutlined
                                            onClick={() => {
                                                form.resetFields();
                                                setShowAddForm(false);
                                            }}
                                            style={{cursor: "pointer", fontSize: "16px"}}
                                        />
                                    </Space>
                                </Col>
                            </Row>
                        </Form>
                    )}
                </div>

            </div>
        </>
    );
};

export default inject("funcUnitStore")(observer(FunctionStepAddList));