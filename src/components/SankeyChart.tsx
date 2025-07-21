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

const generateSankeyDataFromBatches = (batches: any[]): SankeyData => {
  const nodesSet: Set<string> = new Set();
  const linksMap: Record<string, number> = {};

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

  return { nodes, links };
};

const getStageColor = (id: string): string => {
  if (id.startsWith("Origin:")) return "#1f77b4";
  if (id.startsWith("Collection:")) return "#2ca02c";
  if (id.startsWith("Categorization:")) return "#ff7f0e";
  if (id.startsWith("Recycling:")) return "#9467bd";
  if (id.startsWith("Dispatch:")) return "#d62728";
  return "#7f7f7f";
};

export const SankeyChart: React.FC<Props> = ({ batches }) => {
  if (!Array.isArray(batches)) {
    return <div className="text-red-500">Error: Invalid batch data</div>;
  }

  const data = generateSankeyDataFromBatches(batches);

  if (!data.nodes.length || !data.links.length) {
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
        data={data}
        margin={{ top: 20, right: 60, bottom: 20, left: 60 }} // tighter margins
        align="justify"
        nodeOpacity={1}
        nodeThickness={12}
        nodeInnerPadding={6} // slightly more padding between vertical nodes
        nodeSpacing={8} // tighter horizontal spacing between columns
        nodeBorderWidth={1}
        nodeBorderColor={{ from: "color", modifiers: [["darker", 0.8]] }}
        linkOpacity={1}
        linkHoverOpacity={1}
        linkHoverOthersOpacity={0.1}
        enableLinkGradient={false}
        labelPosition="inside"
        labelOrientation="horizontal"
        labelPadding={20} // smaller label spacing
        labelTextColor={{ from: "color", modifiers: [["darker", 1.2]] }}
        animate={true}
        motionConfig="gentle"
        nodeColor={(node) => getStageColor(node.id)}
        linkColor={(link) => getStageColor(link.source.id)}
      />
    </div>
  );
};
