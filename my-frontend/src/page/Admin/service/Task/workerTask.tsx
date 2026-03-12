import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useForm } from "react-hook-form";
interface IFormInput {
  // gps: string;
  image: FileList;
  workResult: string;
  status: string;
}

export default function WorkerTask({ t }: { t: Task }) {
  const [status, setStatus] = useState("completed");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>();
  const [gps, setGps] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [imagefile, setImageFile] = useState<File | null>(null);
  const [workResult, setWorkResult] = useState("");
  const imageRest = register("image", { required: "กรุณาอัปโหลดรูปภาพ" });
  function setLocation() {
    navigator.geolocation.getCurrentPosition((p) => {
      setGps(`${p.coords.latitude},${p.coords.longitude}`);
    });
  }
  let formData = new FormData();
  function handlePhoto(event: ChangeEvent, t: any) {
    const reader = new FileReader();

    reader.onload = () => {
      console.log(reader.result);
      setImage(reader.result as string);
    };
    console.log(event.target.files);
    setImageFile(event.target.files[0]);
    reader.readAsDataURL(event.target.files[0]);
  }

  async function finishJob(form: IFormInput) {
    // console.log({
    //   status,
    //   workResult,
    //   gps: gps,
    //   form: formData,
    // });
    // if (!gps) {
    //   alert("กรุณาปักหมุด GPS ก่อนส่งงาน");
    //   return;
    // }
    if (!form.image) {
      alert("กรุณาถ่ายภาพประกอบก่อนส่งงาน");
      return;
    }
    console.log("form");
    console.log(form);
    formData.append("id", `${t.id}`);
    formData.append("status", form.status);
    formData.append("workResult", form.workResult);
    formData.append("gps", gps ?? "");
    formData.append("image", form.image[0]);
    console.log(formData);
    try {
      let res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/task/finishTask`,
        {
          method: "POST",
          // headers: {
          //   "Content-Type": "application/json",
          // },
          credentials: "include",
          body: formData,
        },
      );
      let data = await res.json();
      console.log(data);
      return data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: finishJob,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["claimedTasks"],
      });
    },
  });
  useEffect(() => {
    console.log(errors);
  }, [errors]);
  return (
    <form
      className="card"
      onSubmit={handleSubmit((form) => mutation.mutate(form))}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>ID: {t.id}</h2>
      </div>
      <h3>
        มอบงานเมื่อ:{" "}
        {t.createdAt ? new Date(t.createdAt).toLocaleString() : "-"}
      </h3>
      <h3>ชื่อลูกค้า/เลขวงจร: {t.title}</h3>
      <p>รายละเอียด: {t.detail}</p>
      <p>สถานที่: {t.loc}</p>
      <h3>
        กำหนดการ: {t.deadlineAt ? new Date(t.deadlineAt).toDateString() : "-"}
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px",
          marginTop: "10px",
        }}
      >
        {/* <input
          type="button"
          onClick={setLocation}
          value={`📍 ${gps ? "อัปเดตพิกัดแล้ว" : "ปักหมุด GPS"}`}
          className="btn-primary"
          style={{ background: "#f0f0f0", color: "#333", fontSize: "12px" }}
        /> */}

        <label
          className="btn-primary"
          style={{
            background: "#f0f0f0",
            color: "#333",
            fontSize: "12px",
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          📸 ถ่ายภาพ
          <input
            name={imageRest.name}
            ref={imageRest.ref}
            onBlur={imageRest.onBlur}
            // 3. จัดการ onChange เอง
            onChange={(event) => {
              // เรียกใช้ onChange ของ React Hook Form ก่อน (สำคัญ!)
              imageRest.onChange(event);

              // เรียกใช้ฟังก์ชัน handlePhoto ของคุณต่อ
              handlePhoto(event, t.id);
            }}
            type="file"
            accept="image/*"
            capture="user"
            style={{ display: "none" }}
            // onChange={(event) => handlePhoto(event, "${t.id}")}
          />
        </label>
      </div>

      {image ? (
        <div className=" items-center">
          <img
            src={image}
            className="preview-img"
            style={{
              width: "300px",
              marginTop: "10px",
              borderRadius: "8px",
              height: "300px",
              objectFit: "cover",
            }}
            onClick={() => "viewImage('${image}', 'ID: ${t.id}')"}
          ></img>
        </div>
      ) : (
        ""
      )}
      <div
        style={{
          marginTop: "15px",
          borderTop: "1px",
          border: "1px solid #eee",
          paddingTop: "15px",
        }}
      >
        <select
          {...register("status", { required: true })}
          id="status-${t.id}"
          className="select-input"
          // value={status}
          // onChange={(e) => setStatus(e.target.value)}
        >
          <option value="completed">✅ ดำเนินการสำเร็จ</option>
          <option value="failed">❌ ไม่สำเร็จ/ยกเลิก</option>
        </select>
        <textarea
          {...register("workResult", { required: true })}
          id="note-${t.id}"
          placeholder="บันทึกรายละเอียดการซ่อม..."
          className="text-area"
          // value={workResult}
          // onChange={(e) => setWorkResult(e.target.value)}
        ></textarea>
        {/* {!gps && (
          <p style={{ color: "red", fontSize: "12px" }}>กรุณาปักหมุด GPS</p>
        )} */}
        {!image && (
          <p style={{ color: "red", fontSize: "12px" }}>
            กรุณาถ่ายภาพประกอบงาน
          </p>
        )}
        <button
          // disabled={!gps || !image}
          // disabled={ !image}
          type="submit"
          className="btn-primary btn-success"
          style={{ width: "100%" }}
        >
          ส่งงานและปิดเคส
        </button>
      </div>
    </form>
  );
}
