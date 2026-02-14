export type MealType = 'breakfast' | 'lunch' | 'dinner';

export interface DietaryInfo {
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  servingSize?: string;
}

export interface MenuItem {
  id: number;
  name: string;
  station: string;
  dietary: DietaryInfo;
  nutrition: NutritionInfo;
  confidence: number;
}

export interface DailyMenu {
  date: string;
  meals: Record<MealType, MenuItem[]>;
}

export interface DailySummary {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  mealBreakdown: Record<MealType, number>;
}
