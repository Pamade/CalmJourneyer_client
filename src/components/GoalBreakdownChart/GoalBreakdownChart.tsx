import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { GOALS } from '../../utils/sessionOptions';
import styles from './GoalBreakdownChart.module.scss';

interface GoalBreakdownChartProps {
    goalCounts: Record<string, number>;
}

const GoalBreakdownChart = ({ goalCounts }: GoalBreakdownChartProps) => {
    // Transform data for recharts - filter out goals with 0 count
    const chartData = GOALS.map((goal) => ({
        id: goal.id,
        label: goal.label,
        count: goalCounts[goal.id] || 0,
        icon: goal.icon
    })).filter(item => item.count > 0);

    // Define colors for each goal
    const COLORS: Record<string, string> = {
        STRESS_RELIEF: '#FF6B6B',
        FOCUS: '#4ECDC4',
        ENERGY: '#FFE66D',
        SLEEP: '#95E1D3',
        SILENCE: '#F38181'
    };

    // Custom tooltip
    // const CustomTooltip = ({ active, payload }: any) => {
    //     if (active && payload && payload.length) {
    //         const Icon = payload[0].payload.icon;
    //         const total = chartData.reduce((sum, item) => sum + item.count, 0);
    //         const percentage = ((payload[0].value / total) * 100).toFixed(1);

    //         return (
    //             <div className={styles.tooltip}>
    //                 <div className={styles.tooltipHeader}>
    //                     <Icon size={18} />
    //                     <span>{payload[0].payload.label}</span>
    //                 </div>
    //                 <p className={styles.tooltipValue}>
    //                     {payload[0].value} {payload[0].value === 1 ? 'session' : 'sessions'} ({percentage}%)
    //                 </p>
    //             </div>
    //         );
    //     }
    //     return null;
    // };

    // Custom legend
    const CustomLegend = ({ payload }: any) => {
        return (
            <div className={styles.legend}>
                {payload.map((entry: any, index: number) => {
                    const Icon = entry.payload.icon;
                    return (
                        <div key={`legend-${index}`} className={styles.legendItem}>
                            <div className={styles.legendColor} style={{ backgroundColor: entry.color }} />
                            <Icon size={16} style={{ color: entry.color }} />
                            <span className={styles.legendLabel}>{entry.value}</span>
                            <span className={styles.legendCount}>({entry.payload.count})</span>
                        </div>
                    );
                })}
            </div>
        );
    };

    if (chartData.length === 0) {
        return (
            <div className={styles.chartContainer}>
                <h3 className={styles.chartTitle}>Sessions by Goal</h3>
                <div className={styles.emptyState}>
                    <p>No sessions yet</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.chartContainer}>
            <h3 className={styles.chartTitle}>Sessions by Goal</h3>
            <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                    <Pie
                        data={chartData}
                        dataKey="count"
                        nameKey="label"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={50}
                        paddingAngle={2}
                    // label={(entry: any) => `${(entry.percent * 100).toFixed(0)}%`}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.id]} />
                        ))}
                    </Pie>
                    {/* <Tooltip content={<CustomTooltip />} /> */}
                    <Legend content={<CustomLegend />} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default GoalBreakdownChart;
