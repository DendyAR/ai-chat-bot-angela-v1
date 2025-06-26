// components/SettingsMenu.tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Settings2Icon, TrashIcon, RefreshCcwIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetActiveSession,
  clearAllSessions,
} from "@/features/chatSessionsSlice";
import { RootState } from "@/store";

export function SettingsMenu() {
  const dispatch = useDispatch();
  const activeSessionId = useSelector(
    (state: RootState) => state.chat.activeSessionId
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <Settings2Icon className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            if (!activeSessionId) {
              alert("Tidak ada obrolan aktif untuk di-reset.");
              return;
            }
            dispatch(resetActiveSession());
          }}
          className="text-yellow-600"
        >
          <RefreshCcwIcon className="w-4 h-4 mr-2" />
          Reset Obrolan Aktif
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            if (confirm("Yakin ingin menghapus semua obrolan?")) {
              dispatch(clearAllSessions());
            }
          }}
          className="text-red-600"
        >
          <TrashIcon className="w-4 h-4 mr-2" />
          Hapus Semua Obrolan
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
