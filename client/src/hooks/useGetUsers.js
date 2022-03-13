import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../AuthProvider";
import { fetchApi } from "../utils/api";

export function useGetUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  const getUsers = useCallback(async () => {
    const genderInterest = user.gender_interest;
    const path = `/users?gender=${genderInterest}`;
    const res = await fetchApi(path);
    const data = await res.json();
    setUsers(data);
  }, [user]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return { users, getUsers };
}
