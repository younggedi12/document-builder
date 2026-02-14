import { DailyMenu } from "@/types";

export const mockMenus: Record<string, DailyMenu> = {
  "2026-02-14": {
    date: "2026-02-14",
    meals: {
      breakfast: [
        { id: 1, name: "Scrambled Eggs", station: "Hot Breakfast", dietary: { vegetarian: true, vegan: false, glutenFree: true }, nutrition: { calories: 182, protein: 12, carbs: 2, fat: 14, servingSize: "2 eggs" }, confidence: 0.95 },
        { id: 2, name: "Blueberry Pancakes", station: "Hot Breakfast", dietary: { vegetarian: true, vegan: false, glutenFree: false }, nutrition: { calories: 310, protein: 8, carbs: 52, fat: 8, servingSize: "3 pancakes" }, confidence: 0.9 },
        { id: 3, name: "Turkey Sausage", station: "Hot Breakfast", dietary: { vegetarian: false, vegan: false, glutenFree: true }, nutrition: { calories: 120, protein: 14, carbs: 1, fat: 7, servingSize: "2 links" }, confidence: 0.92 },
        { id: 4, name: "Fresh Fruit Bowl", station: "Cold Station", dietary: { vegetarian: true, vegan: true, glutenFree: true }, nutrition: { calories: 85, protein: 1, carbs: 22, fat: 0, servingSize: "1 cup" }, confidence: 0.98 },
        { id: 5, name: "Oatmeal with Brown Sugar", station: "Hot Cereal", dietary: { vegetarian: true, vegan: true, glutenFree: false }, nutrition: { calories: 195, protein: 5, carbs: 38, fat: 3, servingSize: "1 bowl" }, confidence: 0.88 },
      ],
      lunch: [
        { id: 6, name: "Grilled Chicken Breast", station: "Grill", dietary: { vegetarian: false, vegan: false, glutenFree: true }, nutrition: { calories: 284, protein: 38, carbs: 0, fat: 12, servingSize: "6 oz" }, confidence: 0.94 },
        { id: 7, name: "Caesar Salad", station: "Salad Bar", dietary: { vegetarian: true, vegan: false, glutenFree: false }, nutrition: { calories: 210, protein: 8, carbs: 12, fat: 15, servingSize: "1 plate" }, confidence: 0.91 },
        { id: 8, name: "Black Bean Burger", station: "Grill", dietary: { vegetarian: true, vegan: true, glutenFree: false }, nutrition: { calories: 340, protein: 15, carbs: 42, fat: 12, servingSize: "1 burger" }, confidence: 0.87 },
        { id: 9, name: "Sweet Potato Fries", station: "Sides", dietary: { vegetarian: true, vegan: true, glutenFree: true }, nutrition: { calories: 220, protein: 3, carbs: 35, fat: 10, servingSize: "1 serving" }, confidence: 0.93 },
        { id: 10, name: "Minestrone Soup", station: "Soup", dietary: { vegetarian: true, vegan: true, glutenFree: false }, nutrition: { calories: 145, protein: 6, carbs: 24, fat: 3, servingSize: "1 bowl" }, confidence: 0.89 },
      ],
      dinner: [
        { id: 11, name: "Beef Stir Fry", station: "International", dietary: { vegetarian: false, vegan: false, glutenFree: false }, nutrition: { calories: 380, protein: 28, carbs: 30, fat: 16, servingSize: "1 plate" }, confidence: 0.86 },
        { id: 12, name: "Steamed Jasmine Rice", station: "International", dietary: { vegetarian: true, vegan: true, glutenFree: true }, nutrition: { calories: 205, protein: 4, carbs: 45, fat: 0, servingSize: "1 cup" }, confidence: 0.97 },
        { id: 13, name: "Roasted Vegetables", station: "Sides", dietary: { vegetarian: true, vegan: true, glutenFree: true }, nutrition: { calories: 125, protein: 3, carbs: 18, fat: 5, servingSize: "1 cup" }, confidence: 0.94 },
        { id: 14, name: "Margherita Pizza", station: "Pizza", dietary: { vegetarian: true, vegan: false, glutenFree: false }, nutrition: { calories: 420, protein: 16, carbs: 48, fat: 18, servingSize: "2 slices" }, confidence: 0.92 },
        { id: 15, name: "Chocolate Brownie", station: "Dessert", dietary: { vegetarian: true, vegan: false, glutenFree: false }, nutrition: { calories: 260, protein: 3, carbs: 36, fat: 12, servingSize: "1 piece" }, confidence: 0.9 },
      ],
    },
  },
  "2026-02-15": {
    date: "2026-02-15",
    meals: {
      breakfast: [
        { id: 16, name: "Eggs Benedict", station: "Hot Breakfast", dietary: { vegetarian: true, vegan: false, glutenFree: false }, nutrition: { calories: 340, protein: 18, carbs: 22, fat: 20, servingSize: "1 serving" }, confidence: 0.88 },
        { id: 17, name: "Whole Wheat Toast", station: "Bakery", dietary: { vegetarian: true, vegan: true, glutenFree: false }, nutrition: { calories: 130, protein: 5, carbs: 24, fat: 2, servingSize: "2 slices" }, confidence: 0.96 },
        { id: 18, name: "Greek Yogurt Parfait", station: "Cold Station", dietary: { vegetarian: true, vegan: false, glutenFree: true }, nutrition: { calories: 220, protein: 15, carbs: 28, fat: 6, servingSize: "1 cup" }, confidence: 0.93 },
      ],
      lunch: [
        { id: 19, name: "Fish Tacos", station: "International", dietary: { vegetarian: false, vegan: false, glutenFree: false }, nutrition: { calories: 360, protein: 22, carbs: 34, fat: 14, servingSize: "2 tacos" }, confidence: 0.85 },
        { id: 20, name: "Garden Salad", station: "Salad Bar", dietary: { vegetarian: true, vegan: true, glutenFree: true }, nutrition: { calories: 120, protein: 4, carbs: 16, fat: 5, servingSize: "1 plate" }, confidence: 0.95 },
        { id: 21, name: "Tomato Bisque", station: "Soup", dietary: { vegetarian: true, vegan: false, glutenFree: true }, nutrition: { calories: 180, protein: 4, carbs: 20, fat: 9, servingSize: "1 bowl" }, confidence: 0.91 },
      ],
      dinner: [
        { id: 22, name: "Pasta Primavera", station: "Italian", dietary: { vegetarian: true, vegan: false, glutenFree: false }, nutrition: { calories: 390, protein: 14, carbs: 56, fat: 12, servingSize: "1 plate" }, confidence: 0.89 },
        { id: 23, name: "Grilled Salmon", station: "Grill", dietary: { vegetarian: false, vegan: false, glutenFree: true }, nutrition: { calories: 320, protein: 34, carbs: 0, fat: 18, servingSize: "6 oz" }, confidence: 0.93 },
        { id: 24, name: "Garlic Bread", station: "Bakery", dietary: { vegetarian: true, vegan: false, glutenFree: false }, nutrition: { calories: 190, protein: 5, carbs: 28, fat: 7, servingSize: "2 slices" }, confidence: 0.94 },
      ],
    },
  },
};

export function getMenuForDate(dateStr: string): DailyMenu | null {
  return mockMenus[dateStr] || null;
}

export function getAvailableDates(): string[] {
  return Object.keys(mockMenus).sort();
}
