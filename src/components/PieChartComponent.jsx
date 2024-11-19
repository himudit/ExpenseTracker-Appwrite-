import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

function PieChartComponent({ data1 }) {
    return (
        <div
            style={{
                marginLeft: "2rem",
                marginTop: "0.2rem",
            }}
        >
            <PieChart width={200} height={200}>
                <Pie
                    data={data1}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                >
                    {data1.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
        </div>
    );
}

export default PieChartComponent;
