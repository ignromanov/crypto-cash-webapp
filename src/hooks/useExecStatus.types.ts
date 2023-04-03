interface ExecStatus {
  pending: boolean;
  success: boolean | null;
  message: string;
}

type UpdateExecStatus = (status: Partial<ExecStatus>) => void;
type ClearExecStatus = () => void;

export type { ExecStatus, UpdateExecStatus, ClearExecStatus };
