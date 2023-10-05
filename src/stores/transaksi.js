import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useTransaksiStore = defineStore("transaksi", {
  state: () => ({
    transaksi: {},
  }),
  getters: {
    dataTransaksi: (state) => state.transaksi,
  },
  actions: {
    addTransaksi(dataTransaksi) {
      return new Promise((resolve, reject) => {
        api({
          url: "/api/transaction",
          method: "POST",
          data: dataTransaksi
        }).then(res => {
          resolve(res)
        }).catch((err) => {
          reject(err);
        })
      })
    },
    getRiwayat() {
      return new Promise((resolve, reject) => {
        api({
          url: "/api/history",
          method: "GET",
        })
          .then((res) => {
            const dataTransaksi = res.data.result;
            this.$patch({ transaksi: dataTransaksi });
            resolve(res);
          })
          .catch((err) => {
            this.$patch({ transaksi: {} });
            reject(err);
          });
      });
    },
    getRiwayatbyId(id){
      return new Promise((resolve, reject) => {
        api({
          url: "/api/history?id="+id,
          method: "GET",
        })
          .then((res) => {
            const dataTransaksi = res.data.result;
            this.$patch({ transaksi: dataTransaksi });
            resolve(res);
          })
          .catch((err) => {
            this.$patch({ transaksi: {} });
            reject(err);
          });
      });
    },
    getRiwayatbyCustomer(id){
      return new Promise((resolve, reject) => {
        api({
          url: "/api/history?customer_id="+id,
          method: "GET",
        })
          .then((res) => {
            const dataTransaksi = res.data.result;
            this.$patch({ transaksi: dataTransaksi });
            resolve(res);
          })
          .catch((err) => {
            this.$patch({ transaksi: {} });
            reject(err);
          });
      });
    },
  },
});
