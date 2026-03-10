import { useQuery } from "@tanstack/react-query";
import WorkerTask from "./workerTask";
import { useAuthStore } from "../../../../lib/store/useAuthStore";

export default function MyWorkTaskPage() {
  async function fetchMyClaimedTask() {
    try {
      let res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/task/claimed`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );
      let data = await res.json();
      console.log(data);
      return data;
    } catch (e) {
      console.log(e);
      return [];
    }
  }
  let user = useAuthStore((state) => state.user);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["claimedTasks"],
    queryFn: fetchMyClaimedTask,
  });
  if (user?.role == "admin") return <></>;
  if (isLoading) return <p className=" text-center">กำลังโหลด...</p>;

  if (isError)
    return <p className=" text-center">เกิดข้อผิดพลาด: {error?.message}</p>;

  if (typeof data === "object" && data.length === 0) {
    return <p className=" text-center">ไม่มีงาน</p>;
  }
  return data.map((task: Task) => <WorkerTask key={task.id} t={task} />);
}
