import {DatePicker, Form, Input, Modal, Select} from "antd";
import moment from "moment/moment";
import React, {useEffect} from "react";
import {inject, observer} from "mobx-react";

const { RangePicker } = DatePicker;
const layout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 24,
    },
};
const ProductPlanAddEditModal = (props) => {
    const [form] = Form.useForm();
    const { uselist, getUseList, productPlanStore, productPlanStateList, setVisible, visible, productPlanId, setActiveTabs, selectTabs } = props;
    const { searchProductPlan, addproductPlanlist, editProductPlan, findProductPlanList } = productPlanStore;
    const dateFormat = 'YYYY-MM-DD HH:mm:ss';
    // 项目id
    const productId = props.match.params.productId;

    /**
     * 显示添加编辑弹窗，若是编辑模型，初始化表单
     */
    const showModal = () => {
        getUseList(productId).then(res=> {
            if(res.code === 0 && props.type === "add" && res.data.length > 0){
                form.setFieldsValue({
                    master: res.data[0]?.user?.id,
                })
            }

        })
        if (props.type === "edit") {
            searchProductPlan(productPlanId).then((res) => {
                form.setFieldsValue({
                    productPlanName: res.data.productPlanName,
                    desc: res.data.desc || null,
                    startTime: res.data.startTime ? [moment(res.data.startTime, dateFormat), moment(res.data.endTime, dateFormat)] : null,
                    master: res.data.master ? res.data.master.id : null,
                    productPlanState: res.data.productPlanState ? res.data.productPlanState.id : null
                })
            })
        }
    };

    /**
     * 关闭打开弹窗，重新加载数据
     */
    useEffect(() => {
        if (visible) {
            showModal()
        }
        return;
    }, [visible])

    /**
     * 添加表单信息，添加或者编辑
     */
    const onFinish = () => {
        form.validateFields().then((values) => {
            const time = values["startTime"]
            let data = {
                ...values,
                master: { id: values.master },
                startTime: time[0].format(dateFormat),
                endTime: time[1].format(dateFormat),
                product: {
                    id: props.productId
                }
            }
            if (props.type === "add") {
                addproductPlanlist(data).then(res => {
                    if(res.code === 0){
                        setActiveTabs("all")
                        selectTabs("all", 1);
                    }
                })
            } else {
                data = {
                    ...data,
                    id: productPlanId,
                    master: { id: values.master },
                    productPlanState: {
                        id: values.productPlanState
                    }
                }
                editProductPlan(data)
            }
            setVisible(false);
            form.resetFields();
        })
    };

    /**
     * 取消添加或者编制
     */
    const onCancel = () => {
        form.resetFields();
        setVisible(false);

    };

    return (
        <>
            <div className="addmodel">
                <Modal
                    title={"添加计划"}
                    visible={visible}
                    onOk={onFinish}
                    onCancel={onCancel}
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
                            label="计划名称"
                            name="productPlanName"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入计划名称',
                                },
                            ]}
                        >
                            <Input placeholder="计划名称" maxLength={40} />
                        </Form.Item>
                        <Form.Item
                            label="负责人"
                            name="master"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入负责人',
                                },
                            ]}
                        >
                            <Select
                                placeholder="负责人"
                                allowClear
                            >
                                {
                                    uselist && uselist.map((item, index) => {
                                        return <Select.Option value={item.user?.id} key={item.user?.id}>{item.user?.nickname ? item.user?.nickname : item.user?.name}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>

                        {
                            props.type !== "add" && <Form.Item
                                label="计划状态"
                                name="productPlanState"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入计划状态',
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="计划状态"
                                    allowClear
                                >
                                    {
                                        productPlanStateList && productPlanStateList.map((item, index) => {
                                            return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        }

                        <Form.Item name="startTime" label="计划日期"
                                   rules={[
                                       {
                                           required: true,
                                           message: '请选择计划日期',
                                       },
                                   ]}>
                            <RangePicker />
                        </Form.Item>
                        <Form.Item
                            label="计划描述"
                            name="desc"
                            rules={[
                                {
                                    required: false,
                                    message: '请输入计划描述',
                                },
                            ]}
                        >
                            <Input placeholder="计划描述" />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>

        </>
    );
};

export default inject("productPlanStore")(observer(ProductPlanAddEditModal));