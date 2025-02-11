/*
 * @Author: 袁婕轩
 * @Date: 2024-07-01 18:13:18
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 17:41:52
 * @Description: 项目集
 */

import React, { useState } from "react";
import "../components/ProjectSetLayout.scss"
import { Layout } from 'antd';
import ProjectSetDetailAside from "./ProjectSetDetailAside";
import { renderRoutes } from "react-router-config";
import ProjectSetStore from "../../projectSet/store/ProjectSetStore"
import { Provider } from "mobx-react";
// import { UserVerify } from "tiklab-user-extension-ui";

const ProjectSetDetail = (props) => {
    const store = {
        projectSetStore: ProjectSetStore
    }
    const { route } = props;
    const [isShowText, SetIsShowText] = useState(false)
    return (<Provider {...store}>
        <Layout className="projectSet-detail">
            <ProjectSetDetailAside
                isShowText = {isShowText} 
                SetIsShowText = {SetIsShowText}
                {...props}
            />
            <Layout className="prodetail-content">
                {renderRoutes(route.routes)}
            </Layout>
        </Layout >
    </Provider>




    )
}
// export default UserVerify(ProjectSetDetail,"/noAuth", "kanass");
export default ProjectSetDetail;