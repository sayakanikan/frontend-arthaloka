<template>
  <div class="q-pa-md">
    <!-- Loading skeleton -->
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
    <q-table
      v-if="!isLoading"
      title="Riwayat Penarikan"
      :rows="rows"
      :columns="columns"
      row-key="id"
    >
      <template v-slot:body-cell-aksi="data">
        <q-td :props="data" class="q-gutter-x-sm">
          <q-btn
            icon="visibility"
            color="primary"
            rounded
            @click="viewHistory(data.value)"
          />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
import { useTransaksiStore } from "src/stores/transaksi";
import { ref, defineComponent } from "vue";
import { useRouter } from "vue-router";

const columns = [
  {
    name: "tanggal",
    align: "center",
    label: "Tanggal",
    field: "tanggal",
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
    name: "atm",
    align: "center",
    label: "ATM",
    field: "atm",
    sortable: true,
  },
  {
    name: "penarikan",
    align: "center",
    label: "Jumlah Penarikan",
    field: "penarikan",
    sortable: true,
  },
  {
    name: "aksi",
    align: "center",
    label: "Aksi",
    field: "aksi",
    sortable: true,
  },
];

export default defineComponent({
  name: "RiwayatPage",
  setup() {
    const router = useRouter();
    const isLoading = ref(false);
    const rows = ref([]);
    const history = useTransaksiStore();
    const modal = ref({
      id: 0,
    });

    // Currency format
    const currency = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    });

    // History Penarikan
    const getHistory = () => {
      rows.value = [];
      isLoading.value = true;
      history.getRiwayat().then((res) => {
        const data = res.data.result;

        data.map((value) => {
          rows.value.push({
            tanggal: new Date(value.created_at).toLocaleString(),
            name: value.customer.name,
            atm: value.atm.name,
            penarikan: currency.format(value.total_withdraw),
            aksi: value.id,
          });
        });
        isLoading.value = false;
      });
    };

    // Detail History
    const viewHistory = (id) => {
      router.push({ name: "Detail Riwayat", query: { id: id } });
    };

    return {
      isLoading,
      columns,
      rows,
      modal,
      currency,
      getHistory,
      viewHistory,
    };
  },
  mounted() {
    this.getHistory();
  },
});
</script>
