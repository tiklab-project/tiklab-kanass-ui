/*
 * @Descripttion: 日历天视图，暂时不用
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-02-05 11:02:37
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-26 13:29:20
 */
import React,{ useEffect, useState, useImperativeHandle } from "react";
import { observer, inject } from "mobx-react";
import "./WorkCalendarDay.scss"

const WorkCalendarDay=(props) => {
    const {getCurrentDay,calendarMonth,workCalendarStore} = props;
    const {getMonthCalendarDay} = workCalendarStore;
    // 工具方法 - start
    const week = ["周日","周一","周二","周三","周四","周五","周六"]
    const [hour,setHour] = useState([])
    const getHour = ()=> {
        let time = []
        for(let i = 0;i<=23;i++){
            if(i<10){
                time.push(`0${i} : 00`)
            }else {
                time.push(`${i} : 00`)
            }
        }
        setHour(time)
    }

    const [currentDay,setCurrentDay] = useState()
    const [currentMonth,getCurrentMonth] = useState()
    const [currentYear,getCurrentYear] = useState()

    const getToday = ()=> {
        let nowDate = new Date();
        let year = nowDate.getFullYear();
        let month = nowDate.getMonth();
        let day = nowDate.getDate();
        // 父级事件
        let weekday = week[getWeekday(year,month,day)]
        getCurrentDay({year: year,month: month,day: day,weekday:weekday})
        getCurrentYear(year)
        getCurrentMonth(month)
        setCurrentDay(day)

        getMonthCount(year,month)
    
    }

    // 1.判断 平年闰年[四年一闰，百年不闰，四百年再闰]
    const isLeapYear = (year) => {
        return (year % 400 === 0) || (year % 100 !== 0 && year % 4 === 0);
    };
    
    // 当前月有几天
    const [maxDay,setMaxDay] = useState()
    // 2.获得每个月的日期有多少，注意 month - [0-11]
    const getMonthCount = (year, month,type) => {
        let arr = [
        31, null, 31, 30, 
        31, 30, 31, 31,
        30, 31, 30, 31
        ];
        let count = arr[month] || (isLeapYear(year) ? 29 : 28);
        if(type && type === "sub"){
            let weekday = week[getWeekday(year,month,count)]
            getCurrentDay({year: year,month: month,day: count,weekday:weekday})
            setCurrentDay(count)
        }
        if(type && type === "add"){
            let weekday = week[getWeekday(year,month,1)]
            getCurrentDay({year: year,month: month,day: 1,weekday:weekday})
            setCurrentDay(1)
        }
        
        setMaxDay(count)
    };


    // 3.获得某年某月某日是星期几，这里要注意的是 JS 的 API-getDay() 是从 [日-六](0-6)，返回 number
    const getWeekday = (year, month, day) => {
        let date = new Date(year, month, day);
        return date.getDay();
    };


    // 4.获得上个月的天数
    const getPreMonthCount = () => {
        if(currentDay-1 === 0){
            if (currentMonth === 0) {
                getCurrentYear(currentYear-1)
                getCurrentMonth(11)
                getMonthCount(currentYear - 1, 11,"sub");
            } else {
                getCurrentYear(currentYear)
                getCurrentMonth(currentMonth - 1)
                getMonthCount(currentYear, currentMonth - 1,"sub");
            }
        } else {
            let weekday = week[getWeekday(currentYear,currentMonth,currentDay-1)]
            getCurrentDay({year: currentYear,month: currentMonth,day: currentDay-1,weekday: weekday})
            setCurrentDay(currentDay-1)
        }
        
    };


    // 5.获得下个月的天数
    const getNextMonthCount = (year, month) => {
        if(currentDay+1 > maxDay){
            if (currentMonth === 11) {
                getCurrentYear(currentYear + 1)
                getCurrentMonth(0)
                getMonthCount(currentYear + 1, 0,"add");
            } else {
                getCurrentYear(currentYear)
                getCurrentMonth(currentMonth + 1)
                getMonthCount(currentYear, currentMonth + 1,"add");
            }
        }else {
            let weekday = week[getWeekday(currentYear,currentMonth,currentDay+1)]
            getCurrentDay({year: currentYear,month: currentMonth,day: currentDay+1,weekday: weekday})
            setCurrentDay(currentDay+1)
        }
    };
    
    useImperativeHandle(calendarMonth,()=> ({
        getNextMonthCount: getNextMonthCount,
        getPreMonthCount: getPreMonthCount,
        getToday: getToday
    }))
    
    const table = () => {
        let tr = []
        let td = []
        for(let i = 0;i<4;i++){
            td.push(<div className="week-quarter" key={i}></div>)
        }
        for(let i = 0;i<24;i++){
            tr.push(
            <div className="week-hour" key={i}>
                {td}
            </div>)
        }
        return (<div className="week-contant">{tr}</div>)
    }
    const [timeDate,setTimeDate] = useState()
    useEffect(()=> {
        getToday()
        getHour()
        let timeDate = []
        getMonthCalendarDay().then((res)=> {
            res.map((item,index)=> {
                timeDate.push({data: []})
                return item.data.map((itemHour,indexHour)=> {
                    let currentDay = `${itemHour.endTime.slice(0,10)} 00:00`;
                    let start = new Date(itemHour.startTime).getTime() - new Date(currentDay).getTime()
                    start = start/(1000 * 60 * 15) - 4
                    let height = new Date(itemHour.endTime).getTime() - new Date(itemHour.startTime).getTime()
                    height = height/(1000 * 60 * 15)
                    timeDate[index].data.push({start: start,height:height,name: itemHour.name,id: itemHour.id})
                    return timeDate
                })
            })
            setTimeDate(timeDate)
        })
        return;
    },[])
    return (
        <>
                <div className="calendar-day">
                    
                    <div className="week-table">
                        <div className="week-houtAxis">
                            {
                                hour.length>0 && hour.map((item,index)=> {
                                    return <div key={index} className="week-houtBox">
                                            {item}
                                        </div>
                                })
                            }
                        </div>
                        <div className="week-timeBox">
                            {table()}
                            <div className="week-contant week-time">
                                {
                                    timeDate && timeDate.map((item,index)=> {
                                        return <div key={index} className="week-col" style={{position: "relative"}}>
                                                    {
                                                        item.data && item.data.map((tdItem,tdIndex)=> {
                                                            return <div key={tdItem.id}  className="week-td"
                                                                style={{position: "absolute",top: `${tdItem.start*25}`,height: `${tdItem.height*25}`,width: "100%"}}>{tdItem.name}</div>
                                                        })
                                                    }
                                                </div>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
        </>
    );
}

export default inject("workCalendarStore")(observer(WorkCalendarDay));