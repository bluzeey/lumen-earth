import React from "react";

interface EligibilityTagsProps {
  tags: string[];
}

export default function EligibilityTags({ tags }: EligibilityTagsProps) {
  if (!tags?.length) return null;
  return (
    <div className="flex gap-1 mt-2">
      {tags.map((tag) => (
        <img
          key={tag}
          src={`https://placehold.co/24x24?text=${encodeURIComponent(tag)}`}
          alt={tag}
          className="h-6 w-6 rounded"
        />
      ))}
    </div>
  );
}
