<template>
  <div class="fillDiv">
    <h1>Clone Tiktok</h1>
    <input v-model="account" type="text" placeholder="account..." />
    <input v-model="password" type="password" placeholder="password..." />

    <button class="postBtn" @click="Login">{{ "Login" }}</button>
    <a class="hrefClass" @click="$router.push('/register')">Go to Register</a>
  </div>
</template>

<script>
import sywekAxios from "../src/reference/axiosMsgReaction";
export default {
  name: "login",
  data() {
    return {
      account: "",
      password: "",
      userName: "",
      routeName: "",
    };
  },
  methods: {
    async Login() {
      await sywekAxios.post(process.env.VUE_APP_API_URL + "/auth", { account: this.account, password: this.password }, {}, true);
    },
    async resendToken() {
      await sywekAxios.get(process.env.VUE_APP_API_URL + "/auth", {}, true);
    },
  },
  async beforeMount() {
    //set routename to routetype

    this.routeName = this.$route.name;

    if (this.routeName != "register") this.resendToken();
  },
};
</script>

<style scoped>
h1 {
  color: blueviolet;
  margin-top: 3rem;
}

input {
  width: 80%;
  display: block;
  font-size: 1.5rem;
  margin: 3rem auto;
  border-radius: 0.5rem;
  background-color: #222;
  color: wheat;
}
</style>
