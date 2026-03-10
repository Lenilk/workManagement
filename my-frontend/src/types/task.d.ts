//         csv += `${t.id},${t.title},${t.detail},${t.loc},${t.workerName},${t.status},${t.workResult || '-'},${t.gps || '-'},${t.completedAt || '-'}\n`;
interface Task {
  id: number;
  title: string;
  detail: string;
  loc: string | null;
  workerId: string | null;
  workerName: string | null;
  status: "pending" | "claimed" | "completed" | "failed";
  workResult: string | null;
  gps: string | null;
  completedAt: Date | null;
  createdAt: Date;
  deadlineAt: Date;
  imageName: string | null;
}
