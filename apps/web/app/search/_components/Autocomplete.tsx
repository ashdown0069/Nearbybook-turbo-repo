"use client";

import { useState } from "react";
import { useDebounce } from "react-use";
import { BookOpen } from "lucide-react";
import { useGetAutoCompleteResult } from "@repo/data-access";
import { axiosInstance } from "@/lib/axios";
import {
  Command,
  CommandList,
  CommandGroup,
  CommandItem,
} from "@repo/ui/components/command";

interface AutocompleteProps {
  query: string;
  mode: "title" | "isbn";
  isOpen: boolean;
  onSelect: (value: string) => void;
}

interface Hit {
  title: string;
  isbn: string;
  authors: string;
  publisher: string;
  publicationYear: string;
  vol: string | null;
}

export default function Autocomplete({
  query,
  mode,
  isOpen,
  onSelect,
}: AutocompleteProps) {
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useDebounce(() => setDebouncedQuery(query), 300, [query]);

  const { data } = useGetAutoCompleteResult(
    axiosInstance,
    debouncedQuery,
    mode,
  );

  if (!isOpen || !data?.hits?.length) return null;

  return (
    <div className="absolute top-full right-0 left-0 z-50 mt-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
      <Command shouldFilter={false}>
        <CommandList>
          <CommandGroup>
            {data.hits.map((hit: Hit, idx: number) => (
              <CommandItem
                key={idx}
                value={hit.isbn}
                onSelect={() => onSelect(hit.isbn)}
                className="cursor-pointer px-3 py-2.5"
              >
                <BookOpen className="mr-2 h-4 w-4 shrink-0 text-green-500" />
                <div className="flex flex-col overflow-hidden">
                  <span className="truncate text-sm font-medium text-slate-800">
                    {hit.title}
                    <span className="truncate text-slate-400">
                      {" "}
                      {hit.publicationYear}
                    </span>
                  </span>
                  <span className="truncate text-xs text-slate-400">
                    {hit.authors} - {hit.isbn}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}
