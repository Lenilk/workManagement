import { create } from "zustand";

interface UserState {
  notApproveUsers: User[];
  ApproveUsers: User[];
  setUsers: (users: User[]) => void;
}

export const useUserStore = create<UserState>((set) => ({
  notApproveUsers: [],
  ApproveUsers: [],
  setUsers: (users) => {
    set({
      notApproveUsers: users.filter((e) => e.approve == false),
      ApproveUsers: users.filter((e) => e.approve == true),
    });
  },
}));
