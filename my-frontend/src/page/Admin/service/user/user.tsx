import { useEffect, useRef, useState } from "react";
import ApprovedUserPage from "./approve/approved";
import NotApprovedUserPage from "./approve/noapprove";
import { useAuthStore } from "../../../../lib/store/useAuthStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const baseapi = import.meta.env.VITE_API_URL;
  const hasFetched = useRef(false);
  const isAdmin = useAuthStore((state) => state.isAdmin);
  // 1. ดึงข้อมูล User ที่ยังไม่ได้รับการ Approve
  // useEffect(() => {
  //   if (!hasFetched.current) {
  //     hasFetched.current = true;
  //     fetchUsers();
  //   }
  // }, []);

  const approvedUser = users.filter((e) => e.approve === true);
  const notApprovedUser = users.filter(
    (e) => e.approve === false || e.approve === null,
  );
  const fetchUsers = async () => {
    try {
      // ดึงข้อมูลจาก API ของคุณ (ที่ Query เฉพาะ approve == false หรือ null)
      const response = await fetch(`${baseapi}/api/user`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = await response.json();
      setUsers(res);
      return res;
    } catch (error) {
      console.error("Failed to fetch users", error);
      return [];
    } finally {
      setLoading(false);
    }
  };
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["AllUser"],
    queryFn: fetchUsers,
  });
  useEffect(() => console.log(data), [data]);
  const updateRole = async (user: User) => {
    try {
      const newStatus: "admin" | "worker" =
        user.role == "admin" ? "worker" : "admin";
      const response = await fetch(`${baseapi}/api/user/role`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          role: newStatus,
        }),
      });

      if (response.ok) {
        // อัปเดต UI โดยลบ user ที่ approve แล้วออกจาก list
        setUsers((prevUsers) => {
          const updatedUsers = prevUsers.map((u) => {
            if (u.id === user.id) {
              return { ...u, role: newStatus }; // กระจายค่าเดิมและทับด้วยค่าใหม่
            }
            return u;
          });
          return [...updatedUsers]; // คืนค่าเป็น Array ชุดใหม่เพื่อให้ React รู้ว่าต้อง Render
        });
        alert("อัพเดตเสร็จสิ้น");
      }
    } catch (error) {
      alert("มีข้อผิดพลาด");
    }
  };
  // 2. ฟังก์ชันสำหรับกด Approve
  const handleApprove = async (user: User) => {
    try {
      const newStatus = !user.approve;
      const response = await fetch(`${baseapi}/api/user/approve`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, approve: !user.approve }),
      });

      if (response.ok) {
        // อัปเดต UI โดยลบ user ที่ approve แล้วออกจาก list
        setUsers((prevUsers) => {
          const updatedUsers = prevUsers.map((u) => {
            if (u.id === user.id) {
              return { ...u, approve: newStatus }; // กระจายค่าเดิมและทับด้วยค่าใหม่
            }
            return u;
          });
          return [...updatedUsers]; // คืนค่าเป็น Array ชุดใหม่เพื่อให้ React รู้ว่าต้อง Render
        });
        alert("อัพเดตเสร็จสิ้น");
      }
    } catch (error) {
      alert("มีข้อผิดพลาด");
    }
  };
  const queryClient = useQueryClient();
  const handleApproveMutation = useMutation({
    mutationFn: handleApprove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["AllUser"] });
    },
  });
  const updateRoleMutation = useMutation({
    mutationFn: updateRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["AllUser"] });
    },
  });
  if (!isAdmin()) return <></>;
  if (isLoading) return <p className="p-8">กำลังโหลด...</p>;

  return (
    <div className="flex flex-col w-full items-center justify-center p-4 mt-32">
      {/* 2. สร้าง Wrapper ที่คุมความกว้างให้ทั้ง 2 ตารางเท่ากันเสมอ */}
      <div className="w-full max-w-4xl space-y-8">
        <div className="w-full overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <ApprovedUserPage
            approvedusers={approvedUser}
            handleApprove={async (user) => handleApproveMutation.mutate(user)}
            updateRole={async (user) => updateRoleMutation.mutate(user)}
          />
        </div>

        <div className="w-full overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <NotApprovedUserPage
            notapprovedusers={notApprovedUser}
            handleApprove={handleApprove}
          />
        </div>
      </div>
    </div>
  );
}
