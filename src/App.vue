<template>
  <div id="app">
    <div class="topbar">
      <button class="searchBtn">
        <svg
          class="toolIcon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g data-name="Layer 2">
            <g data-name="search">
              <rect width="24" height="24" opacity="0" />
              <path
                d="M20.71 19.29l-3.4-3.39A7.92 7.92 0 0 0 19 11a8 8 0 1 0-8 8 7.92 7.92 0 0 0 4.9-1.69l3.39 3.4a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42zM5 11a6 6 0 1 1 6 6 6 6 0 0 1-6-6z"
              />
            </g>
          </g>
        </svg>
      </button>
    </div>
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
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  display: block;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.topbar {
  position: fixed;
  top: 0;
  right: 1rem;
  z-index: 100;
}

.searchBtn {
  width: 3rem;
  height: 3rem;
  outline: none;
  align-items: center;
  border: none;
  color: white;
  font-size: 0.8rem;
  background: transparent;
  margin-top: 0.5rem;
}
</style>
