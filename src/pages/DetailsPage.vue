<template>
  <div class="q-pa-md">
    <q-card class="q-pa-md" v-if="isAtm">
      <b style="font-size: 24px; margin-bottom: 10px">Detail Atm</b>
      <!-- Loading state -->
      <q-skeleton
        type="rect"
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
      <div class="q-pb-md" v-if="!isLoading">
        <div class="row">
          <div class="col-2">Nama ATM</div>
          <div class="col-1">:</div>
          <div class="col">{{ dataList.name }}</div>
        </div>
        <div class="row">
          <div class="col-2">Alamat</div>
          <div class="col-1">:</div>
          <div class="col">{{ dataList.alamat }}</div>
        </div>
      </div>

      <q-table
        v-if="!isLoading"
        title="Jumlah uang tersedia di ATM"
        :rows="rows"
        :columns="columns"
        row-key="name"
      />

      <div class="q-py-md">
        <q-btn
          color="primary"
          icon="arrow_back"
          label="Back"
          @click="backBtn"
        />
      </div>
    </q-card>
    <q-card class="q-pa-md" v-if="isUser">
      <b style="font-size: 24px; margin-bottom: 10px">Detail User</b>
      <!-- Loading state -->
      <q-skeleton
        type="rect"
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
      <div class="q-pb-md" v-if="!isLoading">
        <div class="row">
          <div class="col-3">Nama Customer</div>
          <div class="col-1">:</div>
          <div class="col">{{ dataList.name }}</div>
        </div>
        <div class="row">
          <div class="col-3">Saldo Rekening</div>
          <div class="col-1">:</div>
          <div class="col">{{ currency.format(dataList.balance) }}</div>
        </div>
      </div>

      <q-table
        v-if="!isLoading"
        title="Histori Penarikan"
        :rows="rows"
        :columns="columnsUser"
        row-key="name"
      />

      <div class="q-py-md">
        <q-btn
          color="primary"
          icon="arrow_back"
          label="Back"
          @click="backBtn"
        />
      </div>
    </q-card>
    <q-card class="q-pa-md" v-if="isHistory">
      <b style="font-size: 24px; margin-bottom: 10px"
        >Detail Riwayat Transaksi</b
      >
      <!-- Loading state -->
      <q-skeleton
        type="rect"
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
      <div class="q-pb-md" v-if="!isLoading">
        <div class="row">
          <div class="col-3">Nama Customer</div>
          <div class="col-1">:</div>
          <div class="col">{{ dataList.name }}</div>
        </div>
        <div class="row">
          <div class="col-3">ATM</div>
          <div class="col-1">:</div>
          <div class="col">{{ dataList.atm }}</div>
        </div>
        <div class="row">
          <div class="col-3">Tanggal Penarikan</div>
          <div class="col-1">:</div>
          <div class="col">{{ dataList.tanggal }}</div>
        </div>
        <div class="row">
          <div class="col-3">Jumlah Penarikan</div>
          <div class="col-1">:</div>
          <div class="col">{{ dataList.total_withdraw }}</div>
        </div>
      </div>

      <q-table
        v-if="!isLoading"
        title="Histori Penarikan"
        :rows="rows"
        :columns="columns"
        row-key="name"
      />

      <div class="q-py-md">
        <q-btn
          color="primary"
          icon="arrow_back"
          label="Back"
          @click="backBtn"
        />
      </div>
    </q-card>
  </div>
</template>

<script>
import { useAtmStore } from "src/stores/atm";
import { useTransaksiStore } from "src/stores/transaksi";
import { ref, defineComponent } from "vue";
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

const columnsUser = [
  {
    name: "tanggal",
    align: "center",
    label: "Tanggal",
    field: "tanggal",
  },
  {
    name: "atm_name",
    align: "center",
    label: "Atm",
    field: "atm_name",
  },
  {
    name: "penarikan",
    align: "center",
    label: "Jumlah Penarikan",
    field: "penarikan",
  },
];

export default defineComponent({
  name: "DetailsPage",
  setup() {
    const isAtm = ref(false);
    const isHistory = ref(false);
    const isUser = ref(false);
    const isLoading = ref(false);
    const router = useRouter();
    const atm = useAtmStore();
    const dataList = ref({});
    const rows = ref([]);
    const history = useTransaksiStore();

    const backBtn = () => {
      router.back();
    };

    // Currency format
    const currency = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    });

    // Atm
    const getAtmDetail = (id) => {
      isLoading.value = true;
      rows.value = [];
      atm
        .getAtmbyId(id)
        .then((res) => {
          const data = res.data.result;

          dataList.value["name"] = data.name;
          dataList.value["alamat"] = data.information;
          rows.value.push(data.casette);
          isLoading.value = false;
        })
        .catch((err) => {
          console.log(err);
          isLoading.value = false;
        });
    };

    // User
    const getUserDetail = (id) => {
      isLoading.value = true;
      rows.value = [];

      history
        .getRiwayatbyCustomer(id)
        .then((res) => {
          const data = res.data.result;
          const history = data.history;

          dataList.value["name"] = data.name;
          dataList.value["balance"] = data.balance;
          history.map((data) => {
            rows.value.push({
              tanggal: new Date(data.created_at).toLocaleString(),
              atm_name: data.atm.name,
              penarikan: currency.format(data.total_withdraw),
            });
          });
          isLoading.value = false;
          console.log(rows.value);
        })
        .catch((err) => {
          console.log(err);
          isLoading.value = false;
        });
    };

    // History
    const getHistoryDetail = (id) => {
      isLoading.value = true;
      rows.value = [];
      history
        .getRiwayatbyId(id)
        .then((res) => {
          const data = res.data.result;

          dataList.value["name"] = data.customer.name;
          dataList.value["atm"] = data.atm.name;
          dataList.value["tanggal"] = new Date(data.created_at).toLocaleString();
          dataList.value["total_withdraw"] = currency.format(data.total_withdraw);
          rows.value.push(data.detail);
          isLoading.value = false;
        })
        .catch((err) => {
          console.log(err);
          isLoading.value = false;
        });
    };

    return {
      isAtm,
      isHistory,
      isUser,
      isLoading,
      backBtn,
      getAtmDetail,
      getUserDetail,
      getHistoryDetail,
      dataList,
      columns,
      columnsUser,
      rows,
      currency,
    };
  },
  mounted() {
    const id = this.$route.query.id;
    if (window.location.toString().includes("atm_list")) {
      this.isAtm = true;
      this.isUser = false;
      this.isHistory = false;
      this.getAtmDetail(id);
    } else if (window.location.toString().includes("user")) {
      this.isAtm = false;
      this.isUser = true;
      this.isHistory = false;
      this.getUserDetail(id);
    } else if (window.location.toString().includes("riwayat")) {
      this.isAtm = false;
      this.isUser = false;
      this.isHistory = true;
      this.getHistoryDetail(id);
    }
  },
});
</script>
