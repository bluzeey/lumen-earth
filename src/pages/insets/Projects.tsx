import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import AppLayout from "@/layouts/AppLayout";

// Dummy project data (replace with API later)
const mockProjects = Array.from({ length: 24 }).map((_, i) => ({
  id: `PRJ-${1000 + i}`,
  name: `Project ${i + 1}`,
  material: ["PET", "Cotton", "Wool"][i % 3],
  methodology: "Recycling – PET vs Virgin",
  credits: 1000 + i * 50,
  status: ["Pending", "Verified", "Sold"][i % 3],
}));

const materialTypes = ["All", "PET", "Cotton", "Wool"];
const statusTypes = ["All", "Pending", "Verified", "Sold"];

export default function InsetProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState(mockProjects);
  const [filtered, setFiltered] = useState(mockProjects);

  const [materialFilter, setMaterialFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [openDialog, setOpenDialog] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const pageCount = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Filter logic
  useEffect(() => {
    let temp = [...projects];
    if (materialFilter !== "All")
      temp = temp.filter((p) => p.material === materialFilter);
    if (statusFilter !== "All")
      temp = temp.filter((p) => p.status === statusFilter);
    setFiltered(temp);
    setPage(1);
  }, [materialFilter, statusFilter, projects]);

  // Handle form submit (mock only)
  const handleAddProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const material = (form.elements.namedItem("material") as HTMLInputElement)
      .value;
    const newProject = {
      id: `PRJ-${Date.now()}`,
      name,
      material,
      methodology: "Recycling – PET vs Virgin",
      credits: 0,
      status: "Pending",
    };
    setProjects([newProject, ...projects]);
    setOpenDialog(false);
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Inset Projects</h1>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-1" />
                Add New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>Add New Inset Project</DialogHeader>
              <form onSubmit={handleAddProject} className="space-y-4 mt-4">
                <div>
                  <Label>Project Name</Label>
                  <Input name="name" required />
                </div>
                <div>
                  <Label>Material Type</Label>
                  <Input name="material" required />
                </div>
                <Button type="submit">Create Project</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="space-y-1">
            <Label>Material Type</Label>
            <Select value={materialFilter} onValueChange={setMaterialFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {materialTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusTypes.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Material Type</TableHead>
                <TableHead>Methodology</TableHead>
                <TableHead>Credits Generated</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length > 0 ? (
                paginated.map((p) => (
                  <TableRow
                    key={p.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate({ to: `/app/insets/${p.id}` })}
                  >
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.material}</TableCell>
                    <TableCell>{p.methodology}</TableCell>
                    <TableCell>{p.credits}</TableCell>
                    <TableCell>{p.status}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    No projects found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <Pagination className="justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) setPage(page - 1);
                }}
              />
            </PaginationItem>

            {Array.from({ length: pageCount }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={page === i + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(i + 1);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page < pageCount) setPage(page + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </AppLayout>
  );
}
