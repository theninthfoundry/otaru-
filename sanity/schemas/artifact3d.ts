import { defineType, defineField } from 'sanity';

export const artifact3d = defineType({
  name: 'artifact3d',
  title: '3D Specimen Asset',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Specimen Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'artifactHandle',
      title: 'Shopify Artifact Handle',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'glbFile',
      title: 'GLB 3D Binary File',
      type: 'file',
      options: {
        accept: '.glb,.gltf',
      },
    }),
    defineField({
      name: 'usdzFile',
      title: 'Apple USDZ AR File',
      type: 'file',
      options: {
        accept: '.usdz',
      },
    }),
    defineField({
      name: 'normalMap',
      title: 'Fabric Weave Normal Map',
      type: 'image',
    }),
    defineField({
      name: 'roughnessMap',
      title: 'Roughness Map',
      type: 'image',
    }),
    defineField({
      name: 'fabricPreset',
      title: 'Fabric Simulation Preset',
      type: 'string',
      options: {
        list: [
          { title: '14.5oz Heavy Selvage Denim', value: 'denim' },
          { title: '18oz Melton Virgin Wool', value: 'wool' },
          { title: 'French Terry Raw Cotton', value: 'cotton' },
        ],
      },
      initialValue: 'denim',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'artifactHandle' },
  },
});
