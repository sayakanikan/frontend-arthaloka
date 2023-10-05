<template>
  <q-layout class="flex flex-center">
    <div class="q-pa-md row items-start q-gutter-md">
      <q-card class="my-card">
        <q-card-section class="bg-light-blue-8 text-white">
          <div class="text-h3 q-px-xl q-py-sm">Bank Arthaloka</div>
        </q-card-section>

        <div vertical class="q-px-lg q-py-lg">
          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input
              filled
              autofocus
              type="email"
              v-model.trim="form.email"
              label="Email"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Please enter your email address',
              ]"
            />

            <q-input
              filled
              type="password"
              v-model.trim="form.password"
              label="Password"
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Please enter your password',
              ]"
            />
            <q-card-actions align="center">
              <q-btn
                style="width: 100%"
                push
                label="Login"
                type="submit"
                color="primary"
                v-if="!isLoading"
              />

              <q-spinner color="primary" size="3em" v-if="isLoading" />
            </q-card-actions>
          </q-form>
        </div>
      </q-card>
    </div>

    <!-- Dialog Login Failed -->
    <q-dialog v-model="alert">
      <q-card>
        <q-card-section>
          <div class="text-h5 text-nigative">Peringatan</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ dataAlert }}
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-layout>
</template>

<script>
import { ref, reactive, defineComponent } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/auth";

export default defineComponent({
  name: "LoginPage",
  setup() {
    const auth = useAuthStore();
    const router = useRouter();
    const isLoading = ref(false);
    const alert = ref(false);
    const dataAlert = ref("");
    const form = reactive({ email: "", password: "" });
    if (localStorage.accessToken) {
      router.push("/atm_list");
    }
    const onSubmit = () => {
      isLoading.value = true;
      alert.value = false;
      auth.login(form).then((res) => {
        if (res.status === 200) {
          router.push("/atm_list");
        } else if (res.response.status === 401){
          dataAlert.value = "Username atau Password anda salah"
          alert.value = true;
        } else {
          dataAlert.value = "Login failed"
          alert.value = true;
        }
        isLoading.value = false;
      });
    };

    return { form, onSubmit, isLoading, alert, dataAlert };
  },
});
</script>
