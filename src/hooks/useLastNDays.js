import { useMemo } from "react";

const parseDate = (dateStr, year = 2025) => {
    return new Date(`${dateStr} ${year}`);
};

const useLastNDays = (data, n) => {
    const filtered = useMemo(() => {
        if (!Array.isArray(data) || data.length === 0) return [];

        if (!n || n === "all") return data

        // Set today's date to latest date in data (assumes sorted data)
        const today = parseDate(data[data.length - 1]?.date);

        const fromDate = new Date(today);
        fromDate.setDate(today.getDate() - (n - 1));

        const result = [];

        for (let i = data.length - 1; i >= 0; i--) {
            const itemDate = parseDate(data[i].date);
            if (itemDate >= fromDate && itemDate <= today) {
                result.unshift(data[i]); // maintain order
            } else if (itemDate < fromDate) {
                break; // optimization
            }
        }

        return result;
    }, [data, n]);

    return filtered;
};

export default useLastNDays;
