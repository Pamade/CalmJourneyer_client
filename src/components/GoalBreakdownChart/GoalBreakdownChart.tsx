import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { GOALS } from '../../utils/sessionOptions';
import styles from './GoalBreakdownChart.module.scss';

interface GoalBreakdownChartProps {
    goalCounts: Record<string, number>;
}

const GoalBreakdownChart = ({ goalCounts }: GoalBreakdownChartProps) => {
    // Transform data for recharts
    const chartData = GOALS.map((goal) => {
        const Icon = goal.icon;
        return {
            id: goal.id,
            label: goal.label,
            count: goalCounts[goal.id] || 0,
            icon: Icon
        };
    });

    // Define colors for each goal (matching the icons)
    const COLORS: Record<string, string> = {
        STRESS_RELIEF: '#FF6B6B',
        FOCUS: '#4ECDC4',
        ENERGY: '#FFE66D',
        SLEEP: '#95E1D3',
        SILENCE: '#F38181'
    };

    // Custom tooltip
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const Icon = payload[0].payload.icon;
            return (
                <div className={styles.tooltip}>
                    <div className={styles.tooltipHeader}>
                        <Icon size={16} />
                        <span>{payload[0].payload.label}</span>
                    </div>
                    <p className={styles.tooltipValue}>
                        {payload[0].value} {payload[0].value === 1 ? 'session' : 'sessions'}
                    </p>
                </div>
            );
        }
        return null;
    };

    // Custom X-axis tick with icons
    const CustomXAxisTick = ({ x, y, payload }: any) => {
        const goal = GOALS.find(g => g.id === payload.value);
        if (!goal) return null;

        const Icon = goal.icon;
        return (
            <g transform={`translate(${x},${y})`}>
                <foreignObject x={-12} y={0} width={24} height={24}>
                    <div className={styles.xAxisIcon}>
                        <Icon size={16} style={{ color: COLORS[goal.id] }} />
                    </div>
                </foreignObject>
            </g>
        );
    };

    const maxValue = Math.max(...chartData.map(d => d.count), 1);

    return (
        <div className={styles.chartContainer}>
            <h3 className={styles.chartTitle}>Sessions by Goal</h3>
            <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                    <XAxis
                        dataKey="id"
                        tick={<CustomXAxisTick />}
                        axisLine={{ stroke: 'var(--border-color)' }}
                        tickLine={false}
                    />
                    <YAxis
                        axisLine={{ stroke: 'var(--border-color)' }}
                        tickLine={false}
                        tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                        domain={[0, maxValue]}
                        allowDecimals={false}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.id]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default GoalBreakdownChart;
