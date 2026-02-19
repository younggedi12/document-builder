import { useQuery } from "@tanstack/react-query";
import { MenuItem } from "@/types";

interface ParsedItem {
  id: number;
  name: string;
  station: string;
  calories: number;
  dietary: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
  };
}

/**
 * Parses menu items from the CampusDish HTML page content.
 * Looks for station headers and menu item patterns in the raw HTML.
 */
function parseMenuFromHtml(html: string): ParsedItem[] {
  const items: ParsedItem[] = [];
  let itemId = 1;

  // CampusDish renders menu data in structured HTML
  // We parse station names and item details from the page content
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Look for station containers
  const stationHeaders = doc.querySelectorAll(
    '[class*="station"], [class*="Station"], h2, h3'
  );

  let currentStation = "General";

  // Try structured approach: look for menu item elements
  const menuItemEls = doc.querySelectorAll(
    '[class*="menu-item"], [class*="MenuItem"], [class*="item-name"], [class*="ItemName"], [role="button"][class*="item"], a[href*="label"]'
  );

  if (menuItemEls.length > 0) {
    menuItemEls.forEach((el) => {
      const name = el.textContent?.trim();
      if (!name || name.length < 2 || name.length > 100) return;

      // Try to find the parent station
      let parent = el.closest('[class*="station"], [class*="Station"]');
      if (parent) {
        const stationEl = parent.querySelector(
          'h2, h3, [class*="station-name"], [class*="StationName"], [class*="header"]'
        );
        if (stationEl?.textContent) currentStation = stationEl.textContent.trim();
      }

      // Try to find calorie info nearby
      let calories = 0;
      const calorieEl =
        el.querySelector('[class*="calor"], [class*="Calor"]') ||
        el.parentElement?.querySelector('[class*="calor"], [class*="Calor"]');
      if (calorieEl?.textContent) {
        const match = calorieEl.textContent.match(/(\d+)/);
        if (match) calories = parseInt(match[1], 10);
      }

      // Check dietary flags
      const elHtml = el.innerHTML?.toLowerCase() || "";
      const parentHtml = el.parentElement?.innerHTML?.toLowerCase() || "";
      const context = elHtml + parentHtml;

      items.push({
        id: itemId++,
        name,
        station: currentStation,
        calories,
        dietary: {
          vegetarian:
            context.includes("vegetarian") || context.includes("vegan"),
          vegan: context.includes("vegan"),
          glutenFree:
            context.includes("no gluten") || context.includes("gluten-free") || context.includes("glutenfree"),
        },
      });
    });
  }

  // Fallback: try to extract from text patterns if structured parsing found nothing
  if (items.length === 0) {
    const text = doc.body?.textContent || "";
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Heuristic: lines that look like food item names (capitalized, reasonable length)
      if (
        line.length > 3 &&
        line.length < 80 &&
        /^[A-Z]/.test(line) &&
        !line.includes("©") &&
        !line.includes("http") &&
        !line.startsWith("Menu") &&
        !line.startsWith("Location") &&
        !line.startsWith("Filter")
      ) {
        // Check if next line has calories
        let calories = 0;
        if (i + 1 < lines.length) {
          const calMatch = lines[i + 1].match(/(\d+)\s*Cal/i);
          if (calMatch) calories = parseInt(calMatch[1], 10);
        }

        if (calories > 0) {
          items.push({
            id: itemId++,
            name: line,
            station: currentStation,
            calories,
            dietary: { vegetarian: false, vegan: false, glutenFree: false },
          });
        }
      }
    }
  }

  return items;
}

function mapToMenuItem(item: ParsedItem): MenuItem {
  return {
    id: item.id,
    name: item.name,
    station: item.station,
    dietary: item.dietary,
    nutrition: {
      calories: item.calories,
      protein: 0,
      carbs: 0,
      fat: 0,
    },
    confidence: 0.7,
  };
}

const CAMPUS_DISH_URL =
  "https://carleton.campusdish.com/LocationsAndMenus/TeraangaCommonsDiningHall";

// allOrigins is a free, open-source CORS proxy: https://github.com/gnuns/allOrigins
const CORS_PROXY = "https://api.allorigins.win/raw?url=";

export function useMenuFetcher() {
  return useQuery<{
    mealPeriod: string;
    items: MenuItem[];
    scrapedAt: string;
  }>({
    queryKey: ["live-menu"],
    queryFn: async () => {
      const proxyUrl = `${CORS_PROXY}${encodeURIComponent(CAMPUS_DISH_URL)}`;

      const response = await fetch(proxyUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch menu (${response.status})`);
      }

      const html = await response.text();
      const parsed = parseMenuFromHtml(html);

      // Detect meal period from page content
      let mealPeriod = "dinner";
      const lowerHtml = html.toLowerCase();
      if (lowerHtml.includes("breakfast")) mealPeriod = "breakfast";
      else if (lowerHtml.includes("lunch")) mealPeriod = "lunch";

      return {
        mealPeriod,
        items: parsed.map(mapToMenuItem),
        scrapedAt: new Date().toISOString(),
      };
    },
    staleTime: 1000 * 60 * 30,
    retry: 1,
  });
}
