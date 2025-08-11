import React, {useEffect, useState} from "react";
import {observer, Provider} from "mobx-react";
import {Layout, Spin} from "antd";
import ProductContent from "../../../product/product/components/ProductTable";
import ProductGide from "./ProductGide";
import {withRouter} from "react-router";
import ProductStore from "../store/ProductStore";
import "./Product.scss"

const Product = (props) => {
    const store = {
        productStore: ProductStore
    }
    const [loading, setLoading] = useState(true)

    const { findAllProduct, productList, findProductPage } = ProductStore;
    //初始化获取项目列表
    useEffect(() => {
        setLoading(true)
        // findAllProduct({}).then(res => {
        //     setLoading(false)
        // })
        findProductPage({}).then(res => {
            setLoading(false)
        })
        return;
    }, [])

    return (<Provider {...store}>
            <div className="product">
                <Spin spinning={loading} tip="加载中..." >

                    <Layout className="product-content">
                        {
                            productList && productList.length > 0 ?
                                <ProductContent /> :
                                <>
                                    {
                                        !loading && <ProductGide />
                                    }
                                </>
                            // <ProductContent />
                        }
                    </Layout>
                </Spin>

            </div>
        </Provider>


    )
}
export default withRouter(observer(Product));