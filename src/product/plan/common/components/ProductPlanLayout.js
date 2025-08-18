import {inject, observer, Provider} from "mobx-react";
import React, {useEffect, useState} from "react";
import {Col, Layout, Row} from "antd";
import {PrivilegeProjectButton} from "tiklab-privilege-ui";
import DeleteModal from "../../../../common/deleteModal/deleteModal";
import {renderRoutes} from "react-router-config";
import ProjectEmpty from "../../../../common/component/ProjectEmpty";
import ProductPlanAddEditModal from "../../planList/components/ProductPlanAddEditModal";
import "./ProductPlanLayout.scss"
import { getUser } from "tiklab-core-ui"
import ProductPlanDetailStore from "../store/ProductPlanDetailStore";
import WorkStore from "../../../../work/store/WorkStore";
import ProductPlanStore from "../../planList/store/ProductPlanStore";
import "./ProductPlanLayout.scss"

const ProductPlanLayout = (props) => {
    const { route, systemRoleStore } = props;
    const store = {
        productPlanDetailStore: ProductPlanDetailStore,
        productPlanStore: ProductPlanStore
    }
    const { findProductPlan, productPlan } = ProductPlanDetailStore;
    const { setSearchConditionNull, setTabValue } = WorkStore;
    const {uselist, getUseList, findAllProductPlanState, deleproductPlanList} = ProductPlanStore;
    const userId = getUser().userId;
    const productId = props.match.params.productId;
    const product = JSON.parse(localStorage.getItem("product"));
    const productPlanId = props.match.params.productPlanId;
    // 弹窗显示
    const [visible, setVisible] = useState(false);
    const [productPlanStateList, setProductPlanStateList] = useState([])
    useEffect(() => {
        // setSearchConditionNull()
        findProductPlan({ id: productPlanId }).then(res => {
            console.log(res)
        })
        // setTabValue({ id: "all", type: "system" })
        const isPublish = product?.productLimits === "0" ? true : false;
        systemRoleStore.getInitProjectPermissions(userId, productId, isPublish)

        findAllProductPlanState().then(res => {
            if (res.code === 0) {
                setProductPlanStateList(res.data)
            }
        });

        return () => {
            // setSearchConditionNull()
            // setTabValue({ id: "all", type: "system" })
        }
    }, []);

    /**
     * 显示添加或者编辑弹窗
     * @param {操作类型， edit,add} type
     * @param {计划id} id
     */
    const showModal = (type, id) => {
        setVisible(true)
    }

    /**
     * 删除计划
     * @param {计划id} id
     */
    const deleProductPlanList = (id) => {
        deleproductPlanList(id).then(res => {
            goBack();
        })
    }

    const allRouter = [
        {
            title: "需求",
            defaultIcon: "workitem-default",
            id: `/product/${productId}/planDetail/${productPlanId}/type/demand`,
            key: "demand",
            encoded: "demand",
        },
        {
            title: "缺陷",
            defaultIcon: "workitem-default",
            id: `/product/${productId}/planDetail/${productPlanId}/type/defect`,
            key: "defect",
            encoded: "defect",
        },

    ];

    const [selectTab, setSelectTab] = useState("demand");

    const handleTabClick = (key, id) => {
        setSelectTab(key)
        props.history.push(id)
    }

    const goBack = () => {
        props.history.push(`/product/${productId}/productPlan`)
    }

    return (<Provider {...store}>
            <div className="productPlan-detail">

                <Row style={{
                    borderBottom: "1px solid var(--tiklab-gray)"
                }}>
                    <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "24", offset: "0" }} xxl={{ span: "24", offset: "0" }}>
                        <div className={"productPlan-detail-top"}>
                            {
                                productPlan &&
                                <div className="productPlan-detail-title"  onClick={goBack}>
                                    <svg className="icon-18" aria-hidden="true">
                                        <use xlinkHref="#icon-left"></use>
                                    </svg>
                                    <p className="productPlan-title">{productPlan?.productPlanName}</p>
                                </div>
                            }
                            {/*<ProductPlanDetailAside />*/}

                            <div className="productPlan-detail-tabs">
                                {
                                    allRouter.map(item => {
                                        return <div
                                            className={`productPlan-tab ${item.key === selectTab ? "productPlan-tab-active" : ""}`}
                                            key={item.key}
                                            onClick={() => handleTabClick(item.key, item.id)}
                                        >
                                            <span>{item.title}</span>
                                        </div>
                                    })
                                }
                            </div>

                            <div className="productPlan-detail-operate">
                                <svg className="svg-icon" aria-hidden="true" onClick={() => showModal("edit", productPlanId)}>
                                    <use xlinkHref="#icon-edit"></use>
                                </svg>
                                <DeleteModal deleteFunction={deleProductPlanList} id={productPlanId} />
                            </div>
                        </div>
                    </Col>
                </Row>

                <Row>
                    {
                        productPlan ?
                            <Layout className="productPlan-detail-content">
                                {renderRoutes(route.routes)}
                            </Layout>
                            :
                            <div className="productPlan-detail-empty">
                                <ProjectEmpty description="计划不存在或者已被删除"></ProjectEmpty>
                            </div>

                    }
                </Row>

            </div>
            <ProductPlanAddEditModal
                type={"edit"}
                productPlanId={productPlanId}
                productId={productId}
                uselist={uselist}
                getUseList={getUseList}
                productPlanStateList={productPlanStateList}
                setVisible={setVisible}
                visible={visible}
                {...props}
            />

        </Provider>

    )
}

export default inject("systemRoleStore")(observer(ProductPlanLayout));