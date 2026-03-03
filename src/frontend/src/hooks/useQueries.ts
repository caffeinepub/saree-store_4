import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Category,
  PartialProduct,
  Product,
  UserProfile,
} from "../backend";
import { useActor } from "./useActor";

// Shared default options for all queries — cache data for 5 min, treat as fresh for 2 min
const QUERY_DEFAULTS = {
  staleTime: 2 * 60 * 1000, // 2 minutes
  gcTime: 5 * 60 * 1000, // 5 minutes
} as const;

export function useGetAllProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
    ...QUERY_DEFAULTS,
  });
}

export function useGetProduct(id: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<Product>({
    queryKey: ["product", id.toString()],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getProduct(id);
    },
    enabled: !!actor && !isFetching,
    ...QUERY_DEFAULTS,
  });
}

export function useGetProductsByCategory(category: Category) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", "category", category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProductsByCategory(category);
    },
    enabled: !!actor && !isFetching,
    ...QUERY_DEFAULTS,
  });
}

export function useGetNewArrivals() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", "newArrivals"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNewArrivals();
    },
    enabled: !!actor && !isFetching,
    ...QUERY_DEFAULTS,
  });
}

export function useGetOnOfferProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", "onOffer"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOnOfferProducts();
    },
    enabled: !!actor && !isFetching,
    ...QUERY_DEFAULTS,
  });
}

export function useSearchProducts(searchTerm: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", "search", searchTerm],
    queryFn: async () => {
      if (!actor || !searchTerm.trim()) return [];
      return actor.searchProducts(searchTerm);
    },
    enabled: !!actor && !isFetching && searchTerm.trim().length > 0,
    staleTime: 60 * 1000, // search results: 1 min
    gcTime: 5 * 60 * 1000,
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product: PartialProduct) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      product,
    }: { id: bigint; product: PartialProduct }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateProduct(id, product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
    ...QUERY_DEFAULTS,
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getCallerUserProfile();
      } catch {
        // Anonymous users will get an auth error from the backend — treat as no profile
        return null;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
    ...QUERY_DEFAULTS,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}
