import React,{useEffect, useState} from 'react';
import {PreliminaryType} from "tiklab-form-ui";

const WorkTypeForm = props => {

    return(
        <PreliminaryType 
            {...props} 
            formId={props.match.params.id}
            breadcrumbProps={[
                {
                    breadcrumbName: '事项类型列表', 
                    disabled:false,      
                    path: '/organ/worktype'     
                },
                {
                    breadcrumbName: '表单列表', 
                    disabled:false,         
                    path: ''     
                }         
            ]}
        />
    )
}

export default WorkTypeForm;