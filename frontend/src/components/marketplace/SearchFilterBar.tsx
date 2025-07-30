import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (v: string) => void;
  selectedMaterial: string;
  onMaterialChange: (v: string) => void;
  selectedRegion: string;
  onRegionChange: (v: string) => void;
  materials: string[];
  regions: string[];
}

export default function SearchFilterBar({
  searchQuery,
  onSearchChange,
  selectedMaterial,
  onMaterialChange,
  selectedRegion,
  onRegionChange,
  materials,
  regions,
}: SearchFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 bg-white p-4 rounded-md">
      <Input
        placeholder="Search materials, products or suppliers..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="bg-beige rounded-md p-2 w-full text-sm"
      />
      <Select value={selectedMaterial} onValueChange={onMaterialChange}>
        <SelectTrigger className="bg-beige rounded-md p-2 w-full text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {materials.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={selectedRegion} onValueChange={onRegionChange}>
        <SelectTrigger className="bg-beige rounded-md p-2 w-full text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {regions.map((r) => (
            <SelectItem key={r} value={r}>
              {r}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
