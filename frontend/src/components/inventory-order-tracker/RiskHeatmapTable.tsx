import React from "react";

interface HeatmapRow {
  week: string;
  [sku: string]: number | string;
}

type RiskHeatmapTableProps = {
  heatmapData: HeatmapRow[];
  weeks: string[];
  skus: string[];
};

export const RiskHeatmapTable: React.FC<RiskHeatmapTableProps> = ({
  heatmapData,
  weeks,
  skus,
}) => {
  return (
    <div className="w-full overflow-x-auto border border-gray-200 rounded-md">
      <table className="w-full text-sm pb-2">
        <thead>
          <tr className="bg-green-800 text-white">
            <th className="border px-2 py-1 text-left">SKU</th>
            {weeks.map((week) => (
              <th key={week} className="border px-2 py-1 text-center">
                {week}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {skus.map((sku) => (
            <tr key={sku}>
              <td className="border px-2 py-1 font-medium text-left">{sku}</td>
              {weeks.map((week) => {
                const avgRisk = Number(
                  heatmapData.find((row) => row.week === week)?.[sku] ?? 0
                );

                let bgColor = "";
                let textColor = "black";
                if (avgRisk >= 4) {
                  bgColor = "#cc9aff";
                } else if (avgRisk >= 2) {
                  bgColor = "#afd14d";
                } else {
                  bgColor = "#ff4e4e";
                  textColor = "white";
                }

                return (
                  <td
                    key={week}
                    className="border px-2 py-1 text-center"
                    style={{ backgroundColor: bgColor, color: textColor }}
                    title={`SKU: ${sku}\nWeek: ${week}\nAvg Risk Score: ${avgRisk.toFixed(1)}`}
                  >
                    {avgRisk.toFixed(1)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};