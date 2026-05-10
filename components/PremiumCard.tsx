import { Check } from "lucide-react";
import { Card, Button } from "@/components/ui";

export function PremiumCard({
  name,
  price,
  features,
  highlighted
}: {
  name: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <Card className={highlighted ? "border-sage/30 bg-white" : undefined}>
      <p className="font-serif text-2xl text-ink">{name}</p>
      <p className="mt-3 text-3xl font-bold text-sage">{price}</p>
      <ul className="mt-5 space-y-3 text-sm text-ink/72">
        {features.map((feature) => (
          <li className="flex gap-2" key={feature}>
            <Check className="mt-0.5 shrink-0 text-sage" size={17} aria-hidden />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button className="mt-6 w-full" variant={highlighted ? "primary" : "secondary"}>
        Entrar na lista de espera
      </Button>
    </Card>
  );
}
