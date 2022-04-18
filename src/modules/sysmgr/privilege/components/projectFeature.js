import React, { Fragment, useEffect,useState } from "react";
import { PrivilegeProjectFeature } from 'doublekit-privilege-ui';

// 系统功能管理
const ProjectFeature = props => {


    return (
        <div className="test">
            <PrivilegeProjectFeature
                {...props}
            />
        </div>
    )
}

export default ProjectFeature;