import {Button, Col, Collapse, DatePicker, Form, Input, Row, Select} from "antd";
import React, {useEffect, useState} from "react";
import moment from "moment/moment";
import Breadcumb from "../../../../common/breadcrumb/Breadcrumb";
import locale from "antd/es/date-picker/locale/zh_CN";
import {PrivilegeProjectButton} from "tiklab-privilege-ui";
import DeleteProductModal from "../../../../product/product/components/DeleteProductModal";
import {inject, observer} from "mobx-react";
import ProductStore from "../../../product/store/ProductStore";
import "./ProductBasicInfo.scss"

const { Panel } = Collapse;
const { RangePicker } = DatePicker;
const ProductBasicInfo = (props) => {
    const layout = {
        labelCol: {
            span: 4,
        },
        wrapperCol: {
            span: 20,
        },
    };
    const formTailLayout = {
        labelCol: {
            span: 4,
        },
        wrapperCol: {
            span: 18,
            offset: 4
        },
    };
    const [form] = Form.useForm();
    const productId = props.match.params.productId;

    const { deleProduct, updateProduct, findProduct, getUseList, uselist } = ProductStore;
    const [disable, setDisabled] = useState(true);
    const [iconUrl, setIconUrl] = useState();
    const [visible, setVisible] = useState(false);
    const [productInfo, setproductInfo] = useState()
    // 周期
    const rangeConfig = {
        rules: [
            {
                type: 'array',
                required: true,
                message: '选择计划时间!',
            }
        ]
    };

    const dateFormat = 'YYYY/MM/DD';

    useEffect(() => {
        info()
        getUseList().then(res => {
            if (res.code === 0) {
                console.log(uselist)
            }

        })
        return;
    }, [])

    const info = () => {
        findProduct(productId).then((response) => {
            const time = response["startTime"]
            if (response.code === 0) {
                const data = response.data;
                setproductInfo(data)
                setIconUrl(data.iconUrl)
                form.setFieldsValue({
                    name: data.name,
                    remark: data.remark,
                    master: data.master.id,
                    productLimits: data.productLimits,
                    startTime: [moment(data.startTime, dateFormat), moment(data.endTime, dateFormat)]
                })
            }

        })
    };

    const cancel = () => {
        console.log(productInfo)
        form.setFieldsValue({
            name: productInfo.name,
            remark: productInfo.remark,
            master: productInfo.master.id,
            productLimits: productInfo.productLimits,
            startTime: [moment(productInfo.startTime, dateFormat), moment(productInfo.endTime, dateFormat)]
        })
        setDisabled(true)
    }

    const onFinish = () => {
        form.validateFields().then((values) => {
            const time = values["startTime"]
            const data = {
                ...values,
                startTime: time[0].format("YYYY-MM-DD"),
                endTime: time[1].format("YYYY-MM-DD"),
                master: { id: values.master },
                productLimits: values.productLimits,
                id: productId
            }

            updateProduct(data).then(res => {
                if (res.code === 0) {
                    setproductInfo(data)
                }
                setDisabled(true)
            })

            // setVisible(false);
        })
    }

    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        deleProduct(productId).then(response => {
            if (response.code === 0) {
                props.history.push("/product")
            }
        })
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const productInfoDesc = () => (
        <div>
            <div className="product-info-title">
                <svg aria-hidden="true" className="img-icon-right" fill="#fff">
                    <use xlinkHref="#icon-projectDetail"></use>
                </svg>
                产品信息
            </div>
            <div style={{ fontSize: "12px", color: "#999" }}>
                <svg aria-hidden="true" className="img-icon-right" fill="#fff">
                    <use></use>
                </svg>
                产品可见范围，负责人等信息，可点击修改</div>
        </div>
    );

    const productDelete = () => (
        <div>
            <div className="product-info-title">
                <svg aria-hidden="true" className="img-icon-right" fill="#fff">
                    <use xlinkHref="#icon-projectDelete"></use>
                </svg>
                删除产品
            </div>
            <div style={{ fontSize: "12px", color: "#999" }}>
                <svg aria-hidden="true" className="img-icon-right" fill="#fff">
                    <use></use>
                </svg>
                删除产品
            </div>
        </div>
    );

    const productLimits = [
        {
            name: "公共项目",
            id: "0"
        },
        {
            name: "私密项目",
            id: "1"
        }
    ]

    return (
        <Row>
            <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
                <div className="product-basicinfo">
                    <Breadcumb
                        firstText="产品信息"
                    />
                    <Collapse defaultActiveKey={"1"} expandIconPosition={"right"}>
                        <Panel header={productInfoDesc()} key="1" >
                            <Form
                                layout="vertical"
                                name="basic"
                                initialValues={{
                                    remember: true,
                                }}
                                form={form}
                                onFinish={onFinish}
                                onFieldsChange={() => setDisabled(false)}
                                labelAlign={"left"}
                                onValuesChange={onFinish}
                            >


                                <Form.Item
                                    label="产品名称"
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入产品名称',
                                        }
                                    ]}
                                >
                                    <Input placeholder="产品名称" />
                                </Form.Item>


                                <Form.Item
                                    label="负责人"
                                    name="master"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入负责人',
                                        }
                                    ]}
                                >
                                    <Select
                                        placeholder="负责人"
                                    >
                                        {
                                            uselist && uselist.map((item, index) => {
                                                return <Select.Option value={item.id} key={item.id}>{item.nickname}</Select.Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label="可见范围"
                                    name="productLimits"
                                    rules={[
                                        {
                                            required: true
                                        }
                                    ]}
                                >
                                    <Select
                                        placeholder="可见范围"
                                    >
                                        {
                                            productLimits.map((item, index) => {
                                                return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                                <Form.Item name="startTime" label="计划日期" {...rangeConfig} >
                                    <RangePicker locale={locale} />
                                </Form.Item>
                                <Form.Item
                                    label="产品描述"
                                    name="remark"
                                >
                                    <Input placeholder="产品描述" />
                                </Form.Item>
                                {/*<PrivilegeProjectButton code={'ProductEdit'} domainId={productId}  {...props}>*/}
                                    <Form.Item {...formTailLayout} >
                                        <Button onClick={() => cancel()}>
                                            取消
                                        </Button>
                                        <Button htmlType="submit" type="primary" disabled={disable}>
                                            保存
                                        </Button>
                                    </Form.Item>
                                {/*</PrivilegeProjectButton>*/}

                            </Form>

                        </Panel>
                        <Panel header={productDelete()} key="2" >
                            <div className="product-icon">
                                <div>
                                    <div className="product-delete-block">

                                        <span>此产品将被永久删除。</span>
                                    </div>
                                    {/*<PrivilegeProjectButton code={'ProductDelete'} domainId={productId}  {...props}>*/}
                                        <div className="change-button  delete-button" onClick={() => showModal()}>
                                            删除产品
                                        </div>
                                    {/*</PrivilegeProjectButton>*/}


                                </div>
                            </div>
                        </Panel>
                    </Collapse>



                </div>
                <DeleteProductModal
                    isModalVisible={isModalVisible}
                    handleOk={handleOk}
                    handleCancel={handleCancel}
                />
                {/*<ProductIcon*/}
                {/*    visible={visible}*/}
                {/*    setVisible={setVisible}*/}
                {/*    updateproduct={updateProduct}*/}
                {/*    setIconUrl={setIconUrl}*/}
                {/*/>*/}
            </Col>
        </Row>
    )
}

export default inject("productStore")(observer(ProductBasicInfo));