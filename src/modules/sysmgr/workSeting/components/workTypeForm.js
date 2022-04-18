import React,{useEffect, useState} from 'react';
import {FormDesign} from "doublekit-form-ui";

const WorkTypeForm = props => {

    return(
        <FormDesign 
            {...props} 
            formId={props.match.params.id}
            breadcrumbProps={[
                {
                    breadcrumbName: '事项类型列表', 
                    disabled:false,      
                    path: '/index/organ/worktype'     
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