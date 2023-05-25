import { getChain } from '@/config'
import { Chain } from '@/config/types'
import { wasmClient } from '@/utils/client/rpc/client'
import { WasmExtension } from '@cosmjs/cosmwasm-stargate'
import { QueryClient } from '@cosmjs/stargate'

class ICS721 {
  private readonly chain: Chain
  private client: (QueryClient & WasmExtension) | null
  constructor() {
    this.chain = getChain()
    this.client = null
  }

  private async setClient(): Promise<QueryClient & WasmExtension> {
    if (!this.client) {
      this.client = await wasmClient(this.chain.rpc)
      return this.client
    }
    return this.client
  }

  public async getContractInfo(address: string) {
    const query = {
      contract_info: {},
    }

    const client = await this.setClient()
    return client.wasm.queryContractSmart(address, query)
  }
}

export default new ICS721()
