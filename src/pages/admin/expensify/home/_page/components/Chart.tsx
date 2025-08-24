import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

import { getColors } from "@/lib/utils";
import { Category, ExpenseGroup } from "@/lib/types";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  groups: ExpenseGroup[];
  categories: Category[];
}

export function PieChart({ groups, categories }: PieChartProps) {
  if (!groups || groups.length === 0) {
    return null;
  }

  console.log(groups);

  const options = categories
    .map((cateogry) => {
      const group = groups?.find((item) => item._id === cateogry.internalId);
      return {
        label: cateogry.name,
        value: group?.total ?? 0,
      };
    })
    .filter((item) => item.value);

  return (
    <div className="flex justify-center">
      <div className="w-[300px]">
        <Pie
          data={{
            labels: options.map(({ label }) => label),
            datasets: [
              {
                // label: '# of Votes',
                data: options.map(({ value }) => value),
                backgroundColor: getColors(options.length),
                borderWidth: 1,
              },
            ],
          }}
        />
      </div>
    </div>
  );
}
