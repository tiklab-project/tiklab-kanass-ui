import React, { useEffect } from "react";
import { renderRoutes } from "react-router-config";
import WorkStore from "../store/WorkStore";
import { finWorkList } from "./WorkGetList";

const Work = (props) => {
    const { route } = props;


    return <>
        {renderRoutes(route.routes)}
    </>
}

export default Work;