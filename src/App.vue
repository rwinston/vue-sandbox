<template>
  <div id="app">
    <nav>
    <router-link to="/">  
    <div class="navigation__logo">
      Twotter
    </div>
    </router-link>

    <div class="navigation__user" v-if="user">
        {{ user.username }}
    </div>
    </nav>
  </div>
  <router-view />
</template>

<script>
import {useStore} from 'vuex';
import {computed} from 'vue';

export default {
  name: 'App',
  setup() {
    const store = useStore();
    const user = computed(() => store.state.user);
    return {
      user
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
