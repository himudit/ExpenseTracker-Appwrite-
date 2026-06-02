import { useState } from "react";
import { PieChart, Pie, Cell } from "recharts";

function PieChartComponent({ data1 }) {
    const [activeIndex, setActiveIndex] = useState(null);

    const handleActivate = (_, index) => {
        setActiveIndex(index);
    };

    // const activeValue = activeIndex !== null ? data1[activeIndex].value : null;
    // const activeLabel = activeIndex !== null ? data1[activeIndex].name : '';
    const activeValue = activeIndex !== null && data1?.[activeIndex]?.value !== undefined
        ? data1[activeIndex].value
        : null;

    const activeLabel = activeIndex !== null && data1?.[activeIndex]?.name !== undefined
        ? data1[activeIndex].name
        : "";

    return (
        <div className="relative w-[300px] h-[250px] flex items-center justify-center -ml-[5rem]">
            <PieChart width={300} height={250}>
                <Pie
                    data={data1}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={60}
                    onMouseEnter={handleActivate}  // desktop hover
                    onClick={handleActivate}       // mobile tap
                >
                    {data1.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
            </PieChart>

            {/* Center label */}
            <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-center pointer-events-none">
                {activeIndex !== null ? (
                    <>
                        <p className="text-sm text-gray-500">{activeLabel}</p>
                        <p className="text-lg font-semibold text-gray-700">
                            ₹ {activeValue}
                        </p>
                    </>
                ) : (
                    <p className="text-sm text-gray-400">Tap a section</p>
                )}
            </div>
        </div>
    );
}

export default PieChartComponent;
