import React from "react";
import nodata from "../../assets/images/nodata.png";
import { Empty } from "antd";

const ProjectEmpty = (props) => {
    const {description, children} = props;

    return <Empty description={description}>
        {children}
    </Empty>
}

export default ProjectEmpty;