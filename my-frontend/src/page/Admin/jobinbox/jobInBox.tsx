import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export default function JobInBox({ t }: { t: Task }) {
  async function acceptJob() {
    try {
      let res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/task/claimTask`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ id: t.id }),
        },
      );
      let data = await res.json();
      console.log(data);
    } catch (e) {
      console.error(e);
    }
  }
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: acceptJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingTasks"] });
    },
  });
  return (
    <div className="card">
      <h3>{t.title}</h3>
      <p>{t.detail}</p>
      <p>
        <small>📍 {t.loc}</small>
      </p>
      <button
        className="btn-primary btn-success"
        style={{ width: "100%" }}
        onClick={() => mutation.mutate()}
      >
        รับงานนี้
      </button>
    </div>
  );
}
