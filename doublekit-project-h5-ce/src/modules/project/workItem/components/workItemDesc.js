import React, {useState} from "react";
import { DocumentEditor } from "doublekit-slate-h5-ui";
import { inject, observer, toJs } from "mobx-react";
import { toJS } from "mobx";
import "./workItemDesc.scss"
import { withRouter } from "react-router";
const WorkItemDesc = (props) => {
    const {workItemStore} = props;
    const {slateValue, setSlateValue} = workItemStore;

    const saveDesc = () => {
        console.log(slateValue)
        props.history.goBack()
    }
    return (
        <div>
            <div className="workItemDesc-title">
				<svg aria-hidden="true" className="back-icon">
					<use xlinkHref="#icon-fanhui"></use>
				</svg>
                <span onClick={()=> saveDesc()}>确定</span>
			</div>
            <DocumentEditor value = {toJS(slateValue)} onChange = {setSlateValue} {...props}/>
        </div>
    )
}
export default withRouter(inject("workItemStore")(observer(WorkItemDesc)));