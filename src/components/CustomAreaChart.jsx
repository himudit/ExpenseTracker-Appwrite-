// import React from 'react';
// import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// const CustomAreaChart = ({ data }) => {
//   return (
//     <ResponsiveContainer width="95%" height={300}>
//       <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
//         <defs>
//           <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
//             <stop offset="5%" stopColor="#ff0000" stopOpacity={0.4} />
//             <stop offset="95%" stopColor="#ff0000" stopOpacity={0} />
//           </linearGradient>
//           <linearGradient id="colorCashback" x1="0" y1="0" x2="0" y2="1">
//             <stop offset="5%" stopColor="#82ca9d" stopOpacity={1.4} />
//             <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
//           </linearGradient>
//         </defs>
//         <XAxis dataKey="date" />
//         <YAxis />
//         <CartesianGrid strokeDasharray="3 3" />
//         <Tooltip />
//         <Area type="monotone" dataKey="spend" stroke="#ff0000" fill="url(#colorSpend)" />
//         <Area type="monotone" dataKey="cashback" stroke="#82ca9d" fill="url(#colorCashback)" />
//       </AreaChart>
//     </ResponsiveContainer>
//   );
// };

// export default CustomAreaChart;
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 rounded shadow-md">
        <p><strong>Date:</strong> {label}</p>
        {payload[0] && (
          <p style={{ color: payload[0].color }}>
            <strong>Spend:</strong> ${payload[0].value} on {payload[0].payload.spendCategory}
          </p>
        )}
        {payload[1] && payload[1].value > 0 && (
          <p style={{ color: payload[1].color }}>
            <strong>Cashback:</strong> ${payload[1].value} by {payload[1].payload.cashbackCategory}
          </p>
        )}
      </div>
    );
  }
  return null;
};

const CustomAreaChart = ({ data }) => {
  return (
    <ResponsiveContainer width="95%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ff0000" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#ff0000" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorCashback" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={1.4} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="spend" stroke="#ff0000" fill="url(#colorSpend)" />
        <Area type="monotone" dataKey="cashback" stroke="#82ca9d" fill="url(#colorCashback)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default CustomAreaChart;
