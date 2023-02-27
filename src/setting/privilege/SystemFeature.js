import React, { Fragment, useEffect,useState } from "react";
import { SystemFeatureList } from 'tiklab-privilege-ui';
import { inject, observer } from "mobx-react";

// 系统功能管理
const SystemFeature = props => {


    return (
        // <div className="test">
            <SystemFeatureList
                bgroup={'teamwire'}
                {...props}
            />
        // </div>
    )
}

export default inject("privilegeSystemStore")(observer(SystemFeature));