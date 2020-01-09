import axios from '../plugins/axios/axios';

const Methods = {
  methods: {
    async save () {
      console.log('mixin')
      const isValid = this.validateFields(this.editedItem);
      if (isValid) {
        if (this.editedIndex > -1) {
          await this.update(this.editedItem);
        } else {
          await this.create(this.editedItem);
        }
        this.close()
      }
    }
  },
};

export default Methods;
