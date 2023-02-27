import {serviceLoc} from "../../common/utils/requset";

// 请求接口
export function GetMonthCalendar(data){
    return serviceLoc.request({
        url: "/calendar",
        method: "post",
        data 
        //请求类型为post 时，
        // params: data 请求类型为get时
    })
}

// 请求接口
export function GetMonthCalendarDay(data){
    return serviceLoc.request({
        url: "/calendarDay",
        method: "post",
        data 
        //请求类型为post 时，
        // params: data 请求类型为get时
    })
}

// 请求接口
export function GetMonthCalendarWeek(data){
    return serviceLoc.request({
        url: "/calendarWeek",
        method: "post",
        data 
        //请求类型为post 时，
        // params: data 请求类型为get时
    })
}