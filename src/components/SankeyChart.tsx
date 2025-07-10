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
    const source = safe(batch.sourceName);
    const material = safe(batch.materialName);
    const product = safe(batch.productItem);
    const destination = safe(
      batch.categorizedLocation ||
        batch.destination ||
        batch.contaminationCategory
    );

    const qty =
      typeof batch.categorizedQty === "number"
        ? batch.categorizedQty
        : parseFloat(batch.categorizedQty || batch.rawMaterialQty || "0");

    if (
      !source ||
      !material ||
      !product ||
      !destination ||
      qty === undefined ||
      isNaN(qty)
    ) {
      continue;
    }

    const flows: [string, string][] = [
      [source, material],
      [material, product],
      [product, destination],
    ];

    [source, material, product, destination].forEach((node) =>
      nodesSet.add(node)
    );

    for (const [src, tgt] of flows) {
      const key = `${src}|||${tgt}`;
      linksMap[key] = (linksMap[key] || 0) + qty;
    }
  }

  const nodes: SankeyNode[] = Array.from(nodesSet).map((id) => ({ id }));
  const links: SankeyLink[] = Object.entries(linksMap)
    .filter(([key]) => {
      const [src, tgt] = key.split("|||");
      return nodesSet.has(src) && nodesSet.has(tgt);
    })
    .map(([key, value]) => {
      const [source, target] = key.split("|||");
      return { source, target, value: parseFloat(value.toFixed(2)) };
    });

  return { nodes, links };
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
    <div style={{ height: 500 }}>
      <ResponsiveSankey
        data={data}
        margin={{ top: 40, right: 160, bottom: 40, left: 200 }}
        align="justify"
        colors={{ scheme: "category10" }}
        nodeOpacity={1}
        nodeThickness={15}
        nodeInnerPadding={6}
        nodeSpacing={24}
        nodeBorderWidth={1}
        nodeBorderColor={{ from: "color", modifiers: [["darker", 0.8]] }}
        linkOpacity={0.5}
        linkHoverOpacity={0.6}
        linkHoverOthersOpacity={0.1}
        enableLinkGradient
        labelPosition="outside"
        labelOrientation="horizontal"
        labelPadding={16}
        labelTextColor={{ from: "color", modifiers: [["darker", 1]] }}
        animate={true}
        motionConfig="gentle"
      />
    </div>
  );
};
