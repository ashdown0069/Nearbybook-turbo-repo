import {
  useQueries,
  UseQueryResult,
  useQuery,
  keepPreviousData,
} from "@tanstack/react-query";
import type { AxiosInstance } from "axios";
import type { Library } from "@repo/types";
export const getLibsList = async (
  axiosInstance: AxiosInstance,
  region: string,
  dtlRegion?: string
): Promise<Library[]> => {
  return axiosInstance
    .get("/libraries/searchbyregion", {
      params: {
        region,
        dtlRegion,
      },
    })
    .then((res) => res.data);
};
//for native
export const useGetRegionLibsList = (
  axiosInstance: AxiosInstance,
  region: string,
  dtlRegion: string
) => {
  return useQuery({
    queryKey: ["useGetRegionLibsList", region, dtlRegion],
    queryFn: () => getLibsList(axiosInstance, region, dtlRegion),
    enabled: !!region && !!dtlRegion,
    placeholderData: keepPreviousData,
  });
};

export const useGetLibsList = (
  axiosInstance: AxiosInstance,
  selectedRegions: string[]
) => {
  return useQueries({
    queries: selectedRegions.map((region) => ({
      queryKey: ["libsList", region],
      queryFn: () => getLibsList(axiosInstance, region),
      enabled: region.length > 0,
    })),

    // combine 옵션을 사용하여 배열을 객체로 변환
    combine: (results) => {
      return results.reduce(
        (acc, result, index) => {
          const regionKey = selectedRegions[index];
          acc[regionKey] = result;
          return acc;
        },
        {} as Record<string, UseQueryResult<Library[], Error>>
      );
    },
  });
};
