import { useQuery } from "@tanstack/react-query";
import Item from "./item";

export default function ItemList() {
  async function fetchMyPendingTask() {
    try {
      let res = await fetch(`${import.meta.env.VITE_API_URL}/api/task`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      let data = await res.json();
      console.log(data);
      return data;
      // setTask(data);
    } catch (e) {
      console.error(e);
      return [];
    }
  }
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["AllTasks"],
    queryFn: fetchMyPendingTask,
  });
  if (isLoading) return <p>กำลังโหลด...</p>;
  if (isError) return <p>เกิดข้อผิดพลาด: {error.message}</p>;
  return (
    <div className="card">
      <h3>📊 รายการงานทั้งหมด</h3>
      <div id="admin-task-list">
        {data?.map((t: any) => (
          <Item key={t.id} t={t} />
        ))}
      </div>
    </div>
  );
}
