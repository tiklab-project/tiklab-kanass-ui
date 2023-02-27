
import React from "react";
import {ProjectFormList} from 'tiklab-form-ui';

const ProjectForm = (props) => {
    const projectId = props.match.params.id;
    return (
        <ProjectFormList domainId = {projectId}/>
    )
}
export default ProjectForm;