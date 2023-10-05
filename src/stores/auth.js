import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    status: "success",
    accessToken: "",
    user: {},
  }),
  getters: {
    isLoggedIn: (state) => !!state.accessToken,
    dataUser: (state) => state.user,
  },
  actions: {
    login(userData) {
      return new Promise((resolve, reject) => {
        api({
          url: "/api/auth/login",
          method: "POST",
          data: userData,
        })
          .then((res) => {
            const accessToken = res.data.result.access_token;
            localStorage.setItem("accessToken", accessToken);
            api.defaults.headers.common["Authorization"] =
              "Bearer " + accessToken;
            this.$patch({ status: "success", accessToken: accessToken });
            this.getUser();
            resolve(res);
          })
          .catch((err) => {
            this.$patch({ status: "error", access_token: "" });
            localStorage.removeItem("access_token");
            delete api.defaults.headers["Authorization"];
            resolve(err);
          });
      });
    },
    getUser() {
      return new Promise((resolve, reject) => {
        api({
          url: "/api/auth/me",
          method: "GET",
        })
          .then((res) => {
            const user = res.data.result;
            this.$patch({ user: user });
            resolve(res);
          })
          .catch((err) => {
            this.$patch({ user: {} });
            resolve(err);
          });
      });
    },
    logout() {
      localStorage.removeItem("accessToken");
      delete api.defaults.headers.common["Authorization"];
      this.$patch({ accessToken: "" });
    },
  },
});
