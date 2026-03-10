import { useEffect } from "react";
import { authClient } from "../../lib/auth";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const navigate = useNavigate();

  // ดึงข้อมูล session และสถานะการโหลด
  const { data: session, isPending, error } = authClient.useSession();
  useEffect(() => {
    // ถ้าโหลดเสร็จแล้ว (isPending เป็น false) และไม่มีข้อมูล session
    if (!isPending && !session) {
      navigate("/");
    }
  }, [session, isPending, navigate]);
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          // เมื่อ Sign out สำเร็จ ให้กลับไปหน้า Sign in
          navigate("/");
        },
      },
    });
  };

  // 1. ระหว่างรอเช็ค Session
  if (isPending) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        Loading session...
      </div>
    );
  }

  // 2. ถ้าไม่ได้ Login (ไม่มี session)
  if (!session) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <p>คุณยังไม่ได้เข้าสู่ระบบ</p>
        <button onClick={() => navigate("/signin")}>ไปหน้า Sign In</button>
      </div>
    );
  }

  // 3. ถ้า Login แล้ว แสดงข้อมูล User
  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "2rem auto",
        padding: "1rem",
        fontFamily: "sans-serif",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #eee",
          paddingBottom: "1rem",
        }}
      >
        <h2>Dashboard</h2>
        <button
          onClick={handleSignOut}
          style={{
            backgroundColor: "#ff4d4f",
            color: "white",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Sign Out
        </button>
      </header>

      <main style={{ marginTop: "2rem" }}>
        <div
          style={{
            backgroundColor: "#f9f9f9",
            padding: "1.5rem",
            borderRadius: "8px",
            border: "1px solid #ddd",
          }}
        >
          <h3 style={{ marginTop: 0 }}>User Credentials</h3>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <p>
              <strong>ID:</strong>{" "}
              <code style={{ fontSize: "0.85rem" }}>{session.user.id}</code>
            </p>
            <p>
              <strong>Name:</strong> {session.user.name}
            </p>
            <p>
              <strong>Email:</strong> {session.user.email}
            </p>
            <p>
              <strong>Role:</strong> {session.user.role}
            </p>
            <p>
              <strong>Approve:</strong>{" "}
              {session.user.approve ? "✅ Yes" : "❌ No"}
            </p>
            <p>
              <strong>Verified:</strong>{" "}
              {session.user.emailVerified ? "✅ Yes" : "❌ No"}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(session.user.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div style={{ marginTop: "1rem", fontSize: "0.8rem", color: "#666" }}>
          <p>Session ID: {session.session.id}</p>
          <p>Expires: {new Date(session.session.expiresAt).toLocaleString()}</p>
        </div>
      </main>
    </div>
  );
};
