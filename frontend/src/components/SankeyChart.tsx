import React from "react";
import { ResponsiveSankey } from "@nivo/sankey";

type SankeyNode = { id: string };
type SankeyLink = { source: string; target: string; value: number };
type SankeyData = { nodes: SankeyNode[]; links: SankeyLink[] };

type Props = {
  batches: any[];
};

const safe = (value: unknown): string =>
  typeof value === "string" && value.trim() !== "" ? value.trim() : "Unknown";

// ✅ Light pastel palette for origin nodes
const originColorsPalette = [
  "#a6cee3",
  "#b2df8a",
  "#fdbf6f",
  "#cab2d6",
  "#fb9a99",
  "#ffff99",
  "#fdd0a2",
  "#ccebc5",
  "#e5d8bd",
  "#d9d9d9",
];
const getOriginColor = (index: number): string =>
  originColorsPalette[index % originColorsPalette.length];

type SankeyResult = SankeyData & {
  originColors: Record<string, string>;
};

const generateSankeyDataFromBatches = (batches: any[]): SankeyResult => {
  const nodesSet: Set<string> = new Set();
  const linksMap: Record<string, number> = {};
  const originColors: Record<string, string> = {};
  const uniqueOrigins: string[] = [];

  for (const batch of Array.isArray(batches) ? batches : []) {
    const origin = "Origin: " + safe(batch.sourceName);
    const collection =
      "Collection: " + safe(batch.collectionLocation || batch.sourceName);
    const categorization =
      "Categorization: " + safe(batch.categorizedLocation || batch.destination);
    const recycling =
      "Recycling: " +
      safe(batch.recyclingLocation || batch.categorizedLocation);
    const dispatch =
      "Dispatch: " + safe(batch.destination || batch.dispatchLocation);

    const qty =
      typeof batch.categorizedQty === "number"
        ? batch.categorizedQty
        : parseFloat(batch.categorizedQty || batch.rawMaterialQty || "0");

    if (
      !origin ||
      !collection ||
      !categorization ||
      !recycling ||
      !dispatch ||
      qty === undefined ||
      isNaN(qty)
    )
      continue;

    if (!originColors[origin]) {
      originColors[origin] = getOriginColor(uniqueOrigins.length);
      uniqueOrigins.push(origin);
    }

    const flows: [string, string][] = [
      [origin, collection],
      [collection, categorization],
      [categorization, recycling],
      [recycling, dispatch],
    ];

    [origin, collection, categorization, recycling, dispatch].forEach((node) =>
      nodesSet.add(node)
    );

    for (const [src, tgt] of flows) {
      const key = `${src}|||${tgt}`;
      linksMap[key] = (linksMap[key] || 0) + qty;
    }
  }

  const nodes: SankeyNode[] = Array.from(nodesSet).map((id) => ({ id }));
  const links: SankeyLink[] = Object.entries(linksMap).map(([key, value]) => {
    const [source, target] = key.split("|||");
    return { source, target, value: parseFloat(value.toFixed(2)) };
  });

  return { nodes, links, originColors };
};

// ✅ Light shades for fixed stages
const getStageColor = (id: string): string => {
  if (id.startsWith("Collection:")) return "#c7e9c0"; // pale green
  if (id.startsWith("Categorization:")) return "#fdd49e"; // light orange
  if (id.startsWith("Recycling:")) return "#dadaeb"; // lavender
  if (id.startsWith("Dispatch:")) return "#fcbba1"; // soft red
  return "#eeeeee"; // default light gray
};

export const SankeyChart: React.FC<Props> = ({ batches }) => {
  if (!Array.isArray(batches)) {
    return <div className="text-red-500">Error: Invalid batch data</div>;
  }

  const { nodes, links, originColors } = generateSankeyDataFromBatches(batches);

  if (!nodes.length || !links.length) {
    return <div className="text-gray-500">No flows to visualize</div>;
  }

  return (
    <div
      style={{
        height: 450,
        width: "100%",
        maxWidth: "100vw",
        overflowX: "auto",
      }}
    >
      <ResponsiveSankey
        data={{ nodes, links }}
        margin={{ top: 20, right: 60, bottom: 20, left: 60 }}
        align="justify"
        nodeOpacity={1}
        nodeThickness={12}
        nodeInnerPadding={6}
        nodeSpacing={16}
        nodeBorderWidth={1}
        nodeBorderColor={{ from: "color", modifiers: [["darker", 0.8]] }}
        linkOpacity={1}
        linkHoverOpacity={1}
        linkHoverOthersOpacity={0.1}
        enableLinkGradient={false}
        labelPosition="inside"
        labelOrientation="horizontal"
        labelPadding={6}
        labelTextColor={{ from: "color", modifiers: [["darker", 1.2]] }}
        animate={true}
        motionConfig="gentle"
        colors={(item: SankeyNode | SankeyLink) => {
          if ("id" in item) {
            const id = item.id;
            if (id.startsWith("Origin:")) {
              return originColors[id] || "#a6cee3";
            }
            return getStageColor(id);
          } else {
            return getStageColor(item.source);
          }
        }}
      />
    </div>
  );
};
