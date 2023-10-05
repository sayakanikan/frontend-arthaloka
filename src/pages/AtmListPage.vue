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

    <!-- Table -->
    <q-btn
      color="primary"
      label="Tambah ATM"
      icon="add"
      class="q-mb-md"
      rounded
      v-if="!isLoading"
      @click="toggleAdd"
    />
    <q-table
      title="List ATM Bank Arthaloka"
      :rows="rows"
      :columns="columns"
      row-key="No"
      v-if="!isLoading"
    >
      <template v-slot:body-cell-aksi="data">
        <q-td :props="data" class="q-gutter-x-sm">
          <q-btn
            icon="visibility"
            color="primary"
            rounded
            @click="viewAtm(data.value)"
          />
          <q-btn
            icon="edit"
            color="warning"
            rounded
            @click="editAtm(data.value)"
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
  </div>

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
          v-for="n in 9"
          type="Qinput"
          v-if="isLoadingDialog"
          class="q-mb-md"
          style="width: 500px; height: 50px"
        />
        <q-skeleton
          type="Qbtn"
          v-if="isLoadingDialog"
          class="q-mb-md"
          style="width: 100px"
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
            label="Nama Atm *"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Masukan nama ATM']"
          />
          <q-input
            filled
            v-model.trim="form.alamat"
            label="Alamat *"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Masukan alamat atm']"
          />
          <div v-for="(input, counter) in form.casette" v-bind:key="counter">
            <q-input
              filled
              type="number"
              v-model.trim="input.value"
              :label="input.label"
              lazy-rules
            />
          </div>

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
        <span class="q-ml-sm">Anda yakin akan menghapus ATM ini?</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Tidak" color="black" v-close-popup />
        <q-btn
          flat
          label="Ya"
          color="negative"
          v-close-popup
          @click="removeAtm(modal.id)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Alert -->
  <q-dialog v-model="alert">
    <q-card>
      <q-card-section>
        <div class="text-h6">Alert</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        {{ dataAlert.content }}
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="OK" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { reactive, ref, defineComponent } from "vue";
import { useAtmStore } from "src/stores/atm";
import { useRouter } from "vue-router";

const columns = [
  {
    name: "No",
    align: "center",
    label: "no",
    field: "no",
    sortable: true,
  },
  {
    name: "ATM",
    align: "center",
    label: "ATM",
    field: "name",
    sortable: true,
  },
  {
    name: "alamat",
    align: "center",
    label: "Alamat",
    field: "information",
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
  name: "AtmListPage",
  setup() {
    const atm = useAtmStore();
    const router = useRouter();
    const isLoading = ref(true);
    const isLoadingDialog = ref(false);
    const alert = ref(false);
    const rows = ref([]);
    const deleteDialog = ref(false);
    const addUpdateDialog = ref(false);
    const dataAlert = ref({
      content: "Aksi Berhasil",
    });
    const modal = ref({
      title: "Tambah Data ATM",
      button: "Simpan",
      type: "add",
      id: 0,
    });
    const form = reactive({
      name: null,
      alamat: null,
      casette: [
        {
          name: "casette_1",
          value: null,
          label: "Jumlah pecahan uang Rp. 100.000",
        },
        {
          name: "casette_2",
          value: null,
          label: "Jumlah pecahan uang Rp. 50.000",
        },
        {
          name: "casette_3",
          value: null,
          label: "Jumlah pecahan uang Rp. 20.000",
        },
        {
          name: "casette_4",
          value: null,
          label: "Jumlah pecahan uang Rp. 10.000",
        },
        {
          name: "casette_5",
          value: null,
          label: "Jumlah pecahan uang Rp. 5.000",
        },
        {
          name: "casette_6",
          value: null,
          label: "Jumlah pecahan uang Rp. 2.000",
        },
        {
          name: "casette_7",
          value: null,
          label: "Jumlah pecahan uang Rp. 1.000",
        },
      ],
    });

    // Get
    const getAtm = () => {
      rows.value = [];
      atm.getAtm().then((res) => {
        const data = res.data.result;

        data.map((data, index) =>
          rows.value.push({
            no: index + 1,
            name: data.name,
            information: data.information,
            id: data.id,
          })
        );
        isLoading.value = false;
      });
    };

    // Add and update Atm
    const toggleAdd = () => {
      modal.value.title = "Tambah Data Atm";
      modal.value.button = "Simpan";
      modal.value.type = "add";
      onReset();
      addUpdateDialog.value = true;
    };

    const onSubmit = (id, type) => {
      isLoading.value = true;
      if (type == "add") {
        atm
          .addAtm({
            name: form.name,
            information: form.alamat,
            casette: form.casette,
          })
          .then((res) => {
            if (res.status === 200) {
              alert.value = true;
              dataAlert.value.content = "Data ATM berhasil ditambahkan";
              getAtm();
            }
          })
          .catch((err) => {
            alert.value = true;
            dataAlert.value.content =
              "Data ATM gagal ditambahkan, error " + err.message;
          });
      }

      if (type == "edit") {
        atm
          .updateAtm(id, {
            name: form.name,
            information: form.alamat,
            casette: form.casette,
          })
          .then((res) => {
            if (res.status === 200) {
              alert.value = true;
              dataAlert.value.content = "Data ATM berhasil diupdate";
              getAtm();
            }
          })
          .catch((err) => {
            alert.value = true;
            dataAlert.value.content =
              "Data ATM gagal diupdate, error " + err.message;
          });
      }
    };

    const editAtm = (id) => {
      modal.value.title = "Edit Atm Data";
      modal.value.button = "Update";
      modal.value.type = "edit";
      modal.value.id = id;

      addUpdateDialog.value = true;
      isLoadingDialog.value = true;
      atm.getAtmbyId(id).then((res) => {
        if (res.status === 200) {
          const data = res.data.result;

          onReset();
          form.name = data.name;
          form.alamat = data.information;
          form.casette.map((item) => {
            item.value = data.casette[item.name];
          });
          isLoadingDialog.value = false;
        }
      });
    };

    const onReset = () => {
      form.name = null;
      form.alamat = null;
      form.casette = [
        {
          name: "casette_1",
          value: null,
          label: "Jumlah pecahan uang Rp. 100.000",
        },
        {
          name: "casette_2",
          value: null,
          label: "Jumlah pecahan uang Rp. 50.000",
        },
        {
          name: "casette_3",
          value: null,
          label: "Jumlah pecahan uang Rp. 20.000",
        },
        {
          name: "casette_4",
          value: null,
          label: "Jumlah pecahan uang Rp. 10.000",
        },
        {
          name: "casette_5",
          value: null,
          label: "Jumlah pecahan uang Rp. 5.000",
        },
        {
          name: "casette_6",
          value: null,
          label: "Jumlah pecahan uang Rp. 2.000",
        },
        {
          name: "casette_7",
          value: null,
          label: "Jumlah pecahan uang Rp. 1.000",
        },
      ];
    };

    // Detail
    const viewAtm = (id) => {
      router.push({ name: "Detail Atm", query: { id: id } });
    };

    // Delete
    const toggleDelete = (id) => {
      deleteDialog.value = true;
      modal.value.id = id;
    };

    const removeAtm = (id) => {
      atm
        .deleteAtm(id)
        .then((res) => {
          alert.value = true;
          dataAlert.value.content = "Data ATM berhasil dihapus";
          getAtm();
        })
        .catch((err) => {
          alert.value = true;
          dataAlert.value.content =
            "Data ATM gagal dihapus, error " + err.message;
        });
    };

    return {
      isLoading,
      isLoadingDialog,
      columns,
      rows,
      getAtm,
      addUpdateDialog,
      onReset,
      onSubmit,
      toggleAdd,
      removeAtm,
      deleteDialog,
      toggleDelete,
      modal,
      form,
      editAtm,
      viewAtm,
      dataAlert,
      alert,
    };
  },
  mounted() {
    this.getAtm();
  },
});
</script>
