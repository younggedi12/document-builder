import { MealType, MenuItem } from "@/types";
import MenuItemCard from "./MenuItemCard";
import { Coffee, Sun, Moon } from "lucide-react";

const mealMeta: Record<MealType, { label: string; icon: React.ElementType; time: string }> = {
  breakfast: { label: "Breakfast", icon: Coffee, time: "7:00 AM – 10:30 AM" },
  lunch: { label: "Lunch", icon: Sun, time: "11:00 AM – 2:00 PM" },
  dinner: { label: "Dinner", icon: Moon, time: "4:30 PM – 8:00 PM" },
};

interface MealSectionProps {
  mealType: MealType;
  items: MenuItem[];
  selectedItems: number[];
  onToggleItem: (item: MenuItem) => void;
}

export default function MealSection({ mealType, items, selectedItems, onToggleItem }: MealSectionProps) {
  const meta = mealMeta[mealType];
  const Icon = meta.icon;

  return (
    <section className="animate-fade-in">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-heading text-lg font-bold">{meta.label}</h3>
          <p className="text-xs text-muted-foreground">{meta.time}</p>
        </div>
        <span className="ml-auto rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
          {items.length} items
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            selected={selectedItems.includes(item.id)}
            onSelect={onToggleItem}
          />
        ))}
      </div>
    </section>
  );
}
