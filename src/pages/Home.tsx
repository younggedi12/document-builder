import { Link } from "react-router-dom";
import { ArrowRight, Flame, Utensils, BarChart3 } from "lucide-react";
import heroImage from "@/assets/hero-dining.jpg";

export default function Home() {
  return (
    <div className="pb-20 md:pb-0">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Carleton dining hall" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-background" />
        </div>
        <div className="container relative flex min-h-[420px] flex-col items-center justify-center py-20 text-center">
          <h1 className="mb-4 max-w-2xl font-heading text-4xl font-bold leading-tight text-primary-foreground md:text-5xl">
            Track Your Dining Hall Nutrition
          </h1>
          <p className="mb-8 max-w-lg text-base text-primary-foreground/80">
            Know exactly what you're eating at Teraanga Commons. Browse daily menus,
            track calories, and hit your nutrition goals.
          </p>
          <Link
            to="/daily"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-heading text-sm font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-105"
          >
            View Today's Menu <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard
            icon={Utensils}
            title="Daily Menus"
            description="Browse breakfast, lunch, and dinner options from Teraanga Commons, updated daily."
          />
          <FeatureCard
            icon={Flame}
            title="Nutrition Data"
            description="See calories, protein, carbs, and fat for every menu item powered by the USDA database."
          />
          <FeatureCard
            icon={BarChart3}
            title="Track Your Intake"
            description="Select items you eat and get a running total of your daily nutrition breakdown."
          />
        </div>
      </section>

      {/* Disclaimer */}
      <section className="container pb-12">
        <div className="rounded-xl border border-accent/30 bg-accent/5 p-5 text-center">
          <p className="text-xs text-muted-foreground">
            ⚠️ Nutrition data is estimated using the USDA FoodData Central database and may not exactly match
            dining hall preparations. Use as a guide, not as medical advice.
          </p>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="group rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:border-primary/20">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="mb-2 font-heading text-lg font-bold">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
