<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Bank Arthaloka </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="250"
      :breakpoint="700"
    >
      <q-scroll-area
        style="
          height: calc(100% - 100px);
          margin-top: 100px;
          border-right: 1px solid #ddd;
        "
      >
        <q-list padding>
          <EssentialLink
            v-for="link in essentialLinks"
            :key="link.title"
            v-bind="link"
          />
        </q-list>
      </q-scroll-area>

      <q-img
        class="absolute-top"
        src="https://cdn.quasar.dev/img/material.png"
        style="height: 100px"
      >
        <div class="absolute-bottom bg-transparent">
          <div class="text-weight-bold">{{ user.name }}</div>
          <q-btn color="deep-orange" label="Logout" size="11px" @click="Logout" />
        </div>
      </q-img>
    </q-drawer>

    <q-page-container>
      <keep-alive>
        <router-view />
      </keep-alive>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { useAuthStore } from 'src/stores/auth'
import { useRouter } from 'vue-router'

const linksList = [
{
    title: "ATM",
    icon: "atm",
    link: "#/atm_list",
  },
  {
    title: "Customers",
    icon: "people",
    link: "#/users",
  },
  {
    title: "Riwayat",
    icon: "history",
    link: "#/riwayat",
  }
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {
    const auth = useAuthStore()
    const router = useRouter()
    const leftDrawerOpen = ref(false)

    const user = auth.dataUser
    const Logout = () => {
      auth.logout()
      router.push("/login")
    }

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      Logout,
      user
    }
  }
})
</script>
