import React, { useEffect, useRef, useMemo } from 'react';
import { Card } from 'antd';
import * as echarts from 'echarts';

const TestInstancePie = ({ data = {} }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const option = useMemo(() => ({
        tooltip: {
            trigger: 'item',
            formatter: (params) => {
                const value = params.value || 0;
                const percent = params.percent || 0;
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
                name: '测试实例统计',
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
                        const value = params.value || 0;
                        const percent = params.percent || 0;
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
                    { value: data.successCount || 0, name: '成功', itemStyle: { color: '#52c41a' } },
                    { value: data.failCount || 0, name: '失败', itemStyle: { color: '#f5222d' } }
                ]
            },
            {
                name: '总数',
                type: 'pie',
                radius: ['0', '30%'],
                label: {
                    show: true,
                    position: 'center',
                    formatter: `总数\n${data.total || 0}`,
                    fontSize: 14,
                    fontWeight: 'bold'
                },
                data: [{ value: data.total || 0 }],
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
            title="测试统计" 
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

export default TestInstancePie;