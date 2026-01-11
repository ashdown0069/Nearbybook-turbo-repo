"use client";
import Form from "next/form";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@repo/ui/components/input";
import { Button } from "@repo/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { useActionState, useState } from "react";
import { searchAction } from "../action";
import { useDebounce } from "react-use";
import { useQueryClient } from "@tanstack/react-query";
import { PrefetchSearchBooks } from "@repo/data-access";
import { axiosInstance } from "@/lib/axios";

export default function Search() {
  const [state, action, isPending] = useActionState(searchAction, {
    error: null,
    success: false,
    query: "",
    mode: "title",
  });

  const [query, setQuery] = useState(state.query);
  const [mode, setMode] = useState(state.mode);
  const queryClient = useQueryClient();

  useDebounce(
    async () => {
      if (query) {
        await PrefetchSearchBooks(axiosInstance, queryClient, mode, query, "1");
      }
    },
    500,
    [query, mode],
  );

  return (
    <div className="h-fit w-full max-w-2xl px-4 py-4">
      <Form
        key={JSON.stringify(state)}
        action={action}
        className="relative flex w-full items-center rounded-full border border-slate-200 bg-white p-2 transition-all focus-within:ring-2 focus-within:ring-green-500/20"
      >
        <Select
          name="mode"
          defaultValue={state.mode}
          onValueChange={(val) => setMode(val as any)}
        >
          <SelectTrigger
            className="flex h-full w-[90px] cursor-pointer items-center justify-between border-none px-3 py-2 text-base font-medium text-slate-600 shadow-none outline-none hover:text-green-600 focus-visible:ring-0"
            aria-label="검색 기준 선택"
          >
            <SelectValue placeholder="제목" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">제목</SelectItem>
            <SelectItem value="isbn">ISBN</SelectItem>
          </SelectContent>
        </Select>
        <div className="mx-1 h-5 w-[1px] bg-slate-200" />
        <Input
          type="search"
          name="query"
          defaultValue={state.query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            mode == "title" ? "도서명을 입력하세요" : "ISBN을 입력하세요."
          }
          className="flex-1 border-none bg-transparent px-4 py-2 text-base text-slate-800 shadow-none outline-none placeholder:text-xs placeholder:text-slate-400 focus:ring-0 focus-visible:ring-0 sm:placeholder:text-base"
        />
        <Button
          disabled={isPending}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-green-500 text-white shadow-md transition-transform hover:scale-105 hover:bg-green-600 hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          type="submit"
          variant={"outline"}
          aria-label="검색"
          data-testid="submit-button"
        >
          <SearchIcon className="h-5 w-5" strokeWidth={2.5} />
        </Button>
      </Form>
      <div
        className="h-5 pt-2 text-left text-sm text-red-500"
        aria-live="assertive"
      >
        {state.error ? <p>{state.error}</p> : " "}
      </div>
    </div>
  );
}
