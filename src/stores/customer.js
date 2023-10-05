import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useCustomerStore = defineStore("customer", {
  state: () => ({
    customer: {},
  }),
  getters: {
    dataCustomer: (state) => state.customer,
  },
  actions: {
    getCustomer() {
      return new Promise((resolve, reject) => {
        api({
          url: "/api/customer",
          method: "GET",
        })
          .then((res) => {
            const dataCustomer = res.data.result;
            this.$patch({ customer: dataCustomer });
            resolve(res);
          })
          .catch((err) => {
            this.$patch({ customer: {} });
            reject(err);
          });
      });
    },
    getCustomerbyId(id) {
      return new Promise((resolve, reject) => {
        api({
          url: "/api/customer?id="+id,
          method: "GET",
        })
          .then((res) => {
            const dataCustomer = res.data.result;
            this.$patch({ customer: dataCustomer });
            resolve(res);
          })
          .catch((err) => {
            this.$patch({ customer: {} });
            reject(err);
          });
      });
    },
    getCustomerbyAccount(id){
      return new Promise((resolve, reject) => {
        api({
          url: "/api/customer?account="+id,
          method: "GET",
        })
          .then((res) => {
            const dataCustomer = res.data.result;
            this.$patch({ customer: dataCustomer });
            resolve(res);
          })
          .catch((err) => {
            this.$patch({ customer: {} });
            reject(err);
          });
      });
    },
    addCustomer(dataCustomer) {
      return new Promise((resolve, reject) => {
        api({
          url: "/api/customer",
          method: "POST",
          data: dataCustomer
        }).then(res => {
          resolve(res)
        }).catch((err) => {
          resolve(err);
        })
      })
    },
    updateCustomer(id, dataCustomer) {
      return new Promise((resolve, reject) => {
        api({
          url: "/api/customer/"+id,
          method: "PUT",
          data: dataCustomer
        }).then(res => {
          resolve(res)
        }).catch((err) => {
          resolve(err);
        })
      })
    },
    deleteCustomer(id) {
      return new Promise((resolve, reject) => {
        api({
          url: "/api/customer/" + id,
          method: "DELETE",
        })
          .then((res) => resolve(res))
          .catch((err) => reject(err));
      });
    },
  },
});
