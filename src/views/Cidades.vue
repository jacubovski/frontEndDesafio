<template>
  <v-container>
    <v-card>
      <v-card-text>
       
         <v-data-table
          :headers="headers"
          :items="cidades"
          :search="search"
          sort-by="calories"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>Cidades</v-toolbar-title>
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
                        <v-col class="d-flex" cols="12" sm="6" lg="6" md="6">
                          <v-text-field 
                          v-model="editedItem.nome"
                          maxlength="25"
                          :hint="hint"
                          label="Nome"
                          ref="nome"
                          ></v-text-field>  
                        </v-col>
                        <v-col class="d-flex" cols="12" sm="6" lg="6" md="6">
                          <v-select
                          :items="estados"
                          v-model="editedItem.estadoId"
                          label="Estados"
                          ref="estados"
                          ></v-select>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                    <v-btn color="blue darken-1" text @click="save">{{buttonTitle}}</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
            <v-row>
              <v-spacer></v-spacer>
              <v-col xs="12" sm="12" md="6" lg="6">
                <v-text-field
                v-model="search"
                label="Filtrar"
                single-line
                hide-details
                ></v-text-field>
              </v-col>
            </v-row>
          </template>
          <template v-slot:item.action="{ item }">
            <v-icon
              class="mr-2"
              @click="editItem(item)"
            >
              mdi-lead-pencil
            </v-icon>
            <v-icon
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
        { text: 'Estado', value: 'estado' },
        { text: 'Criado Em', value: 'createdAt' },
        { text: 'Editado Em', value: 'updatedAt' },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      cidades: [],
      estados: [],
      editedIndex: -1,
      editedItem: {
        _id: '',
        nome: '',
        estadoId: '',
      },
      defaultItem: {
        nome: '',
        estadoId: '',
      },
      search:'',
      hint: '',
    }),
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nova Cidade' : 'Editar Cidade'
      },
      buttonTitle () {
        return this.editedIndex === -1 ? 'salvar' : 'atualizar'
      },
    },
    watch: {
      dialog (val) {
        val || this.close()
      },
    },
    methods: {
      async initialize () {
        try {
          const response = await axios.get('/cidades');
          const est = await axios.get('/estados');
          const { estados } = est.data;
          const { cidades } = response.data;
          const cidade = cidades.map(it => ({
            _id: it._id,
            nome: it.nome,
            estado: it.estadoId ? it.estadoId.nome : '',
            _estado: it.estadoId,
            createdAt: new Date(it.createdAt).toLocaleString('pt-BR'),
            updatedAt: new Date(it.updatedAt).toLocaleString('pt-BR'),
          }));
          this.estados = estados.map(it => ({
            text: `${it.nome} - ${it.abreviacao}`,
            value: it._id
          }));
          this.cidades = cidade;
        } catch (error) {
          const { msg } = error.response.data;
          this.showSnackBar(`${msg}`, 'danger');
        }
      },
      editItem (item) {
        this.editedIndex = this.cidades.indexOf(item)
        this.editedItem = Object.assign({}, {
          _id: item._id,
          nome: item.nome,
          estadoId: item._estado ? item._estado._id : ''
        })
        this.dialog = true
      },
      deleteItem (item) {
        const index = this.cidades.indexOf(item)
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
        const { nome, estadoId } = payload;
        if(!nome) {
          this.hint = 'Campo Obrigatório.'
          this.$refs.nome.focus();
          return false;
        } else if(!estadoId) {
          this.hint = 'Campo Obrigatório.'
          this.$refs.estado.focus();
          return false;
        }
        else {
          this.hint = '';
          return true;
        }
      },
      async create(payload) {
        try {
          const response = await axios.post('/cidades', payload);
          this.showSnackBar('Cidade Criada com Sucesso', 'success');
          const [newCidadess] = this.formatCidades([response.data.cidade]);
          this.cidades.push(newCidadess)
        } catch (error) {
          const { msg } = error.response.data;
          this.showSnackBar(`${msg}`, 'danger')
        }
      },
      async update(payload){
        try {
          const { _id, nome, estado, estadoId } = payload;
          const response = await axios.put('/cidades', {_id, nome, estadoId});
          const { cidade } = response.data;
          const [cidadeAtt] = this.formatCidades([cidade]);
          Object.assign(this.cidades[this.editedIndex], cidadeAtt)
        } catch (error) {
          const { msg } = error.response.data;
          this.showSnackBar(`${msg}`, 'danger')
        }
      },
      async delete(_id, index){
        try {
          await axios.delete('/cidades', { params: { _id }});
          this.showSnackBar('Cidade Deletada com Sucesso', 'success');
          this.cidades.splice(index, 1);
        } catch (error) {
          const { msg } = error.response.data;
          this.showSnackBar(`${msg}`, 'danger')
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
      formatCidades(payload){
        return payload.map(uf  => {
          uf.estado = uf.estadoId.nome;
          uf.createdAt = new Date(uf.createdAt).toLocaleString('pt-BR');
          uf.updatedAt = new Date(uf.updatedAt).toLocaleString('pt-BR');
          return uf;
        });
      }
    },
    created () {
      this.initialize()
    }
  }
</script>

<style>
</style>