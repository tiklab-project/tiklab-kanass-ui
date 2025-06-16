const defaultDateFormat = "YYYY-MM-DD";

const getNowFormatDate = () => {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
};

const getFirstDayOfMonth = () => {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;  // 月份从0开始，所以要加1
    var strDate = "01";  // 第一天固定是1号

    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }

    var firstDay = year + seperator1 + month + seperator1 + strDate;
    return firstDay;
};

const getLastDayOfMonth = () => {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;

    // 获取下个月的第0天，即当前月的最后一天
    var lastDate = new Date(year, month, 0).getDate();
    var strDate = lastDate.toString();

    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (lastDate >= 0 && lastDate <= 9) {
        strDate = "0" + strDate;
    }

    var lastDay = year + seperator1 + month + seperator1 + strDate;
    return lastDay;
};



export {getNowFormatDate, defaultDateFormat, getFirstDayOfMonth, getLastDayOfMonth};