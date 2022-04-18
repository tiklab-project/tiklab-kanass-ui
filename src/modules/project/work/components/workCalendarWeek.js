import React,{ useEffect, useState, useImperativeHandle } from "react";
import { observer, inject } from "mobx-react";
import "./calendarWeek.scss"

const WorkCalendarWeek=(props) => {
    const {getCurrentDay,calendarMonth,workCalendarStore} = props;
    const {getMonthCalendarWeek} = workCalendarStore
    // 工具方法 - start
    const week = ["周日","周一","周二","周三","周四","周五","周六"]
    const [hour,setHour] = useState([])
    const getHour = ()=> {
        let time = []
        for(let i = 1;i<=24;i++){
            if(i<10){
                time.push(`0${i} : 00`)
            }else {
                time.push(`${i} : 00`)
            }
        }
        setHour(time)
    }

    // 1.为了获得每个月的日期有多少，我们需要判断 平年闰年[四年一闰，百年不闰，四百年再闰]
    const isLeapYear = (year) => {
        return (year % 400 === 0) || (year % 100 !== 0 && year % 4 === 0);
    };

    // 2.当前日期是日历中的第几周
    const [currentWeek,setCurrentWeek] = useState()
    // 2.获得每个月的日期有多少，注意 month - [0-11]
    const getMonthCount = (year, month,day) => {
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
        let currentWeek = Math.floor((curFirstWeekDay + day )/7)
        setCurrentWeek(currentWeek)
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
        getWeekDate(data)
    };

    // 周历
    const [weekData,getWeekData] = useState([])
    // 本月有几周
    const [weekNum,getWeekNum] = useState()
    const getWeekDate= (data)=> {
        let weekNum = data.length/7;
        getWeekNum(weekNum)
        let weeKData = [];
        for(let i = 0;i<weekNum;i++){
            weeKData[i] = data.slice(i*7,(i+1) *7)
        }
        getWeekData(weeKData)
    }

    // 3.获得某年某月的 1号 是星期几，这里要注意的是 JS 的 API-getDay() 是从 [日-六](0-6)，返回 number
    const getWeekday = (year, month) => {
        let date = new Date(year, month, 1);
        return date.getDay();
    };


    // 4.获得上个月的天数
    const getPreMonthCount = () => {
        if(currentWeek === 0) {
            if (currentMonth === 0) {
                getCurrentYear(currentYear-1)
                getCurrentMonth(11)
                getMonthCount(currentYear - 1, 11,1);
                // 父级事件
                getCurrentDay({year: currentYear-1,month: 11})
            } else {
                getCurrentYear(currentYear)
                getCurrentMonth(currentMonth - 1)
                getMonthCount(currentYear, currentMonth - 1,1);
                // 父级事件
                getCurrentDay({year: currentYear,month:  currentMonth - 1})
            }
        }else {
            setCurrentWeek(currentWeek+1)
        }
        
    };

    // 5.获得下个月的天数
    const getNextMonthCount = () => {
        if(currentWeek+1 >= weekNum){
            if (currentMonth === 11) {
                getCurrentYear(currentYear + 1)
                getCurrentMonth(0)
                getMonthCount(currentYear + 1, 0,1);
                // 父级事件
                getCurrentDay({year: currentYear+1,month: 0})
            } else {
                getCurrentYear(currentYear)
                getCurrentMonth(currentMonth + 1)
                getMonthCount(currentYear, currentMonth + 1,1);
                // 父级事件
                getCurrentDay({year: currentYear,month: currentMonth + 1})
            }
        }else {
            setCurrentWeek(currentWeek+1)
        }
    };
    
    useImperativeHandle(calendarMonth,()=> ({
        getNextMonthCount: getNextMonthCount,
        getPreMonthCount: getPreMonthCount,
        getToday: getToday
    }))
    // 6.获取当前日期
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

        getMonthCount(year,month,day)
    
    }
    const table = () => {
        let tr = []
        let td = []
        let col = []
        for(let i = 0;i<4;i++){
            td.push(<div className="week-quarter" key={i}></div>)
        }
        for(let i = 0;i<24;i++){
            tr.push(
            <div className="week-hour" key={i}>
                {td}
            </div>)
        }
        for(let i = 0;i<7;i++){
            col.push(
            <div className="week-col" key={i}>
                {tr}
            </div>)
        }
        return col
    }

    const [timeDate,setTimeDate] = useState()
    useEffect(()=> {
        getToday()
        getHour()
        let timeDate = []
        getMonthCalendarWeek().then((res)=> {
            console.log(res)
            
            res.map((item,index)=> {
                timeDate.push({data: []})
                return item.data.map((itemDay,indexDay)=> {
                    timeDate[index].data.push({data: []})
                    return itemDay.data.map((itemHour,indexHour)=> {
                        let currentDay = `${itemHour.endTime.slice(0,10)} 00:00`;
                        let start = new Date(itemHour.startTime).getTime() - new Date(currentDay).getTime()
                        start = start/(1000 * 60 * 15) - 4
                        let height = new Date(itemHour.endTime).getTime() - new Date(itemHour.startTime).getTime()
                        height = height/(1000 * 60 * 15)
                        timeDate[index].data[indexDay].data.push({start: start,height:height,name: itemHour.name,id: itemHour.id})
                        return timeDate
                    })
                    
                })
            })
            console.log(timeDate)
            setTimeDate(timeDate)
        })
    },[])
    return (
        <>
                <div className="calendar-week">
                    <div className="week-hearder">
                    {
                        console.log(currentWeek,weekData)
                    }
                        {
                            weekData.length>0 && weekData[currentWeek].map((item,index)=> {
                                return  <div className={`calendar-day ${item.type}`} key={index}>
                                            {week[index]}，{currentMonth+1}月{item.value}日
                                        </div>
                                
                            })  
                        }
                    </div>
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
                        <div className="week-Box">
                            <div className="week-timeBox">
                                {table()}
                            </div>
                            <div className="week-contant week-time">
                                {
                                    timeDate && timeDate.map((item,index)=> {
                                        return <div key={index} className="week-day" style={{position: "relative"}}>
                                            {
                                                item.data && item.data.map((itemDay,dayIndex)=> {
                                                    return <div key={dayIndex} className="week-col">
                                                        {
                                                            itemDay.data && itemDay.data.map((tdItem,tdIndex)=> {
                                                                return <div key={tdItem.id}  className="week-td"
                                                                    style={{position: "absolute",top: `${tdItem.start*25}`,height: `${tdItem.height*25}`,width: "100%"}}>{tdItem.name}</div>
                                                            })
                                                        }
                                                    </div>
                                                })
                                            } 
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                        
                        {/* {table()} */}
                    </div>
                    
                </div>
                
            
        </>
    );
}

export default inject("workCalendarStore")(observer(WorkCalendarWeek));