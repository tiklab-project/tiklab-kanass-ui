import React from 'react';
import {LoginRpw} from "tiklab-eam-ui";

const LoginRpwContent = props => {

    return (
        <LoginRpw
            {...props}
            loginGoRouter='/repository'
        />
    )
}

export default LoginRpwContent