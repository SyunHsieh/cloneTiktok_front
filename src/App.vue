<template>
  <div id="app">
    <router-view :key="$route.fullpath" />
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
};
</script>

<style>
/* * {
  -webkit-overflow-scrolling: auto;

  overscroll-behavior: unset;
} */
button {
  outline: none;
}

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  display: block;
  overflow-y: hidden;
}
body {
  overflow-y: scroll !important;
  height: 100vh;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.fillDiv {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: #333;
}
.postBtn {
  width: 60%;
  font-size: 1.2rem;
  background-color: #777;
  color: seashell;
  border-radius: 1rem;
}
svg {
  pointer-events: none;
}
.hrefClass {
  color: lightskyblue;
  display: block;
  margin-top: 6rem;
}
::-webkit-scrollbar {
  width: 0px;
  background: transparent; /* make scrollbar transparent */
}
</style>
