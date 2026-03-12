import { useQuery } from "@tanstack/react-query";
import History from "./history";
export default function HistoryPage() {
  async function fetchHistoryData() {
    try {
      let res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/task/finished`,
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
    } catch (error) {
      console.error("Error fetching history data:", error);
      throw error;
    }
  }
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["historyData"],
    queryFn: fetchHistoryData,
  });
  function exportToCSV() {
    if (data.length === 0) return alert("ไม่มีข้อมูลงานให้ดาวน์โหลด");

    let csv =
      "\ufeffID,หัวข้อ,รายละเอียด,สถานที่,ช่าง,สถานะ,ผลลัพธ์,พิกัด,เวลาปิดงาน\n";
    data.forEach((t: Task) => {
      csv += `${t.id},${t.title},${t.detail},${t.loc},${t.workerName},${t.status},${t.workResult || "-"},${t.gps || "-"},${t.completedAt || "-"}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute(
      "download",
      `NT_Report_${new Date().toLocaleDateString()}.csv`,
    );
    link.click();
  }
  if (isLoading) return <p>กำลังโหลด...</p>;
  if (isError) return <p>เกิดข้อผิดพลาด: {error.message}</p>;
  return (
    <div id="history-page">
      <div className="header" style={{ background: "#6c757d", color: "white" }}>
        <h2>ประวัติงาน</h2>
      </div>
      <div className="card">
        <button
          onClick={() => exportToCSV()}
          className="btn-primary"
          style={{ background: "#28a745", color: "white" }}
        >
          📥 ดาวน์โหลดรายงาน (CSV)
        </button>
        <div id="history-list">
          {data?.map((t: Task) => (
            <History key={t.id} t={t} />
          ))}
        </div>
      </div>
    </div>
  );
}
