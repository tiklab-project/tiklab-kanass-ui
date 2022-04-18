import React,{useEffect, useState} from 'react';
import {FlowDesign} from "doublekit-flow-ui";

const WorkTypeFlow = props => {
    useEffect(() => {
        return 
    }, [])

    return(
        <FlowDesign 
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