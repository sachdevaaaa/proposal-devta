import SlideWrapper from "../../ui/SlideWrapper";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface BudgetSlideProps {
  title?: string;
  description?: string;
  items: { label: string; value: number }[];
}

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#6366F1"];

const BudgetSlide: React.FC<BudgetSlideProps> = ({
  title = "Budget Allocation",
  description = "Here’s how the budget is distributed across major categories.",
  items,
}) => {
  return (
    <SlideWrapper title={title} subtitle={description}>
      <div className="flex flex-col md:flex-row w-full gap-8 items-start justify-center">
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

        {/* Budget List */}
        <div className="w-full md:w-1/3 bg-white rounded-2xl shadow-lg p-6">
          <ul className="space-y-4">
            {items.map((item, idx) => (
              <li
                key={idx}
                className="flex justify-between text-lg font-medium border-b last:border-b-0 pb-2"
              >
                <span>{item.label}</span>
                <span className="text-indigo-600">
                  ₹{item.value.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SlideWrapper>
  );
};

export default BudgetSlide;
