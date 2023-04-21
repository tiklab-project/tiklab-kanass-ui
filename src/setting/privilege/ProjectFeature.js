import React, { Fragment, useEffect,useState } from "react";
import { ProjectFeature } from 'tiklab-privilege-ui';
import { inject, observer } from "mobx-react";

// 系统功能管理
const ProjectFeatureList = props => {


    return (
        // <div className="test">
            <ProjectFeature
                bgroup={'teamwire'}
                {...props}
            />
        // </div>
    )
}

export default inject("privilegeProjectFeatureStore")(observer(ProjectFeatureList));