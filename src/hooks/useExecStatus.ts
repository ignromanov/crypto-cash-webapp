import { useCallback, useReducer } from "react";
import {
  ClearExecStatus,
  ExecStatus,
  UpdateExecStatus,
} from "./useExecStatus.types";

const execStatusReducer = (
  prevExecStatus: ExecStatus,
  updatedExecStatus: Partial<ExecStatus>
): ExecStatus => {
  return { ...prevExecStatus, ...updatedExecStatus };
};

const execStatusInitial: ExecStatus = {
  pending: false,
  success: null,
  message: "",
};

const useExecStatus = (): [ExecStatus, UpdateExecStatus, ClearExecStatus] => {
  const [execStatus, dispatch] = useReducer(
    execStatusReducer,
    execStatusInitial
  );

  const updateExecStatus = useCallback(
    (status: Partial<ExecStatus>) => {
      dispatch(status);
    },
    [dispatch]
  );

  const clearExecStatus = useCallback(() => {
    dispatch(execStatusInitial);
  }, [dispatch]);

  return [execStatus, updateExecStatus, clearExecStatus];
};

export default useExecStatus;
