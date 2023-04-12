import React,{ useState, useEffect, Fragment } from "react";
import { DatePicker } from "antd";
import { observer, inject } from "mobx-react";
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/lib/locale/zh_CN';

const SelfDatePicker = (props) => {
    const { onChange,value } = props;
    const [datePickerValue,setDatePickerValue] = useState()
    const onChangeDatePicker = (value) => {
        if(value){
            console.log(value.format('YYYY-MM-DD'))
            onChange(value.format('YYYY-MM-DD'))
        }
    }
    useEffect(()=> {
        setDatePickerValue(value)
        return;
    },[value])
    return (
        <Fragment>
            <DatePicker 
                onChange={onChangeDatePicker} 
                placeholder="请选择日期"
                format= 'YYYY-MM-DD'
                bordered = {false}
                value={
                    value === undefined ? value : moment(value, 'YYYY-MM-DD')
                    }
                
            />
        </Fragment>
        
    )
    
}

export default SelfDatePicker;