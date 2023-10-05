import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useAtmStore = defineStore("atm", {
  state: () => ({
    atm: {},
  }),
  getters: {
    dataAtm: (state) => state.atm,
  },
  actions: {
    getAtm() {
      return new Promise((resolve, reject) => {
        api({
          url: "/api/atm",
          method: "GET",
        })
          .then((res) => {
            const dataAtm = res.data.result;
            this.$patch({ atm: dataAtm });
            resolve(res);
          })
          .catch((err) => {
            this.$patch({ atm: {} });
            reject(err);
          });
      });
    },
    getAtmbyId(id) {
      return new Promise((resolve, reject) => {
        api({
          url: "/api/atm?id="+id,
          method: "GET",
        })
          .then((res) => {
            const dataAtm = res.data.result;
            this.$patch({ atm: dataAtm });
            resolve(res);
          })
          .catch((err) => {
            this.$patch({ atm: {} });
            reject(err);
          });
      });
    },
    getAtmList(){
      return new Promise((resolve, reject) => {
        api({
          url: "/api/atm/list",
          method: "GET",
        })
          .then((res) => {
            const dataAtm = res.data.result;
            this.$patch({ atm: dataAtm });
            resolve(res);
          })
          .catch((err) => {
            this.$patch({ atm: {} });
            reject(err);
          });
      });
    },
    addAtm(dataAtm) {
      return new Promise((resolve, reject) => {
        api({
          url: "/api/atm",
          method: "POST",
          data: dataAtm
        }).then(res => {
          resolve(res)
        }).catch((err) => {
          resolve(err);
        })
      })
    },
    updateAtm(id, dataAtm) {
      return new Promise((resolve, reject) => {
        api({
          url: "/api/atm/"+id,
          method: "PUT",
          data: dataAtm
        }).then(res => {
          resolve(res)
        }).catch((err) => {
          resolve(err);
        })
      })
    },
    deleteAtm(id) {
      return new Promise((resolve, reject) => {
        api({
          url: "/api/atm/" + id,
          method: "DELETE",
        })
          .then((res) => resolve(res))
          .catch((err) => reject(err));
      });
    },
  },
});
