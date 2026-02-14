import { useMemo, useState } from "react";
import { format } from "date-fns";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { getMenuForDate } from "@/data/mockMenu";
import { MealType } from "@/types";
import { Flame, Target } from "lucide-react";

const MACRO_COLORS = {
  protein: "hsl(210, 70%, 50%)",
  carbs: "hsl(35, 90%, 55%)",
  fat: "hsl(0, 72%, 45%)",
};

export default function Summary() {
  const dateStr = "2026-02-14";
  const menu = getMenuForDate(dateStr);

  const stats = useMemo(() => {
    if (!menu) return null;
    const mealStats: Record<MealType, { calories: number; protein: number; carbs: number; fat: number }> = {
      breakfast: { calories: 0, protein: 0, carbs: 0, fat: 0 },
      lunch: { calories: 0, protein: 0, carbs: 0, fat: 0 },
      dinner: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    };

    (Object.entries(menu.meals) as [MealType, typeof menu.meals.breakfast][]).forEach(([meal, items]) => {
      items.forEach((item) => {
        mealStats[meal].calories += item.nutrition.calories;
        mealStats[meal].protein += item.nutrition.protein;
        mealStats[meal].carbs += item.nutrition.carbs;
        mealStats[meal].fat += item.nutrition.fat;
      });
    });

    const totals = Object.values(mealStats).reduce(
      (a, b) => ({
        calories: a.calories + b.calories,
        protein: a.protein + b.protein,
        carbs: a.carbs + b.carbs,
        fat: a.fat + b.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    return { mealStats, totals };
  }, [menu]);

  if (!stats) return null;

  const pieData = [
    { name: "Protein", value: stats.totals.protein * 4, fill: MACRO_COLORS.protein },
    { name: "Carbs", value: stats.totals.carbs * 4, fill: MACRO_COLORS.carbs },
    { name: "Fat", value: stats.totals.fat * 9, fill: MACRO_COLORS.fat },
  ];

  const barData = [
    { meal: "Breakfast", calories: stats.mealStats.breakfast.calories },
    { meal: "Lunch", calories: stats.mealStats.lunch.calories },
    { meal: "Dinner", calories: stats.mealStats.dinner.calories },
  ];

  const dailyGoal = 2000;
  const progress = Math.round((stats.totals.calories / dailyGoal) * 100);

  return (
    <div className="container py-6 pb-24 md:pb-10">
      <h1 className="mb-1 font-heading text-2xl font-bold">Nutrition Summary</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Full-day overview for {format(new Date(dateStr), "MMMM d, yyyy")}
      </p>

      {/* Top stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Calories" value={stats.totals.calories} unit="kcal" icon={Flame} highlight />
        <StatCard label="Protein" value={stats.totals.protein} unit="g" color="text-protein" />
        <StatCard label="Carbs" value={stats.totals.carbs} unit="g" color="text-carbs" />
        <StatCard label="Fat" value={stats.totals.fat} unit="g" color="text-fat" />
      </div>

      {/* Goal progress */}
      <div className="mb-8 rounded-xl border bg-card p-5">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <span className="font-heading text-sm font-semibold">Daily Goal Progress</span>
          </div>
          <span className="text-sm font-medium">{progress}% of {dailyGoal} kcal</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-5">
          <h3 className="mb-4 font-heading text-sm font-semibold">Macronutrient Breakdown</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={3}>
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(val: number) => `${val} kcal`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <h3 className="mb-4 font-heading text-sm font-semibold">Calories by Meal</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData}>
              <XAxis dataKey="meal" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="calories" fill="hsl(0, 72%, 45%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  unit,
  icon: Icon,
  highlight,
  color,
}: {
  label: string;
  value: number;
  unit: string;
  icon?: React.ElementType;
  highlight?: boolean;
  color?: string;
}) {
  return (
    <div className={`rounded-xl border p-5 ${highlight ? "bg-primary text-primary-foreground" : "bg-card"}`}>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4" />}
        <span className="text-xs font-medium opacity-80">{label}</span>
      </div>
      <div className={`mt-2 font-heading text-3xl font-bold ${color || ""}`}>
        {value}
        <span className="ml-1 text-sm font-normal opacity-60">{unit}</span>
      </div>
    </div>
  );
}
