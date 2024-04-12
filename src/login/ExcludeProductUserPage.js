import React from "react";
import {ExcludeProductUser} from "thoughtware-eam-ui";

/**
 * 用户没有应用访问权限
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const ExcludeProductUserPage = props => {
    return <ExcludeProductUser {...props}/>
}

export default ExcludeProductUserPage