import { useState } from "react";
import AppLayout from "@/layouts/AppLayout";
import {
  MaterialCard,
  MarketActivityChart,
  SearchFilterBar,
} from "@/components/marketplace";

const marketplaceListings = [
  {
    id: 1,
    name: "Premium Cotton Feedstock",
    description: "100% recycled cotton, Grade A quality",
    pricePerKg: 85,
    availability: "2.4T/month available",
    supplier: "Taj Hotels, Karnataka",
    imageUrl:
      "https://images.unsplash.com/photo-1580164632633-d626b4d92ebe?auto=format&w=400&q=80",
    eligibilityTags: ["epr", "circular"],
    ctaEnabled: true,
  },
  {
    id: 2,
    name: "Cotton-Poly Blend Yarn",
    description: "60% Cotton, 40% Polyester Blend",
    pricePerKg: 72,
    availability: "4.8T/month available",
    supplier: "Independent Chains",
    imageUrl:
      "https://images.unsplash.com/photo-1598032897743-9ef9c7e7e0b1?auto=format&w=400&q=80",
    eligibilityTags: ["sdg12"],
    ctaEnabled: true,
  },
  {
    id: 3,
    name: "Mixed Feedstock",
    description: "Mix fibre, Grade B quality",
    pricePerKg: 65,
    availability: "5.1T/month available",
    supplier: "Mixed Collection, South IN",
    imageUrl:
      "https://images.unsplash.com/photo-1514995669114-2458152f7776?auto=format&w=400&q=80",
    eligibilityTags: ["epr"],
    ctaEnabled: false,
  },
  {
    id: 4,
    name: "Organic Hemp Fibers",
    description: "Sustainably grown hemp fibres, coarse quality",
    pricePerKg: 90,
    availability: "3.2T/month available",
    supplier: "GreenHarvest, North IN",
    imageUrl:
      "https://images.unsplash.com/photo-1522336572468-47b4211c7848?auto=format&w=400&q=80",
    eligibilityTags: ["organic"],
    ctaEnabled: true,
  },
  {
    id: 5,
    name: "Recycled Polyester Chips",
    description: "PET chips from post-consumer bottles",
    pricePerKg: 60,
    availability: "6T/month available",
    supplier: "Waste Solutions, South IN",
    imageUrl:
      "https://images.unsplash.com/photo-1581092160611-fd5a9951d072?auto=format&w=400&q=80",
    eligibilityTags: ["epr"],
    ctaEnabled: true,
  },
  {
    id: 6,
    name: "Viscose Staple Fibres",
    description: "Regenerated cellulose fibre for textiles",
    pricePerKg: 70,
    availability: "4T/month available",
    supplier: "FibreWorks Co., Karnataka",
    imageUrl:
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&w=400&q=80",
    eligibilityTags: ["circular"],
    ctaEnabled: false,
  },
];

const marketActivity = {
  activeListings: 5,
  transactionsThisMonth: 3,
  totalVolumes: "12.3T",
  scatterPoints: [
    { pricePerKg: 85, score: 5 },
    { pricePerKg: 72, score: 4 },
    { pricePerKg: 65, score: 3 },
    { pricePerKg: 90, score: 5 },
    { pricePerKg: 60, score: 2 },
    { pricePerKg: 70, score: 4 },
  ],
};

const materialOptions = ["All Materials", "Cotton", "Blend", "Mixed"];
const regionOptions = ["All Regions", "North IN", "South IN", "Karnataka"];

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("All Materials");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");

  const filtered = marketplaceListings.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMaterial =
      selectedMaterial === "All Materials" ||
      l.name.toLowerCase().includes(selectedMaterial.toLowerCase());
    const matchesRegion =
      selectedRegion === "All Regions" ||
      l.supplier.toLowerCase().includes(selectedRegion.toLowerCase());
    return matchesSearch && matchesMaterial && matchesRegion;
  });

  return (
    <AppLayout title="Marketplace">
      <div className="flex flex-col lg:flex-row gap-4 mt-6">
        <div className="flex-1 space-y-4">
          <SearchFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedMaterial={selectedMaterial}
            onMaterialChange={setSelectedMaterial}
            selectedRegion={selectedRegion}
            onRegionChange={setSelectedRegion}
            materials={materialOptions}
            regions={regionOptions}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((listing) => (
              <MaterialCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
        <div className="lg:w-1/3 w-full">
          <MarketActivityChart {...marketActivity} />
        </div>
      </div>
    </AppLayout>
  );
}
