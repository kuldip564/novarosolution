import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '2a50o6hm',
    dataset: 'production'
  },
  studioHost: 'novarosolution',
  deployment: {
    appId: 'z6brgb20xi3abumayqdmxb5n',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  }
})
