<template>
  <v-content>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Login Desafio Zoox</v-toolbar-title>
              <v-spacer />
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field label="E-mail" name="login" type="text"  v-model="user.email"/>
                <v-text-field
                  id="password"
                  label="Password"
                  name="password"
                  type="password"
                  v-model="user.password"
                />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" @click="login">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>
<script>
import axios from '../plugins/axios/axios';
export default {
  props: {
    source: String
  },
  data(){
    return {
      user: {
        email: '',
        password: '',
      }
   }
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('/auth/authenticate',this.user)
        const { token } = response.data;
        if (token) {
          sessionStorage.setItem('token',token)
          this.$store.dispatch('setLogin', true);
          this.$router.push({name: 'home'});
        }
      } catch (error) {
        const { msg } = error.response.data;
          this.showSnackBar(`${msg}`, 'danger');
      }
    }
  }
};
</script>

<style>
</style>