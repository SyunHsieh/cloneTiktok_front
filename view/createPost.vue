<template>
  <div class="fillDiv createDiv">
    <input @change="inputFileChange" ref="videoReader" class="fileInput" type="file" accept=".mp4" />
    <p class="fileName">{{ file.name }}</p>
    <button class="fileSelBtn" @click="selFileClick">Select File</button>
    <textarea v-model="text" class="postText" type="text" maxlength="200" placeholder="type something..." />
    <button class="postBtn" @click="createPost">Select File</button>
  </div>
</template>

<script>
import sywekAxios from "../src/reference/axiosMsgReaction";

export default {
  name: "createPost",
  data() {
    return {
      text: "",

      file: "",
    };
  },
  methods: {
    async createPost() {
      let _data = new FormData();
      _data.append("file", this.file);
      _data.append("text", this.text);
      await sywekAxios.post(process.env.VUE_APP_API_URL + "/post", _data, {}, true);
    },
    inputFileChange(e) {
      this.file = e.target.files[0];
    },
    selFileClick() {
      this.$refs.videoReader.click();
    },
  },
};
</script>

<style scoped>
.fileName {
  color: lightyellow;
  height: 2rem;
}
.createDiv > * {
  display: block;
  margin: 3rem auto;
}
.fileInput {
  display: none;
}
.postText {
  width: 90%;
  height: 7rem;
  font-size: 1.3rem;
  color: white;
  background-color: #555;
}
.fileSelBtn {
  width: 12rem;
  height: 12rem;

  border-radius: 12rem;

  background-color: #333;
  color: lightskyblue;
  font-size: 1rem;

  margin-top: 5rem;

  border-style: dashed;
  border-color: lightskyblue;
  border-width: 0.5rem;
}
</style>
