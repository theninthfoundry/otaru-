import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';
import { sanityConfig } from './env';

export default defineConfig({
  name: 'otaru',
  title: 'Otaru Studio',
  basePath: '/admin/studio',

  projectId: sanityConfig.projectId || 'otaru-studio',
  dataset: sanityConfig.dataset || 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Singletons
            S.listItem()
              .title('Site Settings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings'),
              ),
            S.listItem()
              .title('Studio Page')
              .child(
                S.document()
                  .schemaType('studioPage')
                  .documentId('studioPage'),
              ),
            S.divider(),
            // Documents
            S.documentTypeListItem('chapter').title('Chapters'),
            S.documentTypeListItem('journal').title('Journal'),
            S.documentTypeListItem('symbol').title('Symbols'),
            S.documentTypeListItem('materialSpec').title('Materials'),
          ]),
    }),
    visionTool({ defaultApiVersion: sanityConfig.apiVersion }),
  ],

  schema: {
    types: schemaTypes,
  },
});
