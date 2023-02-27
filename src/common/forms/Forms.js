import React,{Fragment, useState} from "react";
import UserSelect from "./UserSelect";
import SelfInput from "./input";
import SelfInputNumber from "./inputNumber";
import SelfSwitch from "./SelfSwitch";
import SelfRadio from "./radio";
import SelfDatePicker from "./datePicker";
import SelfTextArea from "./SelfTextArea";
import SelfSelect from "./select";
import SelfCheckbox from "./checkbox";
import SelfTimePicker from "./SelfTimePicker";
import Area from "./area";
import SelfDateTimePicker from "./SelfDateTimePicker";
import SelfRangePicker from "./selfRangePicker";

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