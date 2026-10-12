import { useCallback, useEffect, useState } from "react";
import { BookListResult, BookQuery } from "../types/books";
import { fetchBooks } from "../api/books";

type FetchState = {
  key: string;
  data: BookListResult | null;
  error: Error | null;
};

const INITIAL_STATE: FetchState = { key: "", data: null, error: null };

export function useBooks({ keyword, type, page, pageSize }: BookQuery) {
  const [reloadCount, setReloadCount] = useState<number>(0);
  const [state, setState] = useState<FetchState>(INITIAL_STATE);

  const requestKey = `${keyword}|${type}|${page}|${pageSize}|${reloadCount}`;

  useEffect(() => {
    let isCancelled = false;

    fetchBooks({ keyword, type, page, pageSize })
      .then((data) => {
        if (!isCancelled) setState({ key: requestKey, data, error: null });
      })
      .catch((err: unknown) => {
        if (isCancelled) return;
        setState((prev) => ({
          key: requestKey,
          data: prev.data,
          error: err instanceof Error ? err : new Error("Unknown Error"),
        }));
      });
    return () => {
      isCancelled = true;
    };
  }, [keyword, type, page, pageSize, requestKey]);

  const refetch = useCallback(() => setReloadCount((count) => count + 1), []);

  return {
    books: state.data?.books ?? [],
    totalCount: state.data?.totalCount ?? 0,
    isLoading: state.key !== requestKey,
    error: state.key === requestKey ? state.error : null,
    refetch,
  };
}
