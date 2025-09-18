// src/templates/Professional/BudgetSlide.tsx
import { Card, CardContent } from "../../../components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface BudgetSlideProps {
  title?: string;
  description?: string;
  items: { label: string; value: number }[];
}

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#6366F1"];

export default function BudgetSlide({
  title = "Budget Allocation",
  description = "Here’s how the budget is distributed across major categories.",
  items,
}: BudgetSlideProps) {
  return (
    <div className="w-full flex flex-col items-center justify-start bg-gradient-to-br from-indigo-50 to-white p-10">
      {/* Title */}
      <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl text-center">{description}</p>

      <div className="flex w-full flex-wrap gap-8 items-start justify-center">
        {/* Pie Chart */}
        <div className="w-full md:w-1/2 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={items}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                label
              >
                {items.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* List of Items */}
        <Card className="shadow-lg rounded-2xl p-6 w-full md:w-1/3">
          <CardContent>
            <ul className="space-y-4">
              {items.map((item, idx) => (
                <li key={idx} className="flex justify-between text-lg font-medium">
                  <span>{item.label}</span>
                  <span className="text-indigo-600">₹{item.value.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
