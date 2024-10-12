import React from 'react';
import {LoginRpw} from "thoughtware-eam-ui";

const LoginRpwContent = props => {

    return (
        <LoginRpw
            {...props}
            loginGoRouter='/repository'
        />
    )
}

export default LoginRpwContent