import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

function PieChartComponent({ data1 }) {
    return (
        <div
            style={{
                marginLeft: "-4rem",
                marginTop: "-2.5rem",
            }}
        >
            <PieChart width={300} height={250} className="flex">
                <Pie
                    data={data1}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                >
                    {data1.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip />
                {/* <Legend
                    layout="horizontal"
                    iconSize={10}
                    wrapperStyle={{
                        position: "absolute",
                        // top: "50%",
                        // left: "90%",
                        transform: "translateY(-50%)",
                        width: "280px", 
                        textAlign: "left", 
                    }}
                /> */}
            </PieChart>
        </div>
    );
}

export default PieChartComponent;
