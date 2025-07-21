import { useNavigate } from "@tanstack/react-router";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  LogOut,
  Layers3,
  ClipboardList,
  UploadCloud,
  Aperture,
  LayoutGrid,
  Store,
  ShieldCheck,
  Leaf,
  BadgeDollarSign,
  Landmark,
  Settings,
  Map,
  ChevronRight,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { type ReactNode, useState } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  function toggleGroup(label: string) {
    setOpenGroup((prev) => (prev === label ? null : label));
  }

  function handleLogout() {
    navigate({ to: "/login" });
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex justify-center">
            <img
              src="/logo.png"
              alt="Lumen Logo"
              className="h-12 md:h-12 object-contain"
            />
          </div>
        </SidebarHeader>

        <SidebarContent className="mt-4">
          <SidebarGroup>
            <SidebarMenu>
              {/* Group: Lumenosity */}
              <Collapsible asChild defaultOpen>
                <SidebarMenuItem className="group mt-4">
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Lumenosity">
                      <Aperture className="h-4 w-4" />
                      <span className="text-base">Lumenosity</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <a href="/material-flow-tracer">
                            <Layers3 className="mr-2 h-4 w-4" />
                            Material Flow Trace
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <a href="/order-tracker">
                            <ClipboardList className="mr-2 h-4 w-4" />
                            Order Track
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <a href="/user-inputs">
                            <UploadCloud className="mr-2 h-4 w-4" />
                            Data Import
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Group: LumenScape */}
              <Collapsible asChild defaultOpen>
                <SidebarMenuItem className="group mt-4">
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="LumenScape">
                      <LayoutGrid className="h-4 w-4" />
                      <span className="text-base">LumenScape</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <a href="/marketplace">
                            <Store className="mr-2 h-4 w-4" />
                            Goods Marketplace
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <a href="/credits/comply">
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            INCCTS Comply
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <a href="/credits/offset">
                            <Leaf className="mr-2 h-4 w-4" />
                            INCCTS Offset
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <a href="/credits/grs">
                            <Leaf className="mr-2 h-4 w-4" />
                            GRS
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Group: LumenCredits */}
              <Collapsible asChild defaultOpen>
                <SidebarMenuItem className="group mt-4">
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="LumenCredits">
                      <BadgeDollarSign className="h-4 w-4" />
                      <span className="text-base">LumenCredits</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <a href="/financialization">
                            <BadgeDollarSign className="mr-2 h-4 w-4" />
                            Financialization
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <a href="/registry">
                            <Landmark className="mr-2 h-4 w-4" />
                            Registry
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Group: System */}
              <Collapsible asChild defaultOpen>
                <SidebarMenuItem className="group mt-4">
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="System">
                      <Settings className="h-4 w-4" />
                      <span className="text-base">System</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <a href="/settings">
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <a href="/boundary">
                            <Map className="mr-2 h-4 w-4" />
                            Boundary
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
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
