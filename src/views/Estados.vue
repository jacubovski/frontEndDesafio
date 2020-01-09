<template>
  <v-container>
    <v-card>
      <v-card-text>
         <v-data-table
          :headers="headers"
          :items="estados"
          sort-by="calories"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>Estados</v-toolbar-title>
              <v-divider
                class="mx-4"
                inset
                vertical
              ></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on }">
                  <v-btn color="primary" dark class="mb-2" v-on="on">Novo</v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-text-field 
                        v-model="editedItem.nome"
                        maxlength="25"
                        :hint="hint"
                        label="Nome"
                        ref="nome"
                        ></v-text-field>
                      </v-row>
                      <v-row>
                        <v-text-field 
                        v-model="editedItem.abreviacao" 
                        maxlength="2" 
                        :hint="hint"
                        label="Abreviação"
                        ref="abreviacao"
                        ></v-text-field>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                    <v-btn color="blue darken-1" text @click="save">Salvar</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.action="{ item }">
            <v-icon
              small
              class="mr-2"
              @click="editItem(item)"
            >
              mdi-lead-pencil
            </v-icon>
            <v-icon
              small
              @click="deleteItem(item)"
            >
              mdi-delete
            </v-icon>
          </template>
          <template v-slot:no-data>
              Não há dados disponíveis.
          </template>
          <v-alert slot="no-results" :value="true" color="error" icon="warning">
              Não há dados disponíveis para "{{search}}".
            </v-alert>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from '../plugins/axios/axios';

export default {
    data: () => ({
      dialog: false,
      headers: [
        { text: 'Nome', align: 'left', value: 'nome' },
        { text: 'Abreviação', value: 'abreviacao' },
        { text: 'Criado Em', value: 'createdAt' },
        { text: 'Editado Em', value: 'updatedAt' },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      estados: [],
      editedIndex: -1,
      editedItem: {
        nome: '',
        abreviacao: '',
      },
      defaultItem: {
        nome: '',
        abreviacao: '',
      },
      search:'',
      hint: '',
    }),
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Novo Estado' : 'Editar Estado'
      },
    },
    filters: {
     
    },
    watch: {
      dialog (val) {
        val || this.close()
      },
    },
    created () {
      this.initialize()
    },
    methods: {
      async initialize () {
        try {
          const response = await axios.get('/estados');
          const { estados } = response.data;
          this.estados = this.formatEstados(estados);
        } catch (error) {
          const { msg } = error.response.data;
          this.showSnackBar(`${msg}`, 'danger');
        }
      },
      editItem (item) {
        this.editedIndex = this.estados.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem (item) {
        const index = this.estados.indexOf(item)
        const { nome, _id } = item;
        confirm(`Deseja excluir ${nome}?`) && this.delete(_id, index)
      },
      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },
      save () {
        const isValid = this.validateFields(this.editedItem);
        if (isValid) {
          if (this.editedIndex > -1) {
            this.update(this.editedItem);
          } else {
            this.create(this.editedItem);
          }
          this.close()
        }
      },
      validateFields(payload){
        const { nome, abreviacao } = payload;
        if(!nome) {
          this.hint = 'Campo Obrigatório.'
          this.$refs.nome.focus();
          return false;
        } else if(!abreviacao) {
          this.hint = 'Campo Obrigatório.'
          this.$refs.abreviacao.focus();
          return false;
        }
        else {
          this.hint = '';
          return true;
        }
      },
      async create(payload) {
        try {
          const response = await axios.post('/estados', payload);
          this.showSnackBar('Estado Criado com Sucesso', 'success');
          const { estados } = response.data;
          const [newEstados] = this.formatEstados([estados]);
          this.estados.push(newEstados)
        } catch (error) {
          const { msg } = error.response.data;
          this.showSnackBar(`${msg}`, 'danger');
        }
      },
      async update(payload){
        try {
          const { _id, nome, abreviacao } = payload;
          const response = await axios.put('/estados', {_id, nome, abreviacao});
          const { estado } = response.data;
          const [estadoAtt] = this.formatEstados([estado]);
          Object.assign(this.estados[this.editedIndex], estadoAtt)
        } catch (error) {
          const { msg } = error.response.data;
          this.showSnackBar(`${msg}`, 'danger');
        }
      },
      async delete(_id, index){
        try {
          await axios.delete('/estados', { params: { _id }});
          this.showSnackBar('Estado Deletado com Sucesso', 'success');
          this.estados.splice(index, 1);
        } catch (error) {
          const { msg } = error.response.data;
          this.showSnackBar(`${msg}`, 'danger');
        }
      },
      showSnackBar(text, color){
        this.$store.dispatch('showSnackbar', {
          snackbar: true,
          y: 'right',
          x: '',
          mode: '',
          timeout: 5000,
          text: `${text}`,
          color: `${color}`,
        });
      },
      formatEstados(payload){
        return payload.map(uf  => {
          uf.createdAt = new Date(uf.createdAt).toLocaleString('pt-BR');
          uf.updatedAt = new Date(uf.updatedAt).toLocaleString('pt-BR');
          return uf;
        });
      }
    },
  }
</script>

<style>
</style>