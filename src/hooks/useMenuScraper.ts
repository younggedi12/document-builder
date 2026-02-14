import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MenuItem } from "@/types";

interface ScrapedItem {
  id: number;
  name: string;
  station: string;
  calories: number;
  dietary: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    noDairy: boolean;
    eatWell: boolean;
    coolFood: boolean;
  };
  description?: string;
}

interface ScrapeResponse {
  success: boolean;
  mealPeriod: string;
  items: ScrapedItem[];
  scrapedAt: string;
  error?: string;
}

function mapToMenuItem(item: ScrapedItem): MenuItem {
  return {
    id: item.id,
    name: item.name,
    station: item.station,
    dietary: {
      vegetarian: item.dietary.vegetarian,
      vegan: item.dietary.vegan,
      glutenFree: item.dietary.glutenFree,
    },
    nutrition: {
      calories: item.calories,
      protein: 0, // Not available from scraping
      carbs: 0,
      fat: 0,
    },
    confidence: 0.85,
  };
}

export function useMenuScraper() {
  return useQuery<{
    mealPeriod: string;
    items: MenuItem[];
    scrapedAt: string;
  }>({
    queryKey: ["live-menu"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("scrape-menu", {
        body: {},
      });

      if (error) throw new Error(error.message);
      if (!data?.success) throw new Error(data?.error || "Scrape failed");

      return {
        mealPeriod: data.mealPeriod,
        items: data.items.map(mapToMenuItem),
        scrapedAt: data.scrapedAt,
      };
    },
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
    retry: 1,
  });
}
