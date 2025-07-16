import { useNavigate } from "@tanstack/react-router";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  LogOut,
  Layers3,
  ClipboardList,
  Sliders,
  Handshake,
  ShieldCheck,
} from "lucide-react";
import { type ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

const sidebarNavigation = [
  {
    label: "Material Flow Tracer",
    path: "/material-flow-tracer",
    icon: Layers3,
  },
  {
    label: "Inventory Tracker",
    path: "/inventory-tracker",
    icon: ClipboardList,
  },
  { label: "User Inputs", path: "/user-inputs", icon: Sliders },
  { label: "Marketplace", path: "/marketplace", icon: Handshake },
  {
    label: "Green Certification & Finance",
    path: "/green-certifications",
    icon: ShieldCheck,
  },
];

export default function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();

  function handleLogout() {
    navigate({ to: "/login" });
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex justify-start">
            <img
              src="/logo.png"
              alt="Lumen Logo"
              className="h-10 md:h-12 object-contain"
            />
          </div>
        </SidebarHeader>

        <SidebarContent className="mt-4">
          <SidebarMenu className="space-y-1.5">
            {sidebarNavigation.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton asChild>
                  <a
                    href={item.path}
                    className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-muted transition-colors"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu className="space-y-1.5">
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted transition-colors w-full text-left"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <div className="p-6 w-full h-full">{children}</div>
    </SidebarProvider>
  );
}
