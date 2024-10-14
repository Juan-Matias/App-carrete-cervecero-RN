import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'product',
  title: 'Products',
  type: 'document',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Product Name',
      validation: Rule => Rule.required()
    },
    {
      name: 'barrel',
      type: 'string',
      title: 'Barril adicional',
    },
    {
      name: 'barrelPrice',
      type: 'number',
      title: 'Precio del barril adicional',
      validation: Rule => Rule.min(0),
    },
    {
      name: 'price',
      type: 'number',
      title: 'Price',
      validation: Rule => Rule.required().min(0),
    },
    {
      name: 'description',
      type: 'string',
      title: 'Product Description',
    },
    {
      name: 'image',
      type: 'image',
      title: 'Product Image',
    },
  ],
});
