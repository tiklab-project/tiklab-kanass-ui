/*
 * @Author: 袁婕轩
 * @Date: 2024-07-01 18:13:18
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-25 15:46:36
 * @Description: 事项页面
 */

import React, {useEffect} from "react";
import WorkTable from "./WorkTable";
import WorkList from "./WorkList";
import WorkBodar from "./WorkBodar";
import WorkGantt from "./WorkGantt";
import WorkStore from "../store/WorkStore";
import { observer, Provider } from "mobx-react";
import WorkCalendarStore from '../store/WorkCalendarStore';
import workStore from "../store/WorkStore";
import {withRouter} from "react-router";
const Work = (props) => {
    // const { WorkGantt } = props;
    const { workShowType, setWorkShowType , setWorkTypeVisible, setQuickFilterVisible, setTableTitle} = WorkStore;
    const store = {
        workStore: WorkStore,
        workCalendarStore: WorkCalendarStore
    };
    const project = JSON.parse(localStorage.getItem("project"));
    const path = props.match.path;

    /**
     * 根据页面显示类型加载页面
     * @returns 页面
     */
    const view = () => {
        let dom = <WorkTable />;
        setTableTitle("所有事项")
        setWorkTypeVisible(false)
        setQuickFilterVisible(true)
        if (project?.projectType.type === "kanban"){
            setWorkShowType("bodar")
            dom = <WorkBodar />;
            return dom;
        }
        if (path.includes("/productPlan")){
            setWorkShowType("table")
            dom = <WorkTable />;
            return dom;
        }
        switch (workShowType) {
            case "table":
                dom = <WorkTable />;
                break;
            case "list":
                dom = <WorkList />;
                break;
            case "bodar":
                dom = <WorkBodar />;
                break;
            case "gantt":
                dom = <WorkGantt />;
                break;
            default:
                dom = <WorkTable />;
                break;
        }
        console.log(JSON.stringify(props.route));
        return dom;
    }

    return <Provider {...store}>
       {view()}
    </Provider>
}

export default withRouter(observer(Work));