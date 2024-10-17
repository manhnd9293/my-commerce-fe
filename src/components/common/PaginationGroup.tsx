import { PageData } from "@/dto/page-data/page-data.ts";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination.tsx";

export function PaginationGroup<T>(props: {
  currentPage: number | undefined | null;
  onChangePage: (changeValue: number) => void;
  pageData: PageData<T> | undefined;
}) {
  const { onChangePage, currentPage, pageData } = props;

  return (
    <Pagination>
      <PaginationContent>
        {currentPage !== 1 && (
          <PaginationItem
            onClick={() => onChangePage(-1)}
            className={"cursor-pointer"}
          >
            <PaginationPrevious />
          </PaginationItem>
        )}
        {currentPage && currentPage - 2 > 0 && (
          <PaginationItem
            onClick={() => onChangePage(-2)}
            className={"cursor-pointer"}
          >
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {currentPage && currentPage - 1 > 0 && (
          <PaginationItem
            onClick={() => onChangePage(-1)}
            className={"cursor-pointer"}
          >
            <PaginationLink>{currentPage - 1}</PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem className={"cursor-pointer"}>
          <PaginationLink isActive>{currentPage}</PaginationLink>
        </PaginationItem>
        {currentPage && pageData && currentPage + 1 <= pageData.totalPage && (
          <PaginationItem
            className={"cursor-pointer"}
            onClick={() => onChangePage(1)}
          >
            <PaginationLink>{currentPage + 1}</PaginationLink>
          </PaginationItem>
        )}
        {currentPage && pageData && currentPage + 2 <= pageData.totalPage && (
          <PaginationItem
            className={"cursor-pointer"}
            onClick={() => onChangePage(2)}
          >
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {currentPage !== pageData?.totalPage && (
          <PaginationItem
            className={"cursor-pointer"}
            onClick={() => onChangePage(1)}
          >
            <PaginationNext />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
