
import React, {useState} from 'react';
import { observer, inject } from "mobx-react";
import {Form, Modal, Input, TreeSelect, Button} from 'antd';
import {useHistory} from "react-router";
import FuncUnitStepTable from "./FunctionStepList";
const { TreeNode } = TreeSelect;

// 添加与编辑
const FuncUnitEdit = (props) => {
    const { funcUnitStore,categoryStore,findPage} = props;
    const {createFuncUnit,} = funcUnitStore
    const {findCategoryListTreeTable,categoryTableList} = categoryStore;

    const history = useHistory()
    const [form] = Form.useForm();
    const [visible, setVisible] = React.useState(false);
    const projectId = localStorage.getItem("projectId")

    // 弹框展示
    const showModal = () => {
        findCategoryListTreeTable(projectId)

        setVisible(true);
    };

    // 提交
    const onFinish = async () => {
        let values = await form.validateFields();
        values.testCase={
            module:{id:values.category},
            projectId:projectId,
            name:values.name,
            caseType:"function",
            desc:values.desc
        }
        delete values.name
        delete values.desc

        createFuncUnit(values).then((res)=> {
            if(res.code===0){
                findPage&&findPage()
                sessionStorage.setItem(`functionId`,res.data);
                // history.push(`/project/${projectId}/testcase/function/${res.data}`)
            }
        })

        setVisible(false);
    };


    const onCancel = () => { setVisible(false) };


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
    return (
        <>
            <Button type={"primary"} onClick={showModal}>{props.name}</Button>

            <Modal
                destroyOnClose={true}
                title={props.name}
                visible={visible}
                onCancel={onCancel}
                onOk={onFinish}
                okText="提交"
                cancelText="取消"
                centered
                width={470}
            >
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
                        label="模块"
                        name="category"
                        rules={[{ required: true, message:"请选择模块"  }]}
                    >
                        <TreeSelect
                            showSearch
                            style={{ width: '100%' }}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            placeholder="选择上级模块"
                            allowClear
                            // value = {parentId}
                            // onChange={(value)=> setParentId(value)}
                            treeDefaultExpandAll
                            disabled={props.type === 'add' && props.parent !== undefined}
                        >
                            {
                                moduleTree(categoryTableList)
                            }
                        </TreeSelect>

                    </Form.Item>
                    {/*<Form.Item*/}
                    {/*    label="前置条件"*/}
                    {/*    name="precondition"*/}
                    {/*>*/}
                    {/*    <Input.TextArea placeholder="请输入前置条件" />*/}
                    {/*</Form.Item>*/}
                </Form>
                {/*<FuncUnitStepTable  {...props} />*/}
            </Modal>
        </>
    );
};

export default inject("funcUnitStore","categoryStore")(observer(FuncUnitEdit));