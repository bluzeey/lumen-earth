import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import EligibilityTags from "./EligibilityTags";

export interface MarketplaceListing {
  id: number;
  name: string;
  description: string;
  pricePerKg: number;
  availability: string;
  supplier: string;
  imageUrl: string;
  eligibilityTags: string[];
  ctaEnabled: boolean;
}

interface MaterialCardProps {
  listing: MarketplaceListing;
}

export default function MaterialCard({ listing }: MaterialCardProps) {
  return (
    <Card className="rounded-xl border shadow-sm p-4 bg-white flex flex-col">
      <img
        src={listing.imageUrl}
        alt={listing.name}
        className="h-32 w-full object-cover rounded-md"
      />
      <div className="mt-3 flex flex-col gap-1 flex-1">
        <h3 className="text-charcoal font-semibold">{listing.name}</h3>
        <p className="text-sm text-charcoal">{listing.description}</p>
        <div className="text-primary font-medium text-lg mt-1">
          ₹{listing.pricePerKg}/kg
        </div>
        <div className="text-sm">{listing.supplier}</div>
        <EligibilityTags tags={listing.eligibilityTags} />
        <div className="text-green-600 text-sm mt-1">{listing.availability}</div>
        <Button
          disabled={!listing.ctaEnabled}
          className={
            listing.ctaEnabled
              ? "bg-charcoal text-white hover:bg-leaf mt-auto"
              : "bg-gray-200 text-gray-500 cursor-not-allowed mt-auto"
          }
        >
          View Details
        </Button>
      </div>
    </Card>
  );
}
