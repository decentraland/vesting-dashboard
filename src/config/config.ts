import { Env, createConfig } from '@dcl/ui-env'
import dev from './env/dev.json'
import prod from './env/prod.json'
import stg from './env/stg.json'

export const config = createConfig({
  [Env.DEVELOPMENT as string]: dev,
  [Env.STAGING as string]: stg,
  [Env.PRODUCTION as string]: prod,
})
