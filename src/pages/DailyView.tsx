import { useState, useMemo } from "react";
import { format, addDays, subDays } from "date-fns";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { MealType, MenuItem } from "@/types";
import { getMenuForDate } from "@/data/mockMenu";
import MealSection from "@/components/menu/MealSection";
import NutritionSummaryBar from "@/components/nutrition/NutritionSummaryBar";

const mealTabs: { key: MealType | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "breakfast", label: "Breakfast" },
  { key: "lunch", label: "Lunch" },
  { key: "dinner", label: "Dinner" },
];

export default function DailyView() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 14));
  const [activeMeal, setActiveMeal] = useState<MealType | "all">("all");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const dateStr = format(currentDate, "yyyy-MM-dd");
  const menu = getMenuForDate(dateStr);

  const allItems = useMemo(() => {
    if (!menu) return [];
    return Object.values(menu.meals).flat();
  }, [menu]);

  const selectedItems = useMemo(
    () => allItems.filter((item) => selectedIds.includes(item.id)),
    [allItems, selectedIds]
  );

  const toggleItem = (item: MenuItem) => {
    setSelectedIds((prev) =>
      prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id]
    );
  };

  const visibleMeals: MealType[] =
    activeMeal === "all" ? ["breakfast", "lunch", "dinner"] : [activeMeal];

  return (
    <div className="container py-6 pb-24 md:pb-10">
      {/* Date nav */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => setCurrentDate((d) => subDays(d, 1))}
          className="rounded-lg p-2 text-muted-foreground hover:bg-secondary"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 text-center">
          <CalendarDays className="h-5 w-5 text-primary" />
          <div>
            <h2 className="font-heading text-lg font-bold">{format(currentDate, "EEEE")}</h2>
            <p className="text-xs text-muted-foreground">{format(currentDate, "MMMM d, yyyy")}</p>
          </div>
        </div>
        <button
          onClick={() => setCurrentDate((d) => addDays(d, 1))}
          className="rounded-lg p-2 text-muted-foreground hover:bg-secondary"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Meal filter tabs */}
      <div className="mb-6 flex gap-1 rounded-lg bg-muted p-1">
        {mealTabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveMeal(key)}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              activeMeal === key
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Menu items */}
        <div className="space-y-8">
          {menu ? (
            visibleMeals.map((mealType) => (
              <MealSection
                key={mealType}
                mealType={mealType}
                items={menu.meals[mealType]}
                selectedItems={selectedIds}
                onToggleItem={toggleItem}
              />
            ))
          ) : (
            <div className="rounded-xl border border-dashed bg-muted/30 p-12 text-center">
              <p className="text-muted-foreground">No menu available for this date.</p>
              <p className="mt-1 text-xs text-muted-foreground">Try navigating to February 14 or 15, 2026.</p>
            </div>
          )}
        </div>

        {/* Sidebar summary */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <NutritionSummaryBar selectedItems={selectedItems} />
        </div>
      </div>
    </div>
  );
}
