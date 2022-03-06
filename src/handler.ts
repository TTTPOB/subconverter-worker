import { parseClashConfig, ClashProxyProvider, ClashConfig, ClashProxy } from "./clashConfigParser"
import YAML from "yaml"

export async function handleRequest(request: Request): Promise<Response> {
  const requestURL = new URL(request.url)
  const path = requestURL.pathname.substring(1)
  if (path === "v1" || path === "v1/") {
    return await handleV1(request)
  } else {
    return new Response(`request path ${path}, the request path is currently not supported, only v1 was supported`)
  }
}

async function fetchSourceConfig(url: string): Promise<string> {
  const response = await fetch(url)
  const text = await response.text()
  return text
}
class HandlerConfig {
  sourceUrl: string
  match: RegExp
  head: number
  constructor(params: URLSearchParams) {
    this.sourceUrl = decodeURIComponent(params.get("sourceUrl") || "")
    const match = params.get("match")
    this.match = new RegExp(decodeURIComponent(match || ""))
    this.head = Number(params.get("head")) || 9999
  }
}


async function handleV1(request: Request): Promise<Response> {
  const params = new URL(request.url).searchParams
  const handlerConfig = new HandlerConfig(params)
  const sourceConfigText = await fetchSourceConfig(handlerConfig.sourceUrl)
  const clashConfig = new ClashConfig(sourceConfigText)
  const proxies = clashConfig.proxies.slice(0, handlerConfig.head)
  const passed = proxies.filter(function (proxy) { if (proxy.name.match(handlerConfig.match)) { return true; } else return false })
  const clashProxyProvider = new ClashProxyProvider(passed)
  const passedString = YAML.stringify(clashProxyProvider)
  return new Response(passedString)
}

