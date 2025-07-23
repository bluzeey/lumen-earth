import * as React from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  type ColumnDef,
  type Row,
  type VisibilityState,
  type SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Schema
export const enrichedBatchSchema = z.object({
  batchId: z.string(),
  materialName: z.string(),
  composition: z.string().optional(),
  sourceName: z.string().optional(),
  supplierName: z.string().optional(),
  materialComposition: z.string().optional(),
  rawMaterialQty: z.union([z.string(), z.number()]).optional(),
  collectedQty: z.union([z.string(), z.number()]).optional(),
  categorizedQty: z.union([z.string(), z.number()]).optional(),
  yieldPercentage: z.union([z.string(), z.number()]).optional(),
  dateOfDispatchFromSource: z.string().optional(),
  dateReceivedAtCollection: z.string().optional(),
  dateOfCategorization: z.string().optional(),
  parsedDate: z.union([z.string(), z.date()]).optional(),
});

// Drag handle
function DragHandle({ id }: { id: UniqueIdentifier }) {
  const { attributes, listeners } = useSortable({ id });
  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      ⋮
    </Button>
  );
}

// Columns
const columns: ColumnDef<z.infer<typeof enrichedBatchSchema>>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => (
      <DragHandle
        id={(row.original.batchId ?? crypto.randomUUID()).toString()}
      />
    ),
  },
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
  },
  { accessorKey: "batchId", header: "Batch ID" },
  { accessorKey: "materialName", header: "Material" },
  {
    accessorKey: "rawMaterialQty",
    header: "Raw Qty",
    cell: ({ getValue }) => {
      const value = getValue();
      return value !== undefined && value !== null
        ? `${parseFloat(value as string).toFixed(2)} T`
        : "-";
    },
  },
  {
    accessorKey: "composition",
    header: "Composition",
    enableHiding: true,
  },
  {
    accessorKey: "sourceName",
    header: "Source",
    enableHiding: true,
  },
  {
    accessorKey: "supplierName",
    header: "Supplier",
    enableHiding: true,
  },
  {
    accessorKey: "materialComposition",
    header: "Material Composition",
    enableHiding: true,
  },
  {
    accessorKey: "collectedQty",
    header: "Collected Qty",
    enableHiding: true,
  },
  {
    accessorKey: "categorizedQty",
    header: "Categorized Qty",
    enableHiding: true,
  },
  {
    accessorKey: "yieldPercentage",
    header: "Yield %",
    enableHiding: true,
    cell: ({ getValue }) => {
      const value = getValue();
      return value !== undefined && value !== null ? `${value}%` : "-";
    },
  },
  {
    accessorKey: "dateOfDispatchFromSource",
    header: "Dispatched",
    enableHiding: true,
  },
  {
    accessorKey: "dateReceivedAtCollection",
    header: "Received",
    enableHiding: true,
  },
  {
    accessorKey: "dateOfCategorization",
    header: "Categorized",
    enableHiding: true,
  },
];

// Draggable row
function DraggableRow({
  row,
}: {
  row: Row<z.infer<typeof enrichedBatchSchema>>;
}) {
  const { transform, transition, setNodeRef } = useSortable({
    id: (row.original.batchId ?? crypto.randomUUID()).toString(),
  });

  return (
    <TableRow
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      data-state={row.getIsSelected() && "selected"}
      className="border-b border-border hover:bg-muted/60 transition-all duration-200 text-sm"
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

// DataTable
export function DataTable({
  data: initialData,
}: {
  data: z.infer<typeof enrichedBatchSchema>[];
}) {
  const [data, setData] = React.useState(() => {
    const parsed = initialData.map((b) => ({
      ...b,
      parsedDate:
        typeof b.parsedDate === "string"
          ? new Date(b.parsedDate)
          : b.parsedDate,
    }));
    console.log("Parsed Data:", parsed);
    return parsed;
  });

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      collectedQty: false,
      categorizedQty: false,
      yieldPercentage: false,
      dateOfDispatchFromSource: false,
      dateReceivedAtCollection: false,
      dateOfCategorization: false,
      supplierName: false,
      materialComposition: false,
      composition: false,
      sourceName: false,
    });

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () =>
      data.map((row) =>
        typeof row.batchId === "string" ? row.batchId : crypto.randomUUID()
      ),
    [data]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getRowId: (row) => (row.batchId ?? crypto.randomUUID()).toString(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = dataIds.indexOf(active.id);
      const newIndex = dataIds.indexOf(over.id);
      setData(arrayMove(data, oldIndex, newIndex));
    }
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-[#204936] text-primary text-xs font-semibold uppercase tracking-wider shadow-sm"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="p-3 border-b border-border text-left"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              <SortableContext
                items={dataIds}
                strategy={verticalListSortingStrategy}
              >
                {table.getRowModel().rows.map((row) => (
                  <DraggableRow key={row.id} row={row} />
                ))}
              </SortableContext>
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DndContext>
    </div>
  );
}
