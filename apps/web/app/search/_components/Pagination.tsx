import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@repo/ui/components/pagination";
import {
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@repo/ui/components/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  createPageUrl: (page: number) => string;
}

export default function PaginationWithIcon({
  totalPages,
  currentPage,
  createPageUrl,
}: PaginationProps) {
  // 표시할 페이지 번호들을 계산하는 함수
  const getVisiblePages = () => {
    const pageCount = 8;
    // 1. 전체 페이지가 pageCount 이하일 경우, 모든 페이지 번호를 보여줌
    if (totalPages <= pageCount) {
      // Array.from()을 사용하여 1부터 totalPages까지의 배열 생성
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let startPage = currentPage - Math.floor(pageCount / 2);
    let endPage = currentPage + Math.floor(pageCount / 2) - 1;

    if (startPage < 1) {
      startPage = 1;
      endPage = pageCount;
    }

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = totalPages - pageCount + 1;
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <Pagination className="my-5">
      <PaginationContent>
        {/* 첫 페이지로 이동 버튼 */}
        <PaginationItem>
          <Link
            href={createPageUrl(1)}
            aria-label="Go to first page"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              currentPage === 1
                ? "text-muted-foreground pointer-events-none"
                : undefined,
            )}
            aria-disabled={currentPage === 1}
            tabIndex={currentPage === 1 ? -1 : undefined}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Link>
        </PaginationItem>
        {/* 이전 페이지 버튼 */}
        <PaginationItem>
          <Link
            href={createPageUrl(currentPage > 1 ? currentPage - 1 : 1)}
            aria-label="Go to previous page"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              currentPage === 1
                ? "text-muted-foreground pointer-events-none"
                : undefined,
            )}
            aria-disabled={currentPage === 1}
            tabIndex={currentPage === 1 ? -1 : undefined}
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </PaginationItem>

        {/* 계산된 페이지 번호들만 렌더링 */}
        {visiblePages.map((page) => (
          <PaginationItem key={page}>
            <Link
              href={createPageUrl(page)}
              className={cn(
                buttonVariants({
                  variant: currentPage === page ? "outline" : "ghost",
                  size: "icon",
                }),
              )}
            >
              {page}
            </Link>
          </PaginationItem>
        ))}

        {/* 다음 페이지 버튼 */}
        <PaginationItem>
          <Link
            href={createPageUrl(
              currentPage < totalPages ? currentPage + 1 : totalPages,
            )}
            aria-label="Go to next page"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              currentPage === totalPages
                ? "text-muted-foreground pointer-events-none"
                : undefined,
            )}
            aria-disabled={currentPage === totalPages}
            tabIndex={currentPage === totalPages ? -1 : undefined}
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        </PaginationItem>
        {/* 마지막 페이지로 이동 버튼 */}
        <PaginationItem>
          <Link
            href={createPageUrl(totalPages)}
            aria-label="Go to last page"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              currentPage === totalPages
                ? "text-muted-foreground pointer-events-none"
                : undefined,
            )}
            aria-disabled={currentPage === totalPages}
            tabIndex={currentPage === totalPages ? -1 : undefined}
          >
            <ChevronsRight className="h-4 w-4" />
          </Link>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
