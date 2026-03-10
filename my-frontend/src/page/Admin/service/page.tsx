import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../../../lib/store/useAuthStore";
import WorkerTask from "./Task/workerTask";
import UserPage from "./user/user";
import MyWorkTaskPage from "./Task/page";
export default function ServicePage() {
  // ดึงข้อมูล session และสถานะการโหลด
  const user = useAuthStore((state) => state.user);

  return (
    <div id="service-page">
      <div className="header">
        <h2 id="user-display">พนักงาน: {user?.name}</h2>
        <p id="role-display">สิทธิ์: {user?.role ?? "Null"}</p>
      </div>
      <UserPage />
      <MyWorkTaskPage />
      <div id="active-task-container"></div>
    </div>
  );
}
