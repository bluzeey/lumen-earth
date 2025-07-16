import { useNavigate } from "@tanstack/react-router";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  LogOut,
  Package,
  Layers3,
  BadgeDollarSign,
  ClipboardList,
  PlusCircle,
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
    label: "Navigation",
    items: [
      { label: "Traceability", path: "/traceability", icon: Layers3 },
      { label: "Inventory", path: "/$1", icon: Package },
      { label: "Credits", path: "/app/credits", icon: BadgeDollarSign },
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
    ],
  },
  {
    label: "Material Traceability",
    items: [
      { label: "Batches", path: "/material", icon: ClipboardList },
      { label: "New Batch", path: "/material/new", icon: PlusCircle },
    ],
  },
  {
    label: "Marketplace",
    items: [
      { label: "User Inputs", path: "/user-inputs", icon: Sliders },
      { label: "Marketplace", path: "/marketplace", icon: Handshake },
      {
        label: "Green Certification & Finance",
        path: "/app/green-certification",
        icon: ShieldCheck,
      },
    ],
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

        <SidebarContent>
          {sidebarNavigation.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton asChild>
                        <a href={item.path}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <button onClick={handleLogout}>
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
