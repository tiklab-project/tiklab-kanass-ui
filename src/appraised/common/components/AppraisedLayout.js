/**
 * 评审页面
 */
import React, { useEffect } from "react";
import { Provider, observer } from "mobx-react";
import { Layout } from "antd";
import "./AppraisedLayout.scss";
import { renderRoutes } from "react-router-config";
import AppraisedDetailAside from "./AppraisedDetailAside";
import AppraisedDetailStore from "../store/AppraisedDetailStore";
import WorkStore from "../../../work/store/WorkStore";

const Appraiseddetail = (props) => {
    const store = {
        appraisedDetailStore: AppraisedDetailStore
    }
    // const { setSearchConditionNull, setTabValue } = WorkStore;
    // useEffect(() => {
    //     setSearchConditionNull()
    //     setTabValue({id: "all", type: "system"})
    //     return () => {
    //         setSearchConditionNull()
    //         setTabValue({id: "all", type: "system"})
    //     }
    // }, []);

    const { route } = props;
    return (<Provider {...store}>
            <Layout className="appraised-detail">
                <AppraisedDetailAside />
                <Layout className="appraised-detail-content">
                    {renderRoutes(route.routes)}
                </Layout>
            </Layout>
        </Provider>

    )
}
// export default observer(UserVerify(Appraiseddetail,"/noAuth", "kanass"));
export default observer(Appraiseddetail);