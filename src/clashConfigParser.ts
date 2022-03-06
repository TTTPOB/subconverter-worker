import YAML from "yaml"

export function parseClashConfig(sourceConfigText:string): any {
  /* clash config is a yaml string, using yaml module to parse it */
  const parsedConfig = YAML.parse(sourceConfigText)
  /* return all sub object under 'proxies' entry */
  const proxies = parsedConfig.proxies
  return proxies
}

export class ClashConfig{
  origText: string;
  proxies: ClashProxy[];
  constructor(text:string){
    this.origText = text
    this.proxies = YAML.parse(text).proxies
  }
}
export class ClashProxyProvider{
  proxies: ClashProxy[]
  constructor(clashProxies: ClashProxy[]){
      this.proxies = clashProxies
  }
}

export type ClashProxy={
  /* this type does not contain all properties */
  name: string
  type: string
  server: string
  port: number
  cipher: string
  password: string
  udp: boolean|undefined
  plugin: string|undefined
}