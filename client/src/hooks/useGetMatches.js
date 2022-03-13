import { useEffect, useState, useCallback } from "react";
import { fetchApi } from "../utils/api";

export function useGetMatches() {
  const [matches, setMatches] = useState([]);

  const getMatches = useCallback(async () => {
    const res = await fetchApi(`/matches`);
    const data = await res.json();
    setMatches(data);
  }, []);

  useEffect(() => {
    getMatches();
  }, [getMatches]);

  return { matches, getMatches };
}
