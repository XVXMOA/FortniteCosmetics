import { useState } from "react";
import { ChevronDown, ArrowUpAZ, ArrowDownAZ, ArrowUpZA, ArrowDownZA, Calendar, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export type SortOption = 
  | "rarity-low-high"
  | "rarity-high-low" 
  | "alphabetical-a-z"
  | "alphabetical-z-a"
  | "last-seen"
  | "most-recent";

interface SortDropdownProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const sortOptions = [
  {
    value: "rarity-low-high" as SortOption,
    label: "Rarity: Low to High",
    icon: ArrowUpAZ
  },
  {
    value: "rarity-high-low" as SortOption,
    label: "Rarity: High to Low", 
    icon: ArrowDownAZ
  },
  {
    value: "alphabetical-a-z" as SortOption,
    label: "Alphabetical: A-Z",
    icon: ArrowUpAZ
  },
  {
    value: "alphabetical-z-a" as SortOption,
    label: "Alphabetical: Z-A",
    icon: ArrowDownZA
  },
  {
    value: "last-seen" as SortOption,
    label: "Last Seen/Rarest",
    icon: Eye
  },
  {
    value: "most-recent" as SortOption,
    label: "Most Recent",
    icon: Calendar
  }
];

export const SortDropdown = ({ currentSort, onSortChange }: SortDropdownProps) => {
  const [open, setOpen] = useState(false);
  const currentOption = sortOptions.find(option => option.value === currentSort);

  const handleSortChange = (sort: SortOption) => {
    onSortChange(sort);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700/50 min-w-[200px] justify-between"
        >
          <div className="flex items-center gap-2">
            {currentOption && <currentOption.icon className="h-4 w-4" />}
            <span>{currentOption?.label || "Sort by"}</span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-[200px] bg-slate-800 border-slate-700 text-white"
        onInteractOutside={() => setOpen(false)}
      >
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleSortChange(option.value)}
            className="flex items-center gap-2 hover:bg-slate-700 focus:bg-slate-700 cursor-pointer"
          >
            <option.icon className="h-4 w-4" />
            <span>{option.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
