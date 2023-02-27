import React,{useEffect, useState} from 'react';
import {PreliminaryTypeList} from "tiklab-form-ui";

const WorkTypeForm = props => {

    return(
        <PreliminaryTypeList 
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