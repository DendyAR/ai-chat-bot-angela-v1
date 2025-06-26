"use client";

import * as React from "react";
import { Check, ChevronsUpDown, GalleryVerticalEnd } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function VersionSwitcher({
  versions,
  defaultVersion,
  onChange,
}: {
  versions: { label: string; value: string }[];
  defaultVersion: string;
  onChange?: (value: string) => void;
}) {
  const defaultSelected =
    versions.find((v) => v.value === defaultVersion) || versions[0];

  const [selectedVersion, setSelectedVersion] = React.useState(defaultSelected);

  const handleSelect = (version: { label: string; value: string }) => {
    setSelectedVersion(version);
    onChange?.(version.value); // ✅ kirim nilai model aslinya
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="flex flex-col text-left ml-2">
                <span className="text-xs text-muted-foreground">
                  {selectedVersion.label}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            {versions.map((version) => (
              <DropdownMenuItem
                key={version.value}
                onSelect={() => handleSelect(version)}
              >
                {version.label}
                {version.value === selectedVersion.value && (
                  <Check className="ml-auto" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
