export default function History({ t }: { t: Task }) {
  return (
    <div
      className="card"
      style={{
        borderLeft: `5px solid ${t.status === "completed" ? "#28a745" : "#dc3545"}`,
      }}
    >
      <b>{t.title}</b>
      <p style={{ fontSize: "12px", margin: "5px 0" }}>
        ผล: {t.status === "completed" ? "สำเร็จ" : "ไม่สำเร็จ"} - {t.workResult}
      </p>
      <small style={{ color: "#888" }}>
        เสร็จเมื่อ:{" "}
        {t.completedAt ? new Date(t.completedAt).toLocaleString() : "-"}
      </small>
      {t.gps ? <br /> : null}
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
    </div>
  );
}
