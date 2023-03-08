import React from "react";
import { SystemFeature } from 'tiklab-privilege-ui';
import { inject, observer } from "mobx-react";

// 系统功能管理
const SystemFeatureList = props => {


    return (
        // <div className="test">
            <SystemFeature
                bgroup={'teamwire'}
                {...props}
            />
        // </div>
    )
}

export default inject("privilegeSystemStore")(observer(SystemFeatureList));