<template>
  <div class="q-pa-md">
    <!-- Loading skeleton -->
    <q-skeleton
      type="Qchip"
      v-if="isLoading"
      class="q-mb-md"
      style="max-width: 150px"
    />
    <q-markup-table v-if="isLoading">
      <thead>
        <tr>
          <th class="text-left" style="width: 150px">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="n in 5" :key="n">
          <td class="text-left">
            <q-skeleton animation="blink" type="text" width="85px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="50px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="35px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="65px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="25px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="85px" />
          </td>
        </tr>
      </tbody>
    </q-markup-table>

    <!-- Data -->
    <q-btn
      color="primary"
      label="Tambah Customer"
      icon="add"
      class="q-mb-md"
      rounded
      v-if="!isLoading"
      @click="toggleAdd"
    />
    <q-table
      v-if="!isLoading"
      title="Customer Bank Arthaloka"
      :rows="rows"
      :columns="columns"
      row-key="No"
    >
      <template v-slot:body-cell-aksi="data">
        <q-td :props="data" class="q-gutter-x-sm">
          <q-btn
            icon="visibility"
            color="primary"
            rounded
            @click="viewCustomer(data.value)"
          />
          <q-btn
            icon="edit"
            color="warning"
            rounded
            @click="editCustomer(data.value)"
          />
          <q-btn
            icon="delete"
            color="negative"
            rounded
            @click="toggleDelete(data.value)"
          />
        </q-td>
      </template>
    </q-table>

    <!-- Add and update dialog -->
    <q-dialog v-model="addUpdateDialog">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ modal.title }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <!-- Loading Form if edit -->
          <q-skeleton
            v-for="n in 2"
            type="Qinput"
            v-if="isLoadingDialog"
            class="q-mb-md"
            style="width: 500px; height: 50px;"
          />
          <q-skeleton
            type="Qbtn"
            v-if="isLoadingDialog"
            class="q-mb-md"
            style="width: 100px;"
          />
          
          <!-- Form -->
          <q-form
            v-if="!isLoadingDialog"
            @submit="onSubmit(modal.id, modal.type)"
            @reset="onReset"
            class="q-gutter-md"
            style="width: 500px"
          >
            <q-input
              filled
              v-model.trim="form.name"
              label="Nama Customer *"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Masukan nama Customer',
              ]"
            />
            <q-input
              filled
              v-model.trim="form.balance"
              label="Saldo Customer"
              lazy-rules
            />

            <div>
              <q-btn
                :label="modal.button"
                type="submit"
                color="primary"
                v-close-popup
              />
              <q-btn
                v-if="modal.type === 'add'"
                label="Reset"
                type="reset"
                color="primary"
                flat
                class="q-ml-sm"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Delete dialog -->
    <q-dialog v-model="deleteDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="negative" text-color="white" />
          <span class="q-ml-sm">Anda yakin akan menghapus Customer ini?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Tidak" color="black" v-close-popup />
          <q-btn
            flat
            label="Ya"
            color="negative"
            v-close-popup
            @click="removeCustomer(modal.id)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { useCustomerStore } from "src/stores/customer";
import { ref, reactive, defineComponent } from "vue";
import { useRouter } from "vue-router";

const columns = [
  {
    name: "No",
    align: "center",
    label: "No",
    field: "no",
    sortable: true,
  },
  {
    name: "name",
    align: "center",
    label: "Nama Customer",
    field: "name",
    sortable: true,
  },
  {
    name: "no_rek",
    align: "center",
    label: "Rekening",
    field: "account",
    sortable: true,
  },
  {
    name: "balance",
    align: "center",
    label: "Saldo",
    field: "balance",
    sortable: true,
  },
  {
    name: "aksi",
    align: "center",
    label: "Aksi",
    field: "id",
  },
];

export default defineComponent({
  name: "UsersPage",
  setup() {
    const router = useRouter();
    const customer = useCustomerStore();
    const isLoading = ref(false);
    const isLoadingDialog = ref(false);
    const addUpdateDialog = ref(false);
    const deleteDialog = ref(false);
    const rows = ref([]);
    const modal = ref({
      title: "Tambah Data Customer",
      button: "Simpan",
      type: "add",
      id: 0,
    });
    const form = reactive({
      name: null,
      balance: null,
    });

    // Currency format
    const currency = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    });

    // Reset Form
    const onReset = () => {
      form.name = null;
      form.balance = null;
    };

    // Get customers
    const getCustomer = () => {
      rows.value = [];
      isLoading.value = true;
      customer
        .getCustomer()
        .then((res) => {
          const data = res.data.result;

          data.map((data, index) =>
            rows.value.push({
              no: index + 1,
              name: data.name,
              account: data.account,
              balance: currency.format(data.balance),
              id: data.id,
            })
          );
          isLoading.value = false;
        }).catch((err) => {
          if (err.response.status === 404) {
            isLoading.value = false;
          }
        });
    };

    // Add and update Customer
    const toggleAdd = () => {
      modal.value.title = "Tambah Data Customer";
      modal.value.button = "Simpan";
      modal.value.type = "add";
      onReset();
      addUpdateDialog.value = true;
    };

    const onSubmit = (id, type) => {
      isLoading.value = true;
      if (type == "add") {
        customer
          .addCustomer(form)
          .then((res) => {
            if (res.status === 200) {
              getCustomer();
            }
          })
          .catch((err) => {
            console.log(err);
            isLoading.value = false;
          });
      }

      if (type == "edit") {
        customer
          .updateCustomer(id, form)
          .then((res) => {
            if (res.status === 200) {
              getCustomer();
            }
          })
          .catch((err) => {
            console.log(err);
            isLoading.value = false;
          });
      }
    };

    const editCustomer = (id) => {
      modal.value.title = "Edit Customer Data";
      modal.value.button = "Update";
      modal.value.type = "edit";
      modal.value.id = id;

      addUpdateDialog.value = true;
      isLoadingDialog.value = true;
      customer.getCustomerbyId(id).then((res) => {
        if (res.status === 200) {
          const data = res.data.result;

          onReset();
          form.name = data.name;
          form.balance = data.balance;
          isLoadingDialog.value = false;
        }
      });
    };

    // Detail Customer
    const viewCustomer = (id) => {
      router.push({ name: "Detail Customer", query: { id: id } });
    };

    // Delete Customer
    const toggleDelete = (id) => {
      deleteDialog.value = true;
      modal.value.id = id;
    };

    const removeCustomer = (id) => {
      isLoading.value = true;
      customer
        .deleteCustomer(id)
        .then((res) => {
          if (res.status === 200) {
            getCustomer();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };

    return {
      isLoading,
      isLoadingDialog,
      toggleAdd,
      columns,
      rows,
      getCustomer,
      addUpdateDialog,
      editCustomer,
      viewCustomer,
      toggleDelete,
      removeCustomer,
      deleteDialog,
      modal,
      form,
      onReset,
      onSubmit,
    };
  },
  mounted() {
    this.getCustomer();
  },
});
</script>
