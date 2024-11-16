import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { date: '01', spend: 12000, cashback: 8000 },
  { date: '05', spend: 18000, cashback: 12000 },
  { date: '09', spend: 45000, cashback: 26000 },
  { date: '15', spend: 30000, cashback: 20000 },
  { date: '20', spend: 40000, cashback: 25000 },
  { date: '25', spend: 50000, cashback: 30000 },
  { date: '30', spend: 45000, cashback: 26000 },
];

const CustomAreaChart = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorCashback" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Area type="monotone" dataKey="spend" stroke="#8884d8" fill="url(#colorSpend)" />
        <Area type="monotone" dataKey="cashback" stroke="#82ca9d" fill="url(#colorCashback)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default CustomAreaChart;
