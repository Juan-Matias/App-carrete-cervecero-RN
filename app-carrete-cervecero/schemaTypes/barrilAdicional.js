import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'barrilAdicional',
  title: 'Barril Adicional',
  type: 'document',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Nombre del Barril Adicional',
      validation: (Rule) => Rule.required().error('El nombre del barril adicional es obligatorio'),
    },
    {
      name: 'price',
      type: 'number',
      title: 'Precio',
      validation: (Rule) => Rule.required().min(0).error('El precio es obligatorio y debe ser mayor o igual a 0'),
    },
  ],
});
