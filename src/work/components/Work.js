import React, { useEffect } from "react";
import { renderRoutes } from "react-router-config";
import WorkTable from "./WorkTable";
import WorkList from "./WorkList";
import WorkBodar from "./WorkBodar";
// import WorkGantt from "./WorkGantt";
import WorkStore from "../store/WorkStore";
import { observer } from "mobx-react";

const Work = (props) => {
    const { WorkGantt } = props;
    const { workShowType } = WorkStore
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

    return <>
       {view()}
    </>
}

export default observer(Work);