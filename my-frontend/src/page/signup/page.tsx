import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authClient } from "../../lib/auth";

export default function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session, isPending } = authClient.useSession();
  const [role, setRole] = useState("worker");
  useEffect(() => {
    // ถ้าโหลดเสร็จแล้ว (isPending เป็น false) และไม่มีข้อมูล session
    if (!isPending && session) {
      if (session.user.approve === false) {
        navigate("/guest");
        return;
      }
      navigate("/Admin");
    }
  }, [session, isPending, navigate]);
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    await authClient.signUp.email({
      email,
      password,
      name,
      role,
      fetchOptions: {
        onRequest: () => {
          setLoading(true);
          setError(null);
        },
        onError: (ctx) => {
          setLoading(false);
          setError(ctx.error.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
        },
        onSuccess: () => {
          setLoading(false);
          navigate("/Admin");
        },
      },
    });
  };
  return (
    <div id="register-page" className="page1">
      <div className="login-screen">
        <h2 className="title">ลงทะเบียนพนักงาน</h2>

        <form onSubmit={handleSignUp}>
          <div className="input-group">
            <input
              id="reg-email"
              name="email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="text"
              id="reg-username"
              name="username"
              placeholder="ตั้งชื่อผู้ใช้งาน"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="password"
              id="reg-password"
              name="password"
              placeholder="ตั้งรหัสผ่าน"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <select
              id="reg-role"
              name="role"
              className="select-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="worker">ช่างภาคสนาม (Worker)</option>
              <option value="admin">ผู้ดูแลระบบ (Admin)</option>
            </select>
          </div>
          {error && (
            <div
              style={{
                backgroundColor: "#fff5f5",
                color: "#c53030",
                padding: "0.5rem",
                borderRadius: "4px",
                marginBottom: "1rem",
                fontSize: "0.85rem",
                border: "1px solid #feb2b2",
              }}
            >
              {error}
            </div>
          )}
          <button type="submit" className="btn-primary" disabled={loading}>
            ยืนยันการสมัคร
          </button>
          <p className="switch-text">
            <Link to="/">ย้อนกลับ</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
