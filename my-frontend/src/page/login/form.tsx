"use client";
import NT_LOGO from "./NT_3_v3.jpg";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authClient } from "../../lib/auth";
export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useNavigate();
  const { data: session, isPending } = authClient.useSession();
  useEffect(() => {
    console.log(import.meta.env.VITE_API_URL);
    // ถ้าโหลดเสร็จแล้ว (isPending เป็น false) และไม่มีข้อมูล session
    if (!isPending && session) {
      if (session.user.approve === false) {
        router("/guest");
        return;
      }
      router("/Admin");
    }
  }, [session, isPending, router]);
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    await authClient.signIn.email({
      callbackURL: "/Admin",
      email,
      password,
      // ตัวเลือกเสริม: ให้จำการ Login ไว้ (Persistent Session)
      rememberMe: true,
      fetchOptions: {
        onRequest: () => {
          setLoading(true);
          setError(null);
        },
        onError: (ctx) => {
          setLoading(false);
          // Better Auth จะส่ง Error Message ที่เข้าใจง่ายมาให้
          setError(ctx.error.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        },
        onSuccess: () => {
          setLoading(false);
          // เมื่อ Login สำเร็จ ให้ไปที่หน้า Dashboard หรือ Home
        },
      },
    });
  };
  return (
    <div id="login-page" className="page1 active-page">
      <form className="login-screen" onSubmit={handleSignIn}>
        <img
          src={NT_LOGO}
          className="main-logo"
          alt="NT Logo"
          width={140}
          height={60}
        ></img>
        <h2 className="title">ระบบจัดการงานนอกพื้นที่</h2>
        <div className="input-group">
          <input
            type="text"
            id="login-username"
            placeholder="ชื่อผู้ใช้งาน"
            name="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            id="login-password"
            placeholder="รหัสผ่าน"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>{" "}
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
        <button className="btn-primary" type="submit" disabled={loading}>
          เข้าสู่ระบบ
        </button>
        <p className="switch-text">
          ยังไม่มีบัญชี? <Link to="signup">สมัครสมาชิก</Link>
        </p>
      </form>
    </div>
  );
}
