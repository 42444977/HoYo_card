import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { DistributionPoint } from '../../types/gacha';
import './DistributionChart.css';

interface DistributionChartProps {
    distribution: DistributionPoint[];
}

/**
 * 概率分佈圖表元件
 * 使用 Recharts 繪製累積概率分佈曲線
 */
function DistributionChart({ distribution }: DistributionChartProps) {
    // 將概率轉為百分比格式
    const chartData = distribution.map((d) => ({
        pulls: d.pulls,
        probability: Math.round(d.probability * 10000) / 100,
    }));

    return (
        <div className="distribution-chart">
            <h3 className="chart-title">累積概率分佈</h3>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorProbability" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--accent-color)" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="var(--accent-color)" stopOpacity={0.02} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(255, 255, 255, 0.06)"
                        />
                        <XAxis
                            dataKey="pulls"
                            stroke="rgba(255, 255, 255, 0.3)"
                            fontSize={12}
                            tickFormatter={(v: number) => `${v}`}
                            label={{ value: '抽數', position: 'insideBottomRight', offset: -5, fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
                        />
                        <YAxis
                            stroke="rgba(255, 255, 255, 0.3)"
                            fontSize={12}
                            tickFormatter={(v: number) => `${v}%`}
                            domain={[0, 100]}
                        />
                        <Tooltip
                            contentStyle={{
                                background: 'rgba(20, 20, 40, 0.95)',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                borderRadius: '10px',
                                fontSize: '0.85rem',
                                color: '#fff',
                            }}
                            formatter={(value) => [`${value}%`, '達成概率']}
                            labelFormatter={(label) => `${label} 抽`}
                        />
                        <Area
                            type="monotone"
                            dataKey="probability"
                            stroke="var(--accent-color)"
                            strokeWidth={2.5}
                            fill="url(#colorProbability)"
                            animationDuration={800}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default React.memo(DistributionChart);
