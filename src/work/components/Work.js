/*
 * @Author: 袁婕轩
 * @Date: 2024-07-01 18:13:18
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-20 16:36:43
 * @Description: 事项页面
 */

import React from "react";
import WorkTable from "./WorkTable";
import WorkList from "./WorkList";
import WorkBodar from "./WorkBodar";
import WorkStore from "../store/WorkStore";
import { observer, Provider } from "mobx-react";
import WorkCalendarStore from '../store/WorkCalendarStore';
const Work = (props) => {
    const { WorkGantt } = props;
    const { workShowType } = WorkStore;
    const store = {
        workStore: WorkStore,
        workCalendarStore: WorkCalendarStore
    };
    const view = () => {
        let dom = <WorkTable />;
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
        return dom;
    }

    return <Provider {...store}>
       {view()}
    </Provider>
}

export default observer(Work);