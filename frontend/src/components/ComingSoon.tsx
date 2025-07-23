import AppLayout from "@/layouts/AppLayout";

interface ComingSoonProps {
  title: string;
}

export default function ComingSoon({ title }: ComingSoonProps) {
  return (
    <AppLayout title={title}>
      <div className="mt-6">
        <h1 className="text-3xl font-bold">Coming soon</h1>
      </div>
    </AppLayout>
  );
}
