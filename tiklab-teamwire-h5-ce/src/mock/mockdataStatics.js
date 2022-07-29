import Mock from "mockjs";

const data = [
    {
        key: '1',
        name: 'John Brown',
        num: 32,
        pre: '32%',
    },
    {
        key: '2',
        name: 'Jim Green',
        num: 28,
        pre: '28%'
    },
    {
        key: '3',
        name: 'Joe Black',
        num: 40,
        pre: '40%'
    }
];

Mock.mock("/statisticsWork", { data });

const usedata = [
    {
        key: '1',
        name: 'John Brown',
        num: 50,
        pre: '50%',
    },
    {
        key: '2',
        name: 'Jim Green',
        num: 10,
        pre: '10%'
    },
    {
        key: '3',
        name: 'Joe Black',
        num: 40,
        pre: '40%'
    }
];
Mock.mock("/statisticsUser", { usedata });

