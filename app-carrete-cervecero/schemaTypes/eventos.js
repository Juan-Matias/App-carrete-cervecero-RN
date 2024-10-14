import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'eventos',
  title: 'Eventos',
  type: 'document',
  fields: [
    {
      name: 'name',
      type: 'string',
      title:'Eventos Name',
      validation: rule => rule.required()
    },
    {
      name: 'description',
      type: 'string',
      title:'Eventos description',
      validation: rule => rule.required()

    },
    {
      name: 'image',
      type: 'image',
      title:'image of the eventos',
    }
 
  ],
})
