import {Form, Input, Modal, TreeSelect} from "antd";
import React, {useEffect} from "react";
import {withRouter} from "react-router";
import {observer} from "mobx-react";
import ProductModuleStore from "../store/ProductModuleStore";
const { TreeNode } = TreeSelect;
const ProductModuleAddModal = (props) => {
    const { parent, type, visible, setVisible, modalName, id } = props;
    const { createModule, searchModuleById, editModuleById, findModuleListTree, moduleList } = ProductModuleStore;
    // form ref
    const [form] = Form.useForm();

    // 项目id
    const productId = props.match.params.productId;
    // 表单的宽度
    const layout = {
        labelCol: {
            span: 6,
        },
        wrapperCol: {
            span: 24,
        },
    };


    useEffect(() => {
        form.resetFields();
        if (visible) {
            if (type === "edit") {
                searchModuleById(id).then((res) => {
                    if (res.code === 0) {
                        form.setFieldsValue({
                            moduleName: res.data.moduleName,
                            id: res.data.id,
                            desc: res.data.desc,
                            parent: res.data.parent?.id || parent
                        })
                    }

                })
            }else {
                form.setFieldsValue({
                    parent: parent
                })
            }
        }
    }, [visible])

    /**
     * 提交表单
     */
    const onFinish = () => {
        form.validateFields().then((fieldsValue) => {
            const params = {
                ...fieldsValue,
                product: { id: productId },
                parent: {
                    id: fieldsValue.parent || "nullstring"
                }
            }
            if (props.type === "add") {
                createModule(params).then(res => {
                    if(res.code === 0){
                        findModuleListTree({ productId: productId })
                    }
                })

            } else {
                params.id = props.id
                editModuleById(params).then(res => {
                    if(res.code === 0){
                        findModuleListTree({ productId: productId })
                    }
                })
            }
            setVisible(false);
            form.resetFields();
        })

    };

    /**
     * 关闭表单，重置数据
     */
    const onFinishFailed = () => {
        form.resetFields();
        setVisible(false);
    };

    const moduleTree= (dataList)=>{
        return dataList?.map(item=> {
            if((item.id != id && type === "edit") || type === "add"){
                return item.children ?
                    <TreeNode value={item.id} title={item.moduleName} key={item.id}>
                        {
                            moduleTree(item.children)
                        }
                    </TreeNode>
                    :
                    <TreeNode value={item.id} title={item.moduleName} key={item.id}/>
            }

        })
    }

    return (
        <div className="addmodel">
            <Modal
                title={modalName}
                visible={visible}
                onOk={onFinish}
                onCancel={onFinishFailed}
                cancelText="取消"
                okText="确定"
                closable={false}
            >
                <Form
                    {...layout}
                    name="basic"
                    initialValues={{
                        remember: true,
                    }}
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        label="上级模块"
                        name="parent"
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
                                moduleTree(moduleList)
                            }
                        </TreeSelect>
                    </Form.Item>
                    <Form.Item
                        label="模块名称"
                        name="moduleName"
                        rules={[
                            {
                                required: true,
                                message: '请输入模块名称',
                            },
                        ]}
                    >
                        <Input placeholder="请输入模块名称" />
                    </Form.Item>
                    <Form.Item
                        label="模块描述"
                        name="desc"
                        rules={[
                            {
                                required: false,
                                message: '请输入模块描述',
                            },
                        ]}
                    >
                        <Input placeholder="请输入模块描述" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
export default withRouter(observer(ProductModuleAddModal));