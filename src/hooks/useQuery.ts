import { useLocation, useHistory } from "react-router-dom";
import { useCallback } from "react";

/**
 * 获取 URL 查询参数
 * 例如 regexp?source=abc&flags=g 返回查询参数 {source: "abc", flags: "g"}
 */
export const useQuery = () => {
  const {pathname, search} = useLocation();
  const history = useHistory();
  const searchParams = new URLSearchParams(search);
  const query: Record<string, string> = {}
  for(let [key, value] of searchParams) {
    query[key] = value
  }
  const setQuery = useCallback(
    (query: Record<string, string>) => {
      const search = new URLSearchParams(query).toString();
      history.replace({ pathname, search });
    },
    [history, pathname]
  );

  return [query, setQuery] as const;
};