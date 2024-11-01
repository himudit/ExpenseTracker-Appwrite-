import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

function PieChartComponent({ data1 }) {
    const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#0088fe", "#00c49f", "#ffbb28", "#ff8042", "#0088ff", "#ff6347"];
    return (
        <div
            style={{
                // display: "flex",
                // justifyContent: "center",
                // alignItems: "center",
                // padding: "20px",
                // margin: "10px",
                marginLeft: "2rem",
                marginTop: "0.2rem",
                // backgroundColor: "#f5f5f5",
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
                    fill="#8884d8"
                    // label={(entry) => `${entry.name}: ${entry.value}`}
                    // labelLine={false} // Optional: removes the line connecting labels to slices
                >
                    {data1.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
        </div >
    );

}

export default PieChartComponent

// import React from 'react';
// import { PieChart, Pie, Cell, Tooltip } from 'recharts';

// function PieChartComponent({ data1 }) {
//     const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#0088fe", "#00c49f", "#ffbb28", "#ff8042", "#0088ff", "#ff6347"];

//     return (
//         <PieChart width={300} height={300}>
//             <Pie
//                 data={data1}
//                 dataKey="value"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={70}
//                 fill="#8884d8"
//                 label={(entry) => `${entry.name}: ${entry.value}`}
//                 labelLine={false} // Optional: removes the line connecting labels to slices
//             >
//                 {data1.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
//                 ))}
//             </Pie>
//             <Tooltip />
//         </PieChart>
//     );
// }

// export default PieChartComponent;
