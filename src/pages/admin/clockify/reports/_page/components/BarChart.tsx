// @ts-nocheck
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import moment from "moment-timezone";
import { useMemo } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  // responsive: true,
  // plugins: {
  //   legend: {
  //     position: "top" as const,
  //   },
  //   title: {
  //     display: false,
  //     text: "Chart.js Bar Chart",
  //   },
  // },
  scales: {
    y: {
      beginAtZero: true,
      suggestedMin: 10,
      suggestedMax: 10,
      labelSring: "Hours",
    },
  },
};

export const BarChart = ({ timeReports, startDate, endDate }) => {
  const dateArray = useMemo(() => {
    if (!startDate || !endDate) return [];

    const dateArray = [];
    let currentDate = moment(startDate);
    while (currentDate <= moment(endDate)) {
      dateArray.push(currentDate.format("YYYY-MM-DD"));
      currentDate = currentDate.add(1, "days");
    }

    return dateArray;
  }, [startDate, endDate]);

  const data = useMemo(() => {
    return {
      labels: dateArray?.map((x) => moment(x).format("MMM DD")),
      datasets: [
        {
          label: "Hours",
          data: dateArray?.map((date) => {
            const report = timeReports?.find(
              (item) =>
                moment(item._id).format("YYYY-MM-DD") ===
                moment(date).format("YYYY-MM-DD")
            );
            return report ? report.totalDuration : 0;
          }),
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    };
  }, [dateArray, timeReports]);

  return <Bar data={data} options={options} />;
};
