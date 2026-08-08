import { defineCliConfig } from 'sanity/cli';
import { sanityConfig } from './env';

export default defineCliConfig({
  api: {
    projectId: sanityConfig.projectId || 'otaru-studio',
    dataset: sanityConfig.dataset || 'production',
  },
});
