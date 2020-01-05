import {useLocation} from 'react-router-dom'

export {default as useRegulex} from './useRegulex'

export const useQuery = () => {
  const usp = new URLSearchParams(useLocation().search)
  const query: Record<string, string> = {}
  for (let [key, value] of usp) {
    query[key] = value
  }
  return query
}