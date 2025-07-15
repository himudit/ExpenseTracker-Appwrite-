// import { useState, useEffect } from "react";

// const getDaysBetween = (data) => {
//     if (data.length === 0) return 0;
//     const dates = data.map(item => new Date(item.Date));
//     const min = new Date(Math.min(...dates));
//     const max = new Date(Math.max(...dates));
//     const diff = (max - min) / (1000 * 60 * 60 * 24);
//     return Math.floor(diff) + 1;
// };

// const TimeRangeDropdown = ({ data, onSelect }) => {
//     const [selected, setSelected] = useState("last7");
//     const [availableDays, setAvailableDays] = useState(0);

//     useEffect(() => {
//         setAvailableDays(getDaysBetween(data));
//     }, [data]);



//     const handleChange = (e) => {
//         setSelected(e.target.value);
//         onSelect(e.target.value);
//     };

//     return (
       
//     );
// };

// export default TimeRangeDropdown;
