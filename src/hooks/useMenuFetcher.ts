import { useQuery } from "@tanstack/react-query";
import { MenuItem, MealType } from "@/types";
import { format } from "date-fns";

/**
 * CampusDish JSON API response types (subset of fields we use)
 */
interface CDProduct {
  ProductId: string;
  MarketingName: string;
  Description: string;
  Calories: string;
  IsVegan: boolean;
  IsVegetarian: boolean;
  IsGlutenFree: boolean;
}

interface CDMenuProduct {
  MenuProductId: string;
  StationId: string;
  Product: CDProduct;
}

interface CDStation {
  StationId: string;
  Name: string;
}

interface CDMenuPeriod {
  PeriodId: string;
  Name: string;
}

interface CDApiResponse {
  Date: string;
  SelectedPeriodId: string;
  Menu: {
    MenuPeriods: CDMenuPeriod[];
    MenuProducts: CDMenuProduct[];
    MenuStations: CDStation[];
  };
}

const LOCATION_ID = "24967"; // Teraanga Commons Dining Hall
const BASE_API = "https://carleton.campusdish.com/api/menu/GetMenus";

// List of free CORS proxies to try in order
const CORS_PROXIES = [
  (url: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
  (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
];

function mapCDToMenuItems(
  data: CDApiResponse
): { items: MenuItem[]; mealPeriod: string } {
  const stationMap = new Map<string, string>();
  for (const s of data.Menu.MenuStations) {
    stationMap.set(s.StationId, s.Name);
  }

  // Determine current meal period name
  const currentPeriod = data.Menu.MenuPeriods.find(
    (p) => p.PeriodId === data.SelectedPeriodId
  );
  const mealPeriod = (currentPeriod?.Name || "Dinner").toLowerCase();

  const items: MenuItem[] = data.Menu.MenuProducts.map((mp, idx) => {
    const p = mp.Product;
    const calories = parseInt(p.Calories, 10) || 0;

    return {
      id: idx + 1,
      name: p.MarketingName || "Unknown Item",
      station: stationMap.get(mp.StationId) || "General",
      dietary: {
        vegetarian: p.IsVegetarian || p.IsVegan,
        vegan: p.IsVegan,
        glutenFree: p.IsGlutenFree,
      },
      nutrition: {
        calories,
        protein: 0,
        carbs: 0,
        fat: 0,
      },
      confidence: 1.0, // Direct from API, not scraped
    };
  });

  return { items, mealPeriod };
}

export function useMenuFetcher(dateOverride?: Date) {
  return useQuery<{
    mealPeriod: string;
    items: MenuItem[];
    allPeriods: { id: string; name: string }[];
    scrapedAt: string;
  }>({
    queryKey: ["live-menu", dateOverride?.toISOString()],
    queryFn: async () => {
      const dateStr = format(dateOverride || new Date(), "MM/dd/yyyy");
      const apiUrl = `${BASE_API}?locationId=${LOCATION_ID}&date=${encodeURIComponent(dateStr)}`;

      let data: CDApiResponse | null = null;

      for (const makeProxyUrl of CORS_PROXIES) {
        try {
          const proxyUrl = makeProxyUrl(apiUrl);
          const response = await fetch(proxyUrl);
          if (!response.ok) continue;

          const raw = await response.json();
          // allorigins wraps in { contents: "..." }
          data = typeof raw.contents === "string" ? JSON.parse(raw.contents) : raw;
          break;
        } catch {
          continue;
        }
      }

      if (!data) {
        throw new Error("All CORS proxies failed. Try again later.");
      }

      if (!data.Menu?.MenuProducts?.length) {
        throw new Error("No menu items available for this date/period");
      }

      const { items, mealPeriod } = mapCDToMenuItems(data);

      return {
        mealPeriod,
        items,
        allPeriods: data.Menu.MenuPeriods.map((p) => ({
          id: p.PeriodId,
          name: p.Name,
        })),
        scrapedAt: new Date().toISOString(),
      };
    },
    staleTime: 1000 * 60 * 30,
    retry: 1,
  });
}
