import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function Item({ t }: { t: Task }) {
  async function deleteTask() {
    try {
      let res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/task/${t.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );
      let data = await res.json();
      console.log(data);
    } catch (e) {
      console.error(e);
    }
  }
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["AllTasks"] });
    },
  });
  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <b>ID: {t.id}</b>
        <button className="btn-danger" onClick={() => mutation.mutate()}>
          ลบ
        </button>
      </div>
      <p>งาน: {t.title}</p>
      {t.gps && (
        <a
          href={`https://www.google.com/maps?q=${t.gps}`}
          target="_blank"
          style={{ fontSize: "11px", color: "blue" }}
        >
          📍 ดูในแผนที่
        </a>
      )}
      {t.imageName ? (
        <>
          <br />
          <img
            src={`${import.meta.env.VITE_API_URL}/api/picture/${t.imageName}`}
            alt="task"
            style={{ maxWidth: "100%", marginTop: "5px", maxHeight: "300px" }}
          />
          <a
            href={`${import.meta.env.VITE_API_URL}/api/picture/${t.imageName}`}
            target="_blank"
            style={{ fontSize: "11px", color: "blue" }}
          >
            📷 ดูภาพประกอบ
          </a>
        </>
      ) : null}
      <small>
        ผู้รับผิดชอบ: {t.workerName || "ยังไม่ระบุ"} | สถานะ: {t.status}
      </small>
    </div>
  );
}
