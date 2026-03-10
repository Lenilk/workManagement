interface User {
  id: string;
  name: string;
  email: string;
  approve: boolean;
  role: "admin" | "worker";
}
