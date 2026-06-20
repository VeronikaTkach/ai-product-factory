import { useEffect, useState } from "react";

import { fetchUser, type TUser } from "./api-example";

type TLoadState =
  | { status: "idle" | "loading"; user: null; errorMessage: null }
  | { status: "success"; user: TUser; errorMessage: null }
  | { status: "error"; user: null; errorMessage: string };

export function useUser(userId: string): TLoadState {
  const [state, setState] = useState<TLoadState>({
    status: "idle",
    user: null,
    errorMessage: null,
  });

  useEffect(() => {
    let isActive = true;

    setState({ status: "loading", user: null, errorMessage: null });

    fetchUser(userId)
      .then((user) => {
        if (isActive) {
          setState({ status: "success", user, errorMessage: null });
        }
      })
      .catch((error) => {
        if (isActive) {
          setState({
            status: "error",
            user: null,
            errorMessage: error instanceof Error ? error.message : "Failed to load user",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [userId]);

  return state;
}
