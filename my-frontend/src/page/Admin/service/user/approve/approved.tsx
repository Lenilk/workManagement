import { useState } from "react";
interface ApprovedUserPageProps {
  // รับ userId เป็น string และไม่คืนค่าอะไรกลับมา (void)
  approvedusers: User[];
  handleApprove: (user: User) => Promise<void>;
  updateRole: (user: User) => Promise<void>;
}
export default function ApprovedUserPage({
  approvedusers,
  handleApprove,
  updateRole,
}: ApprovedUserPageProps) {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h4 className="text-2xl font-bold mb-6">
        {" "}
        ผู้ใช้ที่ได้รับการอนุมัติแล้ว
      </h4>

      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 border-b">ชื่อ</th>
              <th className="p-4 border-b hidden sm:table-cell">อีเมล</th>
              <th className="p-4 border-b">ตำแหน่ง</th>
              <th className="p-4 border-b ">บันทึก</th>
              <th className="p-4 border-b text-right">อนุมัติ</th>
            </tr>
          </thead>
          <tbody>
            {approvedusers.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-500">
                  No pending users found.
                </td>
              </tr>
            ) : (
              approvedusers.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  onApprove={handleApprove}
                  updateRole={updateRole}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
const UserRow = ({
  user,
  onApprove,
  updateRole,
}: {
  user: User;
  onApprove: Function;
  updateRole: Function;
}) => {
  // ✅ ประกาศ useState ไว้ที่ระดับบนสุดของ Component ย่อย (ถูกต้องตามกฎ)
  const [role, setRole] = useState<string>(user.role ?? "worker");

  return (
    <tr
      key={user.id}
      className="group hover:bg-slate-50 transition-all duration-200"
    >
      {/* ข้อมูลผู้ใช้ - เน้นชื่อให้เด่น */}
      <td className="p-4 border-b">
        <div className="flex flex-col">
          <span className="font-semibold text-slate-700">{user.name}</span>
          <span className="text-xs text-slate-400 sm:hidden">{user.email}</span>
        </div>
      </td>

      <td className="p-4 border-b text-slate-600 hidden sm:table-cell">
        {user.email}
      </td>

      {/* ส่วนจัดการตำแหน่ง - ปรับ Select ให้ดู Clean */}
      <td className="p-4 border-b">
        <select
          id={`reg-role-${user.id}`}
          name="role"
          className="block w-full px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer shadow-sm text-slate-700"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="worker">ช่างภาคสนาม (Worker)</option>
          <option value="admin">ผู้ดูแลระบบ (Admin)</option>
        </select>
      </td>

      {/* ปุ่ม Actions - แยกสีให้ชัดเจน */}
      <td className="p-4 border-b text-center">
        <button
          onClick={() =>
            role != user.role ? updateRole(user) : alert("ไม่มีอัพเดต")
          }
          className="inline-flex items-center px-4 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-sm font-medium transition-all duration-200 border border-blue-100 shadow-sm"
        >
          อัปเดต
        </button>
      </td>

      <td className="p-4 border-b text-right">
        <button
          onClick={() => onApprove(user)}
          className="inline-flex items-center px-4 py-1.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg text-sm font-medium transition-all duration-200 border border-red-100 shadow-sm"
        >
          ไม่อนุมัติ
        </button>
      </td>
    </tr>
  );
};
