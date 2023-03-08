import React,{Fragment, useState} from "react";
import UserSelect from "./UserSelect";
import SelfInput from "./SelfInput";
import SelfInputNumber from "./SelfInputNumber";
import SelfSwitch from "./SelfSwitch";
import SelfRadio from "./SelfRadio";
import SelfDatePicker from "./SelfDatePicker";
import SelfTextArea from "./SelfTextArea";
import SelfSelect from "./SelfSelect";
import SelfCheckbox from "./SelfCheckbox";
import SelfTimePicker from "./SelfTimePicker";
import Area from "./Area";
import SelfDateTimePicker from "./SelfDateTimePicker";
import SelfRangePicker from "./SelfRangePicker";

const Forms = (props) => {
    const {formType,selectKey,type} = props;
    console.log(props)
    return (
        <Fragment>
            {
                (()=> {
                    switch(formType) {
                        case "UserSelect": 
                            return <UserSelect selectKey={selectKey} type ={type} {...props}/>;
                        case "Input":
                            return <SelfInput {...props} />;
                        case "InputNumber": 
                            return <SelfInputNumber {...props} />;
                        case "Switch":
                            return <SelfSwitch {...props} />;
                        case "Radio": 
                            return <SelfRadio {...props} />;
                        case "date":
                            return <SelfDatePicker {...props} />;
                        case "TimePicker":
                            return <SelfTimePicker {...props} />;
                        case "TextArea":
                            return <SelfTextArea {...props} />;
                        case "Select":
                            return <SelfSelect type ={type} {...props} />;
                        case "Checkbox":
                            return <SelfCheckbox {...props} />;
                        case "Area":
                            return <Area {...props}/>;
                        case "DateTime":
                            return <SelfDateTimePicker {...props}/>
                        case "DateRange": 
                            return <SelfRangePicker {...props}/>
                    }
                })()
            }
        </Fragment>
    )
    
}

export default Forms;