import React, {useState} from "react";
import WorkItemStatusPage from "../../../project/lineMap/component/WorkItemStatusPage";
import WorkItemTimePage from "../../../project/lineMap/component/WorkItemTimePage";
import {observer, Provider} from "mobx-react";
import ProductLineMapStore from "../store/ProductLineMapStore";
import ProductWorkItemStatusPage from "./ProductWorkItemStatusPage";
import "./ProductLineMap.scss"
import ProductWorkItemTimePage from "./ProductWorkItemTimePage";

const ProductLineMap = (props) => {
    const store = {
        lineMapStore: ProductLineMapStore,
    }
    // 当前显示路线图类型，迭代或版本
    const [type, setType] = useState("workItemTime");

    const { lineMapView } = ProductLineMapStore;
    /**
     * 根据页面显示类型加载页面
     * @returns 页面
     */
    const view = () => {
        let dom = <ProductWorkItemStatusPage />;
        switch (lineMapView) {
            case "workItemStatus":
                dom = <ProductWorkItemStatusPage />;
                break;
            case "workItemTime":
                dom = <ProductWorkItemTimePage />;
                break;
            default:
                dom = <ProductWorkItemTimePage />;
                break;
        }
        // console.log(JSON.stringify(props.route));
        return dom;
    }


    /**
     * 改变类型
     * @param {*}} e
     */
    const onChange = value => {
        setType(value)
    };

    return (
        <Provider {...store}>
            {view()}
        </Provider>


    )
};
export default observer(ProductLineMap);