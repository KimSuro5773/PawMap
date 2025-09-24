import { useQuery } from "@tanstack/react-query";
import { getStaticMapUrl } from "../services/mapApi";

export const useStaticMap = (params, options = {}) => {
  return useQuery({
    queryKey: ["staticMap", params],
    queryFn: () => getStaticMapUrl(params),
    enabled: !!(params?.center?.lng && params?.center?.lat),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    ...options,
  });
};
