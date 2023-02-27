import React,{useEffect, useState} from 'react';
import {SystemFlowList} from "tiklab-flow-ui";

const WorkTypeFlow = props => {

    return(
        <SystemFlowList 
            {...props} 
            id= {props.match.params.id}
            breadcrumbProps={[
                {
                    breadcrumbName: '事项类型列表', 
                    disabled:false,      
                    path: '/index/organ/worktype'     
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