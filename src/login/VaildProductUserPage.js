import React from "react";
import { NoProductAuthUser } from 'tiklab-eam-ui';
import { inject,observer } from "mobx-react";
const VailProductUserPage = (props) => {
    return (
        <NoProductAuthUser {...props}/>
    )
}
export default inject("eamStore")(observer(VailProductUserPage));