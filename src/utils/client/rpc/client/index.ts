import { QueryClient } from '@cosmjs/stargate'
import { Tendermint34Client } from '@cosmjs/tendermint-rpc'
import { setupWasmExtension, WasmExtension } from '@cosmjs/cosmwasm-stargate'

export async function wasmClient(
  rpc: string
): Promise<QueryClient & WasmExtension> {
  const tmClient = await Tendermint34Client.connect(rpc)
  return QueryClient.withExtensions(tmClient, setupWasmExtension)
}
