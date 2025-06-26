import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addSession,
  setActiveSession,
} from "@/features/chatSessionsSlice";

import { SearchForm } from "@/components/search-form";
import { VersionSwitcher } from "@/components/version-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { PlusIcon } from "lucide-react";
import { RootState } from "@/store";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const dispatch = useDispatch();
  const sessions = useSelector((state: RootState) => state.chat.sessions);
  const activeSessionId = useSelector(
    (state: RootState) => state.chat.activeSessionId
  );
  const [searchTerm, setSearchTerm] = React.useState("");
  const filteredSessions = sessions.filter((session) =>
    session.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={["1.0.1", "1.1.0", "2.0.0-beta"]}
          defaultVersion="1.0.1"
        />
        <SearchForm value={searchTerm} onChange={setSearchTerm} />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>List Chat</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* List semua sesi chat */}
              {filteredSessions.map((session) => (
                <SidebarMenuItem key={session.id}>
                  <SidebarMenuButton
                    onClick={() => dispatch(setActiveSession(session.id))}
                    className={`truncate text-left ${
                      session.id === activeSessionId ? "bg-accent" : ""
                    }`}
                  >
                    {session.title || "Untitled Chat"}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* ➕ Obrolan Baru */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => dispatch(addSession())}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                >
                  <PlusIcon className="w-4 h-4" />
                  Obrolan Baru
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
