/*
 * @Descripttion: 日历月视图，暂时不用
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-02-05 11:02:37
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-26 13:29:29
 */
import React,{ useEffect, useState, useImperativeHandle } from "react";
import { observer, inject } from "mobx-react";
import './WorkCalendarMonth.scss';

const WorkCalendarMonth=(props) => {
    const {getCurrentDay,calendarMonth,workCalendarStore} = props;
    const {getMonthCalendar,workCalendarListPre,workCalendarListCur,workCalendarListNext} = workCalendarStore;


    // 工具方法 - start
    const week = ["周日","周一","周二","周三","周四","周五","周六",]

    // 1.为了获得每个月的日期有多少，我们需要判断 平年闰年[四年一闰，百年不闰，四百年再闰]
    const isLeapYear = (year) => {
        return (year % 400 === 0) || (year % 100 !== 0 && year % 4 === 0);
    };

    const [calData,getCalData] = useState()
    // 2.获得每个月的日期有多少，注意 month - [0-11]
    const getMonthCount = (year, month) => {
        // debugger
        let arr = [
            31, null, 31, 30, 
            31, 30, 31, 31,
            30, 31, 30, 31
        ];
        let count = arr[month] || (isLeapYear(year) ? 29 : 28);
        let precount,nextFirstWeekDay,curFirstWeekDay,totalDay;
        let data = []
        // 计算上个月有几天
        if(month === 0){
            precount = arr[11]
        }else {
            precount = arr[month-1] || (isLeapYear(year) ? 29 : 28)
        }

        // 计算当月一号是周几
        curFirstWeekDay = getWeekday(year, month)

        // 计算下个月1号是周几
        if(month === 11){
            nextFirstWeekDay = 7- getWeekday(year + 1, 0)
        }else {
            nextFirstWeekDay = 7- getWeekday(year, month+1)
        }

        totalDay = count + curFirstWeekDay + nextFirstWeekDay

        for(let i=0; i<totalDay; i++){
            if(i < curFirstWeekDay){
                data = data.concat({value: precount+ 1 + i - curFirstWeekDay,type: "previous"} )
            }else if(i > count + curFirstWeekDay-1) {
                data = data.concat( {value: i - count - curFirstWeekDay +1,type: "next"} )
            }else {
                data = data.concat({value: i + 1 - curFirstWeekDay,type: "current"})
            }
        }
        getCalData(data)
    };


    // 3.获得某年某月的 1号 是星期几，这里要注意的是 JS 的 API-getDay() 是从 [日-六](0-6)，返回 number
    const getWeekday = (year, month) => {
        let date = new Date(year, month, 1);
        return date.getDay();
    };


    // 4.获得上个月的天数
    const getPreMonthCount = () => {
        if (currentMonth === 0) {
            getCurrentYear(currentYear-1)
            getCurrentMonth(11)
            getMonthCount(currentYear - 1, 11);
            // 父级事件
            getCurrentDay({year: currentYear-1,month: 11})
        } else {
            getCurrentYear(currentYear)
            getCurrentMonth(currentMonth - 1)
            getMonthCount(currentYear, currentMonth - 1);
            // 父级事件
            getCurrentDay({year: currentYear,month:  currentMonth - 1})
        }
    };


    // 5.获得下个月的天数
    const getNextMonthCount = (year, month) => {
        if (currentMonth === 11) {
            getCurrentYear(currentYear + 1)
            getCurrentMonth(0)
            getMonthCount(currentYear + 1, 0);
            // 父级事件
            getCurrentDay({year: currentYear+1,month: 0})
        } else {
            getCurrentYear(currentYear)
            getCurrentMonth(currentMonth + 1)
            getMonthCount(currentYear, currentMonth + 1);
            // 父级事件
            getCurrentDay({year: currentYear,month: currentMonth + 1})
        }
    };
    
    useImperativeHandle(calendarMonth,()=> ({
        getNextMonthCount: getNextMonthCount,
        getPreMonthCount: getPreMonthCount,
        getToday: getToday
    }))
    // 6.获取当前日期
    // const [currentDay,getCurrentDay] = useState()
    const [currentMonth,getCurrentMonth] = useState()
    const [currentYear,getCurrentYear] = useState()

    const getToday = ()=> {
        let nowDate = new Date();
        let year = nowDate.getFullYear();
        let month = nowDate.getMonth();
        let day = nowDate.getDate();
        // 父级事件
        getCurrentDay({year: year,month: month})
        getCurrentYear(year)
        getCurrentMonth(month)
        getMonthCount(year,month)
        getMonthCalendar(2+1)
    
    }
    const [showDaynum,setShowDaynum] = useState()
    const [showType,setShowType] = useState()
    const showDay = (type,day)=> {
        setShowDaynum(day)
        setShowType(type)
    }

    // 关闭更多框
    const closeMoreBox = () => {
        setShowDaynum()
        setShowType()
    }
    useEffect(()=> {
        getToday()
        return;
    },[])
    return (
        <div className="calendar-month">
            <div className="calendar-title">
                {
                    week.map((item,index)=> {
                        return <div key={index} className="cakendar-weekitem">{item}</div>
                    })
                }
            </div>

            
            <div className="calendar-box">
                {
                    calData && calData.map((item,index)=> {
                    return <div className={`calendar-day ${item.type}`} key={index}>
                                {item.value}
                                {
                                    item.type === "previous" && workCalendarListPre && workCalendarListPre[item.value] && workCalendarListPre[item.value].length> 0 && 
                                        <div>
                                            <div>{workCalendarListPre[item.value][0].name}</div>
                                            <div>{workCalendarListPre[item.value][1].name}</div>
                                            <div>{workCalendarListPre[item.value][2].name}</div>
                                            {
                                                workCalendarListPre[item.value].length> 3 && <div onClick={()=>showDay(item.type,item.value)}>查看更多...</div>
                                            }
                                        </div>
                                }
                                {
                                    item.type === "current" && workCalendarListPre &&  workCalendarListCur[item.value] && workCalendarListCur[item.value].length> 0 && 
                                        <div>
                                            <div>{workCalendarListCur[item.value][0].name}</div>
                                            <div>{workCalendarListCur[item.value][1].name}</div>
                                            <div>{workCalendarListCur[item.value][2].name}</div>
                                            {
                                                workCalendarListCur[item.value].length> 3 && <div onClick={()=>showDay(item.type,item.value)}>查看更多...</div>
                                            }
                                        </div>
                                }
                                {
                                    item.type === "next" && workCalendarListPre && workCalendarListNext[item.value] && workCalendarListNext[item.value].length> 0 && 
                                        <div>
                                            <div>{workCalendarListNext[item.value][0].name}</div>
                                            <div>{workCalendarListNext[item.value][1].name}</div>
                                            <div>{workCalendarListNext[item.value][2].name}</div>
                                            {
                                                workCalendarListNext[item.value].length> 3 && <div onClick={()=>showDay(item.type,item.value)}>查看更多...</div>
                                            }
                                        </div>
                                }
                                <div className={`calendar-showMore ${item.value === showDaynum && item.type === showType ? "calendar-show" : ""}`}
                                    onClick={closeMoreBox}
                                >
                                </div>
                                <div className={`calendar-showMore-box ${item.value === showDaynum && item.type === showType ? "calendar-show" : ""}`}>
                                    {
                                        showType === "previous" && workCalendarListPre && 
                                            workCalendarListPre[showDaynum].map((workItem,index)=>{
                                                return <div>{workItem.name}</div>
                                            })
                                    }
                                    {
                                        showType === "current" && workCalendarListCur && 
                                            workCalendarListCur[showDaynum].map((workItem,index)=>{
                                                return <div>{workItem.name}</div>
                                            })
                                    }
                                    {
                                        showType === "next" && workCalendarListNext &&
                                            workCalendarListNext[showDaynum].map((workItem,index)=>{
                                                return <div>{workItem.name}</div>
                                            })
                                    }
                                </div>
                            
                                
                            </div>
                    })  
                }
            </div>
        </div>
    );
}

export default inject("workCalendarStore")(observer(WorkCalendarMonth));