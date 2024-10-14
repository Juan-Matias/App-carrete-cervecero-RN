import { createClient } from '@sanity/client';
import imageBuilder from '@sanity/image-url';

const cliente = createClient({
  projectId: 'g0lfxohl',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-08-29',
});

const builder = imageBuilder(cliente);

export const urlFor = source => builder.image(source);

export default cliente;
