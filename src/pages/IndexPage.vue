<template>
  <q-layout
    view="lHh lpr lFf"
    container
    style="height: 100vh"
    class="shadow-2 rounded-borders"
  >
    <!-- Navbar -->
    <div class="q-pb-md q-gutter-y-sm">
      <q-toolbar class="text-primary shadow-5" style="height: 100%">
        <q-btn flat round dense icon="monetization_on" />
        <q-toolbar-title> Bank Arthaloka </q-toolbar-title>
        <q-btn flat square label="Login Admin" @click="redirectLogin" />
      </q-toolbar>
    </div>

    <!-- Content -->
    <div class="q-ma-md">
      <q-card class="my-card q-pa-sm shadow-5">
        <q-card-section>
          <div class="text-h5 text-center">ATM Bank Arthaloka</div>
        </q-card-section>

        <div class="q-mx-md">
          <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
            <q-input
              label-color="dark"
              filled
              v-model.trim="form.customer_account"
              label="Nomor Rekening *"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Masukan no rekening',
              ]"
            />
            <q-select
              label-color="dark"
              filled
              label="ATM *"
              v-model.trim="form.atm_id"
              :options="atm_opt"
              lazy-rules
              :rules="[
                (val) => (val !== null && val !== '') || 'Pilih ATM Tersedia',
              ]"
            />
            <q-input
              label-color="dark"
              filled
              type="number"
              v-model.trim="form.value"
              label="Nominal diambil *"
              lazy-rules
              prefix="Rp. "
              :rules="[
                (val) =>
                  (val && val.length > 0) ||
                  'Masukan nominal yang ingin diambil',
              ]"
            />
          </q-form>
        </div>

        <q-card-actions class="q-pa-md">
          <q-btn
            color="primary"
            style="width: 200px"
            v-if="!isLoading"
            @click="confirm = true"
            >Lanjutkan Transaksi</q-btn
          >
          <q-spinner color="gray" size="3em" v-if="isLoading" />
        </q-card-actions>
      </q-card>
    </div>

    <!-- Modal result -->
    <q-dialog v-model="modalDetail" style="width: 800px">
      <q-card style="width: 800px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Transaksi Berhasil</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <div class="q-pa-md">
          <b>Data Pelanggan</b>
          <div class="row">
            <div class="col-4">Nama:</div>
            <div class="col">{{ dataTransaksi[0].customer.name }}</div>
          </div>
          <div class="row">
            <div class="col-4">No Rekening:</div>
            <div class="col">{{ dataTransaksi[0].customer.account }}</div>
          </div>
          <div class="row">
            <div class="col-4">Saldo Rekening:</div>
            <div class="col">
              {{ currency.format(dataTransaksi[0].customer.balance) }}
            </div>
          </div>
          <div class="row">
            <div class="col-4">Total Penarikan:</div>
            <div class="col">
              {{ currency.format(dataTransaksi[0].history.total_withdraw) }}
            </div>
          </div>
          <br />

          <q-table
            title="Detail Transaksi"
            :rows="rows"
            :columns="columns"
            row-key="name"
          />
        </div>
      </q-card>
    </q-dialog>

    <!-- Alert Failed -->
    <q-dialog v-model="alert">
      <q-card>
        <q-card-section>
          <div class="text-h5 ">Alert!</div>
        </q-card-section>

        <q-card-section class="q-pt-none text-negative">
          {{ alertMessage }}
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Alert Confirm -->
    <q-dialog v-model="confirm" persistent style="width: 1600px;">
      <q-card>
        <q-card-section class="row items-center">
          <div class="col-2 q-px-sm">
            <q-avatar icon="paid" color="primary" text-color="white" />
          </div>
          <div class="col">
            <span>Apakah anda yakin akan melanjutkan transaksi? Pastikan data yang anda masukan sudah benar.</span>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Kembali" color="dark" v-close-popup />
          <q-btn flat label="Proses Transaksi" color="primary" @click="onSubmit" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import { useAtmStore } from "src/stores/atm";
import { useAuthStore } from "src/stores/auth";
import { useTransaksiStore } from "src/stores/transaksi";
import { ref, reactive, defineComponent } from "vue";
import { useRouter } from "vue-router";

const columns = [
  {
    name: "casette_1",
    align: "center",
    label: "Rp. 100.000",
    field: "casette_1",
  },
  {
    name: "casette_2",
    align: "center",
    label: "Rp. 50.000",
    field: "casette_2",
  },
  {
    name: "casette_3",
    align: "center",
    label: "Rp. 20.000",
    field: "casette_3",
  },
  {
    name: "casette_4",
    align: "center",
    label: "Rp. 10.000",
    field: "casette_4",
  },
  {
    name: "casette_5",
    align: "center",
    label: "Rp. 5.000",
    field: "casette_5",
  },
  {
    name: "casette_6",
    align: "center",
    label: "Rp. 2.000",
    field: "casette_6",
  },
  {
    name: "casette_7",
    align: "center",
    label: "Rp. 1.000",
    field: "casette_7",
  },
];

const currency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
});

export default defineComponent({
  name: "IndexPage",
  setup() {
    if (useAuthStore().isLoggedIn) {
      router.push("/atm_list");
    }

    const router = useRouter();
    const atm = useAtmStore();
    const transaksi = useTransaksiStore();
    const atm_opt = ref([]);
    const isLoading = ref(false);
    const modalDetail = ref(false);
    const dataTransaksi = ref([]);
    const rows = ref([]);
    const alert = ref(false)
    const alertMessage = ref("");
    const redirectLogin = () => {
      router.push("/login");
    };

    const form = reactive({
      customer_account: null,
      atm_id: null,
    });

    const getAtmList = () => {
      atm_opt.value = [];
      atm.getAtmList().then((res) => {
        const data = res.data.result;
        data.map((data) =>
          atm_opt.value.push({
            label: data.name + " (" + data.information + ")",
            value: data.id,
          })
        );
      });
    };

    const onSubmit = () => {
      isLoading.value = true;
      transaksi
        .addTransaksi({
          customer_account: form.customer_account,
          atm_id: form.atm_id.value,
          amount_withdraw: form.value,
        })
        .then((res) => {
          dataTransaksi.value = [];
          rows.value = [];
          if (res.status === 200) {
            const data = res.data.result;

            dataTransaksi.value.push(data);
            rows.value.push(data.detail);
            modalDetail.value = true;
          }
          onReset();
          isLoading.value = false;
        })
        .catch((err) => {
          alert.value = true;
          alertMessage.value = err.response.data.result;
          onReset();
          isLoading.value = false;
        });
    };

    const onReset = () => {
      form.customer_account = null;
      form.atm_id = null;
      form.value = null;
    };

    return {
      redirectLogin,
      getAtmList,
      atm_opt,
      form,
      currency,
      onSubmit,
      modalDetail,
      onReset,
      dataTransaksi,
      columns,
      rows,
      isLoading,
      alert,
      alertMessage,
      confirm: ref(false),
    };
  },
  mounted() {
    this.getAtmList();
  },
});
</script>
