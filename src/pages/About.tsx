import { ExternalLink, BookOpen, Shield, Mail } from "lucide-react";

export default function About() {
  return (
    <div className="container max-w-2xl py-8 pb-24 md:pb-10">
      <h1 className="mb-2 font-heading text-3xl font-bold">About This App</h1>
      <p className="mb-8 text-muted-foreground">
        Helping Carleton students make informed dining choices.
      </p>

      <div className="space-y-6">
        <Section icon={BookOpen} title="What is this?">
          <p>
            The Carleton Dining Nutrition Tracker retrieves the daily menu from Teraanga Commons
            and matches each item with reliable nutrition data from the USDA FoodData Central database.
            This gives students an easy way to track calories and macronutrients without relying on
            generic food tracking apps.
          </p>
        </Section>

        <Section icon={Shield} title="Data Sources & Accuracy">
          <p>
            Menu items are sourced from the Carleton University dining website. Nutrition data comes
            from the USDA FoodData Central API. Each match includes a confidence score — higher scores
            indicate more reliable data.
          </p>
          <div className="mt-3 rounded-lg border border-accent/30 bg-accent/5 p-4 text-sm">
            <strong>⚠️ Disclaimer:</strong> Nutrition values are estimates for educational purposes only.
            Actual values may vary based on preparation methods, serving sizes, and ingredients used.
            This app is not a substitute for professional dietary advice.
          </div>
        </Section>

        <Section icon={ExternalLink} title="Data References">
          <ul className="list-disc space-y-1 pl-5 text-sm">
            <li>
              <a href="https://fdc.nal.usda.gov/" target="_blank" rel="noopener" className="text-primary underline">
                USDA FoodData Central
              </a>
            </li>
            <li>
              <a href="https://dining.carleton.ca" target="_blank" rel="noopener" className="text-primary underline">
                Carleton Dining Services
              </a>
            </li>
          </ul>
        </Section>

        <Section icon={Mail} title="Contact">
          <p className="text-sm">
            Have feedback or found an incorrect match? Reach out to the project team
            to help improve the app's accuracy for everyone.
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        <h2 className="font-heading text-lg font-bold">{title}</h2>
      </div>
      <div className="text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}
