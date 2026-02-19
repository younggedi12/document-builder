import { useState, useMemo } from "react";
import { format, addDays, subDays } from "date-fns";
import { ChevronLeft, ChevronRight, CalendarDays, Wifi, WifiOff, RefreshCw, Loader2 } from "lucide-react";
import { MealType, MenuItem } from "@/types";
import { getMenuForDate } from "@/data/mockMenu";
import { useMenuScraper } from "@/cloud/useMenuScraper";
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
  const [useLive, setUseLive] = useState(true);

  const { data: liveData, isLoading, isError, refetch, isFetching } = useMenuScraper();

  // Mock data fallback
  const dateStr = format(currentDate, "yyyy-MM-dd");
  const mockMenu = getMenuForDate(dateStr);

  // Group live items by station as a single meal (the site shows one meal period at a time)
  const liveItems = liveData?.items || [];

  const allItems = useMemo(() => {
    if (useLive && liveItems.length > 0) {
      return liveItems;
    }
    if (!mockMenu) return [];
    return Object.values(mockMenu.meals).flat();
  }, [useLive, liveItems, mockMenu]);

  const selectedItems = useMemo(
    () => allItems.filter((item) => selectedIds.includes(item.id)),
    [allItems, selectedIds]
  );

  const toggleItem = (item: MenuItem) => {
    setSelectedIds((prev) =>
      prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id]
    );
  };

  // Group live items by station
  const stationGroups = useMemo(() => {
    if (!useLive || liveItems.length === 0) return null;
    const groups: Record<string, MenuItem[]> = {};
    liveItems.forEach((item) => {
      if (!groups[item.station]) groups[item.station] = [];
      groups[item.station].push(item);
    });
    return groups;
  }, [useLive, liveItems]);

  const visibleMeals: MealType[] =
    activeMeal === "all" ? ["breakfast", "lunch", "dinner"] : [activeMeal];

  return (
    <div className="container py-6 pb-24 md:pb-10">
      {/* Live/Mock toggle + date nav */}
      <div className="mb-4 flex items-center justify-between gap-2">
        <button
          onClick={() => {
            setUseLive(!useLive);
            setSelectedIds([]);
          }}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            useLive
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {useLive ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
          {useLive ? "Live Menu" : "Sample Data"}
        </button>

        {useLive && (
          <div className="flex items-center gap-2">
            {liveData?.scrapedAt && (
              <span className="text-[10px] text-muted-foreground">
                Updated {format(new Date(liveData.scrapedAt), "h:mm a")}
              </span>
            )}
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            </button>
          </div>
        )}
      </div>

      {/* Date nav - only for mock mode */}
      {!useLive && (
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
      )}

      {/* Live mode header */}
      {useLive && (
        <div className="mb-6 flex items-center gap-2 text-center justify-center">
          <CalendarDays className="h-5 w-5 text-primary" />
          <div>
            <h2 className="font-heading text-lg font-bold">
              Today's {liveData?.mealPeriod ? liveData.mealPeriod.charAt(0).toUpperCase() + liveData.mealPeriod.slice(1) : "Menu"}
            </h2>
            <p className="text-xs text-muted-foreground">Teraanga Commons Dining Hall</p>
          </div>
        </div>
      )}

      {/* Meal filter tabs - only for mock mode */}
      {!useLive && (
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
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Menu items */}
        <div className="space-y-8">
          {/* Loading state */}
          {useLive && isLoading && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 p-12">
              <Loader2 className="mb-3 h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Fetching today's menu from CampusDish...</p>
              <p className="mt-1 text-xs text-muted-foreground">This may take a few seconds</p>
            </div>
          )}

          {/* Error state */}
          {useLive && isError && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
              <p className="text-sm font-medium text-destructive">Couldn't fetch live menu</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Try refreshing or switch to sample data
              </p>
              <button
                onClick={() => refetch()}
                className="mt-3 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground"
              >
                Retry
              </button>
            </div>
          )}

          {/* Live mode: group by station */}
          {useLive && !isLoading && !isError && stationGroups && (
            Object.entries(stationGroups).map(([station, items]) => (
              <section key={station} className="animate-fade-in">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <span className="text-sm font-bold text-primary">
                      {station.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold">{station}</h3>
                  </div>
                  <span className="ml-auto rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    {items.length} items
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => toggleItem(item)}
                      className={`group w-full rounded-lg border p-4 text-left transition-all hover:shadow-md ${
                        selectedIds.includes(item.id)
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border bg-card hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-heading text-sm font-semibold leading-tight">{item.name}</h4>
                          <p className="mt-0.5 text-xs text-muted-foreground">{item.station}</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {item.dietary.vegan && (
                              <span className="rounded bg-success/10 px-1.5 py-0 text-[10px] font-medium text-success">🌱 Vegan</span>
                            )}
                            {item.dietary.vegetarian && !item.dietary.vegan && (
                              <span className="rounded bg-success/10 px-1.5 py-0 text-[10px] font-medium text-success">🥬 Veg</span>
                            )}
                            {item.dietary.glutenFree && (
                              <span className="rounded bg-accent/10 px-1.5 py-0 text-[10px] font-medium text-accent-foreground">GF</span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end text-right">
                          <div className="text-lg font-heading font-bold text-primary">
                            {item.nutrition.calories}
                          </div>
                          <span className="text-[10px] text-muted-foreground">kcal</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            ))
          )}

          {/* Live mode: empty */}
          {useLive && !isLoading && !isError && liveItems.length === 0 && (
            <div className="rounded-xl border border-dashed bg-muted/30 p-12 text-center">
              <p className="text-muted-foreground">No items found in the scraped menu.</p>
            </div>
          )}

          {/* Mock mode */}
          {!useLive && mockMenu && visibleMeals.map((mealType) => (
            <MealSection
              key={mealType}
              mealType={mealType}
              items={mockMenu.meals[mealType]}
              selectedItems={selectedIds}
              onToggleItem={toggleItem}
            />
          ))}

          {!useLive && !mockMenu && (
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
