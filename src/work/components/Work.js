import React, { useEffect } from "react";
import { renderRoutes } from "react-router-config";

const Work = (props) => {
    const { route } = props;


    return <>
        {renderRoutes(route.routes)}
    </>
}

export default Work;