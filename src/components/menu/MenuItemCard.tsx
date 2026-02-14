import { MenuItem as MenuItemType } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Leaf, Wheat, Flame, Dumbbell } from "lucide-react";

interface MenuItemCardProps {
  item: MenuItemType;
  onSelect?: (item: MenuItemType) => void;
  selected?: boolean;
}

export default function MenuItemCard({ item, onSelect, selected }: MenuItemCardProps) {
  return (
    <button
      onClick={() => onSelect?.(item)}
      className={`group w-full rounded-lg border p-4 text-left transition-all hover:shadow-md ${
        selected
          ? "border-primary bg-primary/5 shadow-md"
          : "border-border bg-card hover:border-primary/30"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h4 className="font-heading text-sm font-semibold leading-tight">{item.name}</h4>
          <p className="mt-0.5 text-xs text-muted-foreground">{item.station}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {item.dietary.vegetarian && (
              <Badge variant="secondary" className="gap-1 text-[10px] px-1.5 py-0 bg-success/10 text-success border-0">
                <Leaf className="h-3 w-3" /> Veg
              </Badge>
            )}
            {item.dietary.vegan && (
              <Badge variant="secondary" className="gap-1 text-[10px] px-1.5 py-0 bg-success/10 text-success border-0">
                🌱 Vegan
              </Badge>
            )}
            {item.dietary.glutenFree && (
              <Badge variant="secondary" className="gap-1 text-[10px] px-1.5 py-0 bg-accent/10 text-accent-foreground border-0">
                <Wheat className="h-3 w-3" /> GF
              </Badge>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 text-right">
          <div className="flex items-center gap-1 text-lg font-heading font-bold text-primary">
            <Flame className="h-4 w-4" />
            {item.nutrition.calories}
          </div>
          <span className="text-[10px] text-muted-foreground">kcal</span>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <MacroPill label="Protein" value={item.nutrition.protein} unit="g" color="text-protein" />
        <MacroPill label="Carbs" value={item.nutrition.carbs} unit="g" color="text-carbs" />
        <MacroPill label="Fat" value={item.nutrition.fat} unit="g" color="text-fat" />
      </div>
    </button>
  );
}

function MacroPill({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <div className="rounded-md bg-muted px-2 py-1 text-center">
      <div className={`text-xs font-semibold ${color}`}>{value}{unit}</div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}
