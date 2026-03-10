import { useState, useEffect } from "react";
import JobInBox from "./jobInBox";
import { useQuery } from "@tanstack/react-query";

export default function JobInboxPage() {
  // const [task, setTask] = useState([]);
  async function fetchMyPendingTask() {
    try {
      let res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/task/pending`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );
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
    queryKey: ["pendingTasks"],
    queryFn: fetchMyPendingTask,
  });
  if (isLoading) return <p>กำลังโหลด...</p>;
  if (isError) return <p>เกิดข้อผิดพลาด: {error.message}</p>;
  // useEffect(() => {
  //   fetchMyPendingTask();
  // }, []);
  return (
    <div id="job-inbox-page">
      <div className="header" style={{ background: "#0056b3", color: "white" }}>
        <h2>กล่องรับงานใหม่</h2>
      </div>
      <div id="incoming-jobs-list">
        {data?.map((t: Task) => (
          <JobInBox t={t} key={t.id} />
        ))}
      </div>
    </div>
  );
}
