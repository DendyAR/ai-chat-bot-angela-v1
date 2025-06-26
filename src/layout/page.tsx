import { AppSidebar } from "@/components/app-sidebar";
import Chat from "@/components/Chat";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SettingsMenu } from "@/components/SettingsMenu";

export default function Page() {
  return (
    <SidebarProvider>
      <div className="flex w-full h-screen">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col bg-background">
          {/* Header */}
          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-6" />
            <div className="ml-auto flex items-center gap-2">
              <SettingsMenu />
              <ModeToggle />
            </div>
          </header>

          {/* Main Chat Area */}
          <main className="flex-1 w-full overflow-hidden">
            <Chat />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
