<template>
  <div class="fillDiv">
    <h1>Clone Tiktok Register</h1>
    <input v-model="account" type="text" placeholder="account..." />
    <input v-model="password" type="password" placeholder="password..." />
    <input v-model="userName" type="text" placeholder="user name..." />
    <button class="postBtn" @click="Register">{{ "Register" }}</button>
    <a class="hrefClass" @click="$router.push('/login')">Go to Login</a>
  </div>
</template>

<script>
import sywekAxios from "../src/reference/axiosMsgReaction";
export default {
  name: "register",
  data() {
    return {
      account: "",
      password: "",
      userName: "",
    };
  },
  methods: {
    async Register() {
      await sywekAxios.post(process.env.VUE_APP_API_URL + "/user", { account: this.account, password: this.password, name: this.userName }, {}, true);
    },
  },
};
</script>

<style scoped>
h1 {
  color: blueviolet;
  margin-top: 3rem;
}
.loginDiv {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: #333;
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

button {
  width: 60%;
  font-size: 1.2rem;
  background-color: #777;
  color: seashell;
  border-radius: 1rem;
}
</style>
