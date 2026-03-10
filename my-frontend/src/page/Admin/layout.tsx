import { Link, Outlet, useNavigate } from "react-router-dom";
import { authClient } from "../../lib/auth";
import { useEffect } from "react";
import { useAuthStore } from "../../lib/store/useAuthStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const queryClient = new QueryClient();
export default function AdminLayout() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  // ดึงข้อมูล session และสถานะการโหลด
  let user = useAuthStore((state) => state.user);
  const { data: session, isPending, error } = authClient.useSession();
  useEffect(() => {
    // ถ้าโหลดเสร็จแล้ว (isPending เป็น false) และไม่มีข้อมูล session
    if (!isPending && !session) {
      window.location.replace("/");
    } else {
      if (session != null) {
        if (session.user.approve === false) {
          navigate("/guest");
          return;
        }
        const mappedUser: User = {
          id: session.user.id,
          name: session.user.name ?? "",
          email: session.user.email ?? "",
          // สมมติว่าใน Better Auth เก็บค่าเหล่านี้ไว้ใน schema ปกติ
          // ถ้า TypeScript ฟ้องว่าไม่มี field นี้ ให้ใช้ as any ก่อน หรือขยาย schema ใน auth-client
          approve: (session.user as any).approve ?? false,
          role: (session.user as any).role === "admin" ? "admin" : "worker",
        };

        setSession(mappedUser, isPending, error);
        // console.log(session?.user);
      } else {
        setSession(null, false, error);
      }
    }
  }, [session, isPending, navigate, setSession]);
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

  return (
    <QueryClientProvider client={queryClient}>
      <section>
        <Outlet />{" "}
        <nav className="bottom-nav" id="main-nav">
          <Link to="/Admin/service" className="nav-item active" id="nav-home">
            <span>🏠</span>
            <p>งานฉัน</p>
          </Link>
          {session?.user.role == "worker" && (
            <>
              <Link to="/Admin/job" className="nav-item" id="nav-inbox">
                <span>
                  📥
                  <b id="badge-count" className="badge">
                    0
                  </b>
                </span>
                <p>รับงาน</p>
              </Link>
              <Link to="/Admin/history" className="nav-item" id="nav-history">
                <span>📜</span>
                <p>ประวัติ</p>
              </Link>
            </>
          )}{" "}
          <Link to="/Admin" className="nav-item" id="nav-admin">
            <span>⚙️</span>
            <p>จัดการ</p>
          </Link>
          <div className="nav-item" onClick={handleSignOut}>
            <span>🚪</span>
            <p>ออกจากระบบ</p>
          </div>
        </nav>
      </section>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
