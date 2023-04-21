interface ExecStatus {
  pending: boolean;
  success: boolean | null;
  message: string | JSX.Element;
}

type UpdateExecStatus = (status: Partial<ExecStatus>) => void;
type ClearExecStatus = () => void;

export type { ExecStatus, UpdateExecStatus, ClearExecStatus };
