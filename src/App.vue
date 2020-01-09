<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
      v-if="login"
    >
      <v-list dense>
        <v-list-item link>
          <v-list-item-content @click="$router.push({name:'estados.index'}).catch(err => {})">
            <v-list-item-title>Estados</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-content @click="$router.push({name:'cidades.index'}).catch(err => {})">
            <v-list-item-title>Cidades</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="indigo"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"  v-if="login"/>
      <v-toolbar-title>Desafio Zoox</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="white" text @click="logout" v-if="login">Sair</v-btn>
    </v-app-bar>
    {{snakeBar}}
    <v-content>
        <router-view></router-view>
    </v-content>
    <v-snackbar
     v-model="snakeBar.snackbar"
     top="top"
     :multi-line="snakeBar.mode"
     right="right"
     :timeout="snakeBar.timeout"
     :color="snakeBar.color"
     :vertical="snakeBar.mode === 'vertical'"
     >
      {{ snakeBar.text }}
      <v-btn color="white" text @click="snakeBar.snackbar = false">
        x
      </v-btn>
    </v-snackbar>
    <v-footer
      color="indigo"
      app
    >
      <span class="white--text">&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
  import { mapState } from 'vuex';
  export default {
    props: {
      source: String,
    },
    data: () => ({
      drawer: true,
    }),
    computed: {
    ...mapState([ 'snakeBar', 'login' ]),
    },
    methods: {
      logout() {
        sessionStorage.removeItem('token');
        if(!sessionStorage.getItem('token')) {
          this.$store.dispatch('setLogin', false);
          this.$router.push({name: 'login'});
        }
      }
    },
    mounted(){
      const token = sessionStorage.getItem('token');
      if(token) {
        this.$store.dispatch('setLogin', true);
      } else {
        this.$store.dispatch('setLogin', false);
        this.$router.push({name: 'login'});    
      }
    }
  }
</script>