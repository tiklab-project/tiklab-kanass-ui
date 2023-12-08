import React,{useEffect, useState} from 'react';
import {SystemFlow} from "thoughtware-flow-ui";

const WorkTypeFlow = props => {

    return(
        <SystemFlow
            {...props} 
            id= {props.match.params.id}
            breadcrumbProps={[
                {
                    breadcrumbName: '事项类型列表', 
                    disabled:false,      
                    path: '/organ/worktype'     
                },
                {
                    breadcrumbName: '流程列表', 
                    disabled:false,         
                    path: ''     
                }         
            ]}
            />
    )
}

export default WorkTypeFlow;