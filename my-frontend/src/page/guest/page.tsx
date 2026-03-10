import { Link, useNavigate } from "react-router-dom";
import { authClient } from "../../lib/auth";
import { useEffect } from "react";

export default function GuestPage() {
  const navigate = useNavigate();
  // ดึงข้อมูล session และสถานะการโหลด
  const { data: session, isPending, error } = authClient.useSession();
  useEffect(() => {
    // ถ้าโหลดเสร็จแล้ว (isPending เป็น false) และไม่มีข้อมูล session
    if (!isPending && !session) {
      window.location.replace("/");
    } else {
      if (session != null) {
        if (session.user.approve === true) {
          navigate("/Admin");
          return;
        }
        // console.log(session?.user);
      } else {
        // ถ้าไม่มี session ให้กลับไปหน้า Sign in
        navigate("/");
      }
    }
  }, [session, isPending, navigate]);
  return (
    <div id="guest-page" className="page1 login-screen">
      <h2>ยินดีต้อนรับสู่ระบบจัดการงาน</h2>
      <p>คุณกำลังเข้าสู่โหมดผู้เยี่ยมชม</p>
      <p>กรุณาติดต่อผู้ดูแลระบบเพื่อขอสิทธิ์การเข้าถึงเพิ่มเติม</p>
      <button className="btn-primary" onClick={() => authClient.signOut()}>
        ออกจากระบบ
      </button>
    </div>
  );
}
