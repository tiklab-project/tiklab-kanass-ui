/*
 * @Descripttion: 版本页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-20 16:06:26
 */
import React, { useEffect } from "react";
import { Provider, observer } from "mobx-react";
import { Layout } from "antd";
import "../components/VersionLayout.scss";
import { renderRoutes } from "react-router-config";
import VersionDetailAside from "./VersionDetailAside";
import VersionDetailStore from "../store/VersionDetailStore";
import WorkStore from "../../../work/store/WorkStore";
// import { UserVerify } from "tiklab-user-extension-ui";

const Versiondetail = (props) => {
    const store = {
        versionDetailStore: VersionDetailStore
    }
    const { setSearchConditionNull, setTabValue } = WorkStore;
    useEffect(() => {
        setSearchConditionNull()
        setTabValue({id: "all", type: "system"})
        return () => {
            setSearchConditionNull()
            setTabValue({id: "all", type: "system"})
        }
    }, []);
    
    const { route } = props;
    return (<Provider {...store}>
        <Layout className="version-detail">
            <VersionDetailAside />
            <Layout className="version-detail-content">
                {renderRoutes(route.routes)}
            </Layout>
        </Layout>
    </Provider>
        
    )
}
// export default observer(UserVerify(Versiondetail,"/noAuth", "kanass"));
export default observer(Versiondetail);