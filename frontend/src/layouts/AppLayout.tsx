import { useNavigate, Link } from "@tanstack/react-router";
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
} from "src/components/ui/sidebar";
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
} from "src/components/ui/collapsible";
import { type ReactNode } from "react";
import { SiteHeader } from "src/components/site-header";

interface AppLayoutProps {
  children: ReactNode;
  title: string;
}

export default function AppLayout({
  children,
  title = "Documents",
}: AppLayoutProps) {
  const navigate = useNavigate();

  function handleLogout() {
    navigate({ to: "/login" });
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex flex-col items-center justify-center">
            <img
              src="/logo.png"
              alt="Lumen Logo"
              className="h-12 md:h-12 object-contain"
            />
            <span className="ml-12 italic font-semibold text-gray-500">
              for Respun
            </span>
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
                          <Link
                            to="/material-flow-tracer"
                            activeProps={{
                              className: "text-primary font-medium bg-lime-300",
                            }}
                            inactiveProps={{
                              className: "text-muted-foreground",
                            }}
                          >
                            <Layers3 className="mr-2 h-4 w-4" />
                            Material Flow Tracer
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link
                            to="/order-tracker"
                            activeProps={{
                              className: "text-primary font-medium bg-lime-300",
                            }}
                            inactiveProps={{
                              className: "text-muted-foreground",
                            }}
                          >
                            <ClipboardList className="mr-2 h-4 w-4" />
                            Order Track
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link
                            to="/user-inputs"
                            activeProps={{
                              className: "text-primary font-medium bg-lime-300",
                            }}
                            inactiveProps={{
                              className: "text-muted-foreground",
                            }}
                          >
                            <UploadCloud className="mr-2 h-4 w-4" />
                            Data Import
                          </Link>
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
                          <Link
                            to="/marketplace"
                            activeProps={{
                              className: "text-primary font-medium bg-lime-300",
                            }}
                            inactiveProps={{
                              className: "text-muted-foreground",
                            }}
                          >
                            <Store className="mr-2 h-4 w-4" />
                            Goods Marketplace
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link
                            to="/credits/comply"
                            activeProps={{
                              className: "text-primary font-medium bg-lime-300",
                            }}
                            inactiveProps={{
                              className: "text-muted-foreground",
                            }}
                          >
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            INCCTS Comply
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link
                            to="/credits/offset"
                            activeProps={{
                              className: "text-primary font-medium bg-lime-300",
                            }}
                            inactiveProps={{
                              className: "text-muted-foreground",
                            }}
                          >
                            <Leaf className="mr-2 h-4 w-4" />
                            INCCTS Offset
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link
                            to="/credits/grs"
                            activeProps={{
                              className: "text-primary font-medium bg-lime-300",
                            }}
                            inactiveProps={{
                              className: "text-muted-foreground",
                            }}
                          >
                            <Leaf className="mr-2 h-4 w-4" />
                            GRS
                          </Link>
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
                          <Link
                            to="/financialization"
                            activeProps={{
                              className: "text-primary font-medium bg-lime-300",
                            }}
                            inactiveProps={{
                              className: "text-muted-foreground",
                            }}
                          >
                            <BadgeDollarSign className="mr-2 h-4 w-4" />
                            Financialization
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link
                            to="/registry"
                            activeProps={{
                              className: "text-primary font-medium bg-lime-300",
                            }}
                            inactiveProps={{
                              className: "text-muted-foreground",
                            }}
                          >
                            <Landmark className="mr-2 h-4 w-4" />
                            Registry
                          </Link>
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
                          <Link
                            to="/settings"
                            activeProps={{
                              className: "text-primary font-medium bg-lime-300",
                            }}
                            inactiveProps={{
                              className: "text-muted-foreground",
                            }}
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link
                            to="/boundary"
                            activeProps={{
                              className: "text-primary font-medium bg-lime-300",
                            }}
                            inactiveProps={{
                              className: "text-muted-foreground",
                            }}
                          >
                            <Map className="mr-2 h-4 w-4" />
                            Boundary
                          </Link>
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

      <div className="p-6 w-full h-screen">
        <SiteHeader title={title} />
        {children}
      </div>
    </SidebarProvider>
  );
}
