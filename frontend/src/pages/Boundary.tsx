import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/AppLayout";

export default function BoundaryPage() {
  const [project, setProject] = useState("");
  const [file, setFile] = useState<File | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log({ project, file });
  }

  return (
    <AppLayout title="Boundary">
      <div className="max-w-xl mx-auto space-y-6 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Boundary Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="project">Project Name</Label>
              <Input
                id="project"
                value={project}
                onChange={(e) => setProject(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="file">Boundary File</Label>
              <Input
                id="file"
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </div>
              <Button type="submit">Save</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
