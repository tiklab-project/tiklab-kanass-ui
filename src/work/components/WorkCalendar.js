/*
 * @Descripttion: 日历视图，暂时不用
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-02-05 11:02:37
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-26 13:24:21
 */
import React,{ useEffect, useState, useRef } from "react";
import WorkCalendarMonth from "./WorkCalendarMonth"
import WorkCalendarWeek from "./WorkCalendarWeek"
import WorkCalendarDay from "./WorkCalendarDay"
import { Button} from 'antd';
import { LeftOutlined,RightOutlined } from '@ant-design/icons';

const workCalendar=(props) => {
    const calendarMonth = useRef()
    const [year,setYear] = useState()
    const [month,setMonth] = useState()
    const [day,setDay] = useState()
    const [weekday,setWeekday] = useState()
    const getCurrentDay = (value)=> {
        setYear(value.year)
        setMonth(value.month)
        if(value.day){
            setDay(value.day)
            setWeekday(value.weekday)
        }
    }
    const [calendarType,setCalendarType] = useState("month");

    const getPreMonthCount = () => {
        calendarMonth.current.getPreMonthCount()
    }
    const getNextMonthCount = () => {
        calendarMonth.current.getNextMonthCount()
    }
    const getToday = () => {
        calendarMonth.current.getToday()
    }
    return (
        <>
            <div className="work-calendar">
                <div className="calendar-title">
                    <div className="calendar-change-date">
                        <Button type="primary" shape="round" onClick={()=>getToday()}>
                            今天
                        </Button>
                        
                        <Button shape="circle" icon={<LeftOutlined />} onClick={()=>getPreMonthCount()} />
                        <Button shape="circle" icon={<RightOutlined />} onClick={()=>getNextMonthCount()} />
                        {
                            day ? <span> {year}年{month + 1}月{day}日 {weekday}</span> : <span> {year}年{month + 1}月</span>
                        }
                        
                    </div>
                    <div className="calendar-change-view">
                        <div onClick={()=> {setCalendarType("day")}} 
                            className={calendarType=== "day" ? "calendar-select" : ""}>
                            日
                        </div>
                        <div
                            onClick={()=> {setCalendarType("month")}}  
                            className={calendarType=== "month" ? "calendar-select" : ""}>
                            月
                        </div>
                        <div onClick={()=> {setCalendarType("week")}} 
                            className={calendarType=== "week" ? "calendar-select" : ""}>
                            周
                        </div>
                    </div>
                </div>
                {
                    calendarType === "month" &&   
                        <WorkCalendarMonth
                            calendarMonth={calendarMonth}
                            getCurrentDay = {getCurrentDay}
                        />
                }

                {
                    calendarType === "week" &&  
                        <WorkCalendarWeek 
                            calendarMonth={calendarMonth}
                            getCurrentDay = {getCurrentDay}/>
                }

                {
                    calendarType === "day" && 
                        <WorkCalendarDay 
                            calendarMonth={calendarMonth}
                            getCurrentDay = {getCurrentDay}
                        />
                }
                
            </div>
        </>
    );
}

export default workCalendar;