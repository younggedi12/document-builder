import { MenuItem, MealType } from "@/types";
import { Flame, Dumbbell, Wheat, Droplets } from "lucide-react";

interface NutritionSummaryBarProps {
  selectedItems: MenuItem[];
}

export default function NutritionSummaryBar({ selectedItems }: NutritionSummaryBarProps) {
  const totals = selectedItems.reduce(
    (acc, item) => ({
      calories: acc.calories + item.nutrition.calories,
      protein: acc.protein + item.nutrition.protein,
      carbs: acc.carbs + item.nutrition.carbs,
      fat: acc.fat + item.nutrition.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const dailyGoal = 2000;
  const progress = Math.min((totals.calories / dailyGoal) * 100, 100);

  if (selectedItems.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-muted/30 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Tap menu items to track your daily intake
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-heading text-sm font-semibold">Your Selection</h3>
        <span className="text-xs text-muted-foreground">{selectedItems.length} items</span>
      </div>

      {/* Calorie progress */}
      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Flame className="h-4 w-4 text-primary" />
            <span className="text-2xl font-heading font-bold">{totals.calories}</span>
            <span className="text-sm text-muted-foreground">/ {dailyGoal} kcal</span>
          </div>
          <span className="text-xs font-medium text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Macros */}
      <div className="grid grid-cols-3 gap-3">
        <MacroStat icon={Dumbbell} label="Protein" value={totals.protein} unit="g" colorClass="text-protein" />
        <MacroStat icon={Wheat} label="Carbs" value={totals.carbs} unit="g" colorClass="text-carbs" />
        <MacroStat icon={Droplets} label="Fat" value={totals.fat} unit="g" colorClass="text-fat" />
      </div>
    </div>
  );
}

function MacroStat({
  icon: Icon,
  label,
  value,
  unit,
  colorClass,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  unit: string;
  colorClass: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-lg bg-muted/50 p-2.5">
      <Icon className={`mb-1 h-4 w-4 ${colorClass}`} />
      <span className={`text-lg font-heading font-bold ${colorClass}`}>{value}{unit}</span>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  );
}
