import { useQuery } from "@tanstack/react-query";
import { AxiosInstance } from "axios";

interface getBookLoanStatusResponse {
  hasBook: "N" | "Y";
  loanAvailable: "N" | "Y";
}

export const getBookLoanStatus = async (
  axiosInstance: AxiosInstance,
  isbn: string,
  libCode: string
): Promise<getBookLoanStatusResponse> => {
  return axiosInstance
    .get("/books/loanstatus", {
      params: {
        isbn,
        libCode,
      },
    })
    .then((res) => res.data);
};

export const useGetBookLoanStatus = (
  axiosInstance: AxiosInstance,
  isbn: string,
  libCode: string,
  hasBook: boolean
) => {
  return useQuery({
    queryKey: ["loan", isbn, libCode],
    queryFn: () => getBookLoanStatus(axiosInstance, isbn, libCode),
    enabled: !!isbn && !!libCode && hasBook === true,
  });
};
