
import { ChartContainer, ChartLegendContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Seg", atividades: 3 },
  { name: "Ter", atividades: 4 },
  { name: "Qua", atividades: 2 },
  { name: "Qui", atividades: 5 },
  { name: "Sex", atividades: 1 },
  { name: "Sáb", atividades: 0 },
  { name: "Dom", atividades: 0 }
];

const chartConfig = {
  atividades: { label: "Atividades", color: "#9b87f5" }
};

export function DashboardChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[220px]">
      {/* Wrap the components in a fragment to make them a single child */}
      <>
        <BarChart data={data} barSize={24}>
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip />
          <Bar dataKey="atividades" radius={[6, 6, 0, 0]} fill="#9b87f5" />
        </BarChart>
        <ChartLegendContent payload={[{ value: "Atividades", color: "#9b87f5" }]} />
      </>
    </ChartContainer>
  );
}
