import { use, useEffect, useState } from "react";
import ItemList from "./itemlist";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../lib/store/useAuthStore";
import { useForm } from "react-hook-form";
interface IFormInput {
  title: string;
  detail: string;
  loc: string;
  workerName: string;
  deadline: string;
}
export default function AdminIndexPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>();
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [loc, setLoc] = useState("");
  const [workerName, setWorkerName] = useState("");
  const [workerId, setWorkerId] = useState("");
  const [deadline, setDeadline] = useState("");
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const user = useAuthStore((state) => state.user);
  async function createTask(form: IFormInput) {
    console.log({
      title: form.title,
      detail: form.detail,
      loc: form.loc,
      userId: user?.id,
      userName: user?.name,
      deadline: form.deadline,
    });
    try {
      let res = await fetch(`${import.meta.env.VITE_API_URL}/api/task`, {
        method: "POST", // Specify the HTTP method
        headers: {
          "Content-Type": "application/json", // Indicate the content type of the body
        },
        credentials: "include",
        body: JSON.stringify({
          // Convert the form to a JSON string
          title: form.title,
          detail: form.detail, // Example static body content
          loc: form.loc, // Example static user ID
          workerId:
            isAdmin() == true
              ? data.find((w: User) => w.name === workerName)?.id
              : user?.id || "",
          workerName: user?.name || "",
          deadlineAt:
            form.deadline == "" ? new Date() : new Date(form.deadline),
        }),
      });
      console.log(user);
      console.log(res);
      reset();
    } catch (e) {
      console.error(e);
    }
    return;
  }
  async function fetchAllWorker() {
    if (!isAdmin()) return [];
    try {
      let res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/worker`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      let data = await res.json();
      console.log(data);
      return data;
      // setTask(data);
    } catch (e) {
      console.error(e);
      return [];
    }
  }
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["workers"],
    queryFn: fetchAllWorker,
  });
  useEffect(() => {
    if (data && data.length > 0) {
      setWorkerName(data[0].name);
    }
  }, [data]);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (form: IFormInput) => createTask(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingTasks"] });
    },
  });
  return (
    <div id="admin-page">
      <div className="header" style={{ background: " #333", color: "white" }}>
        <h2>แผงควบคุมแอดมิน</h2>
      </div>
      <div className="card">
        <h3>➕ มอบหมายงานใหม่</h3>
        <form
          className="input-group"
          onSubmit={handleSubmit((form) => mutation.mutate(form))}
        >
          <input
            type="text"
            id="admin-title"
            placeholder="ชื่อลูกค้า/เลขวงจร"
            {...register("title", { required: true })}
          />
          <textarea
            id="admin-detail"
            placeholder="รายละเอียดอาการเสีย"
            className="text-area"
            {...register("detail", { required: true })}
          ></textarea>
          <input
            type="text"
            id="admin-loc"
            placeholder="สถานที่"
            {...register("loc", { required: true })}
          />
          {isAdmin() == true && (
            <select
              id="worker-${t.id}"
              className="select-input"
              value={workerName}
              onChange={(e) => {
                console.log(e.target.value);
                setWorkerName(e.target.value);
              }}
            >
              {data?.map((w: User) => (
                <option key={w.id} value={w.name}>
                  {w.name}
                </option>
              ))}
            </select>
          )}
          <input
            type="date"
            id="admin-deadline"
            className="select-input"
            {...register("deadline", { required: true })}
          />
          <button type="submit" className="btn-primary btn-success">
            ส่งงานเข้าระบบ
          </button>
        </form>
      </div>
      {isAdmin() && <ItemList />}
    </div>
  );
}
