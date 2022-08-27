import React, {useState} from "react";
import { DocumentEditor } from "tiklab-slate-h5-ui";
import { inject, observer, toJs } from "mobx-react";
import { toJS } from "mobx";
import "./workItemDesc.scss"
import { withRouter } from "react-router";
const WorkItemDesc = (props) => {
    const {workItemStore} = props;
    const {slateValue, setSlateValue, editWork} = workItemStore;
    const workItemId = props.match.params.id ? props.match.params.id : null
    console.log(props)
    const saveDesc = () => {
        if(workItemId){
            const value = {
                id: workItemId,
                desc: JSON.stringify(slateValue),
                updateField: "desc"
            }
            editWork(value).then(res => {
                if(res.code === 0){
                    props.history.goBack()
                }
            })
        }
        
        
    }
    return (
        <div>
            <div className="workItemDesc-title">
				<svg aria-hidden="true" className="back-icon" onClick={saveDesc}>
					<use xlinkHref="#icon-fanhui"></use>
				</svg>
                <span className="workItemDesc-name">事项描述</span>
                <span onClick={()=> saveDesc()}>确定</span>
			</div>
            <DocumentEditor value = {toJS(slateValue)} onChange = {setSlateValue} showMenu = {true} {...props}/>
        </div>
    )
}
export default withRouter(inject("workItemStore")(observer(WorkItemDesc)));