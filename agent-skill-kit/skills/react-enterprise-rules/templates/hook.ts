import { useCallback, useState } from "react";

type TRequestStatus = "idle" | "loading" | "success" | "error";

interface IUseActionResult {
  status: TRequestStatus;
  errorMessage: string | null;
  run: () => Promise<void>;
}

export function useAction(): IUseActionResult {
  const [status, setStatus] = useState<TRequestStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const run = useCallback(async () => {
    setStatus("loading");
    setErrorMessage(null);

    try {
      // Call a feature-level service or API function here.
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Unexpected error");
    }
  }, []);

  return { status, errorMessage, run };
}
