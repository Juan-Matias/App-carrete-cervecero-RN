import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'comuna',
  title: 'Comuna',
  type: 'document',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Nombre de la Comuna',
      validation: (Rule) => Rule.required().error('El nombre de la comuna es obligatorio'),
    },
  ],
});
