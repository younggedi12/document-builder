const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface ScrapedMenuItem {
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

function parseMenuFromMarkdown(markdown: string): ScrapedMenuItem[] {
  const items: ScrapedMenuItem[] = [];
  const lines = markdown.split('\n');

  let currentStation = '';
  let itemId = 1;

  // Skip footer content starting from "Menu Highlights"
  const footerIdx = lines.findIndex(l => l.trim() === '## Menu Highlights');
  const contentLines = footerIdx > 0 ? lines.slice(0, footerIdx) : lines;

  for (let i = 0; i < contentLines.length; i++) {
    const line = contentLines[i].trim();

    // Detect station headers (## Station Name)
    if (line.startsWith('## ') && !line.startsWith('### ')) {
      currentStation = line.replace('## ', '').trim();
      continue;
    }

    // Detect menu items (### Item Name)
    if (line.startsWith('### ') && currentStation) {
      const itemName = line.replace('### ', '').trim();

      // Look ahead for calories, dietary info, description
      let calories = 0;
      const dietary = {
        vegetarian: false,
        vegan: false,
        glutenFree: false,
        noDairy: false,
        eatWell: false,
        coolFood: false,
      };
      let description: string | undefined;

      // Scan next ~15 lines for item details
      for (let j = i + 1; j < Math.min(i + 20, contentLines.length); j++) {
        const nextLine = contentLines[j].trim();

        // Stop at next item or station
        if (nextLine.startsWith('## ') || nextLine.startsWith('### ')) break;

        // Extract calories: "Add X to Meal CalculatorNNN Calories"
        const calMatch = nextLine.match(/(\d+)\s*Calories/i);
        if (calMatch) {
          calories = parseInt(calMatch[1], 10);
        }

        // Dietary badges from image alt text
        if (nextLine.includes('Vegetarian') && !nextLine.includes('Vegan')) {
          dietary.vegetarian = true;
        }
        if (nextLine.includes('Vegan')) {
          dietary.vegan = true;
          dietary.vegetarian = true; // vegan implies vegetarian
        }
        if (nextLine.includes('No Gluten') || nextLine.includes('GlutenFree')) {
          dietary.glutenFree = true;
        }
        if (nextLine.includes('No Dairy') || nextLine.includes('NoDairy')) {
          dietary.noDairy = true;
        }
        if (nextLine.includes('Eat Well') || nextLine.includes('EatWell')) {
          dietary.eatWell = true;
        }
        if (nextLine.includes('CoolFood') || nextLine.includes('Low Carbon')) {
          dietary.coolFood = true;
        }

        // Description: plain text lines that aren't markers
        if (
          !nextLine.startsWith('!') &&
          !nextLine.startsWith('Add ') &&
          !nextLine.startsWith('Mark ') &&
          !nextLine.startsWith('Also Available') &&
          !nextLine.match(/^\d+\s*Calories/) &&
          nextLine.length > 5 &&
          !nextLine.startsWith('[') &&
          !nextLine.startsWith('---')
        ) {
          description = nextLine;
        }
      }

      // Skip "Also Available" header items or items without names
      if (itemName === 'Also Available' || !itemName) continue;

      items.push({
        id: itemId++,
        name: itemName,
        station: currentStation,
        calories,
        dietary,
        description,
      });
    }
  }

  return items;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { mealPeriod } = await req.json().catch(() => ({ mealPeriod: undefined }));

    // Build URL - CampusDish shows the current meal by default
    const baseUrl = 'https://carleton.campusdish.com/LocationsAndMenus/TeraangaCommonsDiningHall';

    console.log('Scraping CampusDish menu...');

    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: baseUrl,
        formats: ['markdown'],
        waitFor: 3000, // Wait for React to render
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Firecrawl error:', data);
      return new Response(
        JSON.stringify({ success: false, error: data.error || 'Scrape failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const markdown = data.data?.markdown || data.markdown || '';

    // Detect current meal period from page content
    let detectedMeal = 'dinner';
    if (markdown.includes('Today') && markdown.includes('Breakfast')) detectedMeal = 'breakfast';
    else if (markdown.includes('Today') && markdown.includes('Lunch')) detectedMeal = 'lunch';
    else if (markdown.includes('Today') && markdown.includes('Dinner')) detectedMeal = 'dinner';

    const items = parseMenuFromMarkdown(markdown);

    console.log(`Parsed ${items.length} menu items for ${detectedMeal}`);

    return new Response(
      JSON.stringify({
        success: true,
        mealPeriod: detectedMeal,
        items,
        scrapedAt: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
