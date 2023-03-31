import { useCallback, useState } from "react";
import { ApiStatus } from "./useApiStatus.types";

const useApiStatus = (): [
  ApiStatus,
  (status: ApiStatus) => void,
  () => void
] => {
  const [apiStatus, setApiStatus] = useState<ApiStatus>({
    pending: false,
    success: null,
    message: "",
  });

  const updateApiStatus = useCallback((status: ApiStatus) => {
    setApiStatus(status);
  }, []);

  const clearApiStatus = useCallback(() => {
    setApiStatus({ pending: false, success: null, message: "" });
  }, []);

  return [apiStatus, updateApiStatus, clearApiStatus];
};

export default useApiStatus;
