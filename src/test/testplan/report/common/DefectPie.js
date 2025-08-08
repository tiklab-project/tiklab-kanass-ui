import React, { useEffect, useRef, useMemo } from 'react';
import { Card } from 'antd';
import * as echarts from 'echarts';

const DefectPie = ({ data = {} }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const option = useMemo(() => ({
        tooltip: {
            trigger: 'item',
            formatter: (params) => {
                const value = params.value ?? 0;
                let percent = params.percent;
                if (percent === undefined || isNaN(percent)) percent = 0;
                return `${params.name}: ${value} (${percent}%)`;
            } 
        },
        legend: {
            orient: 'vertical',
            right: 10,
            top: 'center'
        },
        series: [
            {
                name: '缺陷状态统计',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: true,
                    position: 'outside',
                    formatter: (params) => {
                        const value = params.value ?? 0;
                        let percent = params.percent;
                        if (percent === undefined || isNaN(percent)) percent = 0;
                        return `${params.name}\n${value} (${percent}%)`;
                    },
                    fontSize: 12
                },
                labelLine: {
                    show: true,
                    length: 10,
                    length2: 10
                },
                data: [
                    { value: data?.todoStatusCount || 0, name: '待办', itemStyle: { color: '#faad14' } },
                    { value: data?.progressStatusCount || 0, name: '进行中', itemStyle: { color: '#1890ff' } },
                    { value: data?.doneStatusCount || 0, name: '完成', itemStyle: { color: '#52c41a' } }
                ]
            },
            {
                name: '总数',
                type: 'pie',
                radius: ['0', '30%'],
                label: {
                    show: true,
                    position: 'center',
                    formatter: `总数\n${data?.total || 0}`,
                    fontSize: 14,
                    fontWeight: 'bold'
                },
                data: [{ value: data?.total || 0 }],
                silent: true,
                itemStyle: {
                    color: 'transparent'
                }
            }
        ]
    }), [data]);

    useEffect(() => {
        if (chartRef.current) {
            chartInstance.current = echarts.init(chartRef.current);
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.dispose();
            }
        };
    }, []);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.setOption(option);
        }
    }, [option]);

    useEffect(() => {
        const handleResize = () => {
            if (chartInstance.current) {
                chartInstance.current.resize();
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <Card 
            title="缺陷统计" 
            style={{ 
                background: '#f7f8f9',
                height: '100%',
                borderRadius: 12,
            }}
            headStyle={{ textAlign: 'left' }}
        >
            <div ref={chartRef} style={{ width: '100%', height: '300px' }} />
        </Card>
    );
};

export default DefectPie;
