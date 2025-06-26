import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addSession,
  setActiveSession,
  setActiveModel,
  deleteSession,
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
import { PlusIcon, TrashIcon } from "lucide-react";
import { RootState } from "@/store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const dispatch = useDispatch();
  const sessions = useSelector((state: RootState) => state.chat.sessions);
  const activeSessionId = useSelector(
    (state: RootState) => state.chat.activeSessionId
  );
  const activeModel = useSelector((state: RootState) => state.chat.activeModel); // ✅ betulkan ini

  const [searchTerm, setSearchTerm] = React.useState("");
  const filteredSessions = sessions.filter((session) =>
    session.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        {/* Model Switcher */}
        <VersionSwitcher
          versions={[
            { label: "Claude 3.7", value: "anthropic/claude-3.7-sonnet:beta" },
            {
              label: "Mistral 24B",
              value: "mistralai/mistral-small-3.2-24b-instruct:free",
            },
            {
              label: "Gemini 2.5",
              value: "google/gemini-2.5-flash-lite-preview-06-17",
            },
            { label: "GPT-4.1", value: "openai/gpt-4.1" },
            { label: "Grok 3", value: "x-ai/grok-3-mini" },
            { label: "Kimi 72B", value: "moonshotai/kimi-dev-72b:free" },
          ]}
          defaultVersion={activeModel}
          key={activeModel}
          onChange={(value) => {
            dispatch(setActiveModel(value)); // Ganti model
            dispatch(addSession()); // Buat obrolan baru
          }}
        />

        {/* Pencarian Chat */}
        <SearchForm value={searchTerm} onChange={setSearchTerm} />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>List Chat</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredSessions.map((session) => (
                <SidebarMenuItem
                  key={session.id}
                  className="flex items-center justify-between"
                >
                  <SidebarMenuButton
                    onClick={() => dispatch(setActiveSession(session.id))}
                    className={`truncate text-left text-sm flex-1 ${
                      session.id === activeSessionId ? "bg-accent" : ""
                    }`}
                  >
                    {session.title || "Chat Baru"}
                  </SidebarMenuButton>

                  {/* Hapus dengan Dialog */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="ml-2 p-1 hover:text-red-600">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Obrolan Ini?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tindakan ini akan menghapus obrolan{" "}
                          <strong>{session.title || "Chat Baru"}</strong> secara
                          permanen.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => dispatch(deleteSession(session.id))}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </SidebarMenuItem>
              ))}

              {/* Tombol Tambah Obrolan Baru */}
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
