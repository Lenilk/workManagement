interface NotApprovedUserPageProps {
  // รับ userId เป็น string และไม่คืนค่าอะไรกลับมา (void)
  notapprovedusers: User[];
  handleApprove: (user: User) => Promise<void>;
}
export default function NotApprovedUserPage({
  notapprovedusers,
  handleApprove,
}: NotApprovedUserPageProps) {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h4 className="text-2xl font-bold mb-6">
        ผู้ใช้ที่สมัครเข้ามา แต่ยังไม่ได้รับการอนุมัติ
      </h4>

      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 border-b">ชื่อ</th>
              <th className="p-4 border-b">อีเมล</th>
              <th className="p-4 border-b">ตำแหน่ง</th>
              <th className="p-4 border-b text-right">อนุมัติ</th>
            </tr>
          </thead>
          <tbody>
            {notapprovedusers.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-500">
                  No pending users found.
                </td>
              </tr>
            ) : (
              notapprovedusers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 border-b font-medium">{user.name}</td>
                  <td className="p-4 border-b text-gray-600">{user.email}</td>
                  <td className="p-4 border-b text-gray-600">{user.role}</td>
                  <td className="p-4 border-b text-right">
                    <button
                      onClick={() => handleApprove(user)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors"
                    >
                      อนุมัติ
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
