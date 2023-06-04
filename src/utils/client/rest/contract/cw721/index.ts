import { getChain } from '@/config'
import { Chain } from '@/config/types'
import {
  queryContractsByCodeId,
  querySmartContractState,
} from '@/utils/client/rest/cosmwasm/wasm'

interface Tokens {
  tokens: string[]
}

interface ContractInfo {
  name: string
  symbol: string
  contract?: string
}

class CW721 {
  private readonly chain: Chain
  constructor() {
    this.chain = getChain()
  }

  private async getAllContractsTotal(): Promise<number> {
    const response = await queryContractsByCodeId(
      this.chain.rest,
      this.chain.cw721BaseCodeId
    )
    return response.pagination.total
  }

  public async getAllContracts(): Promise<string[]> {
    const total = await this.getAllContractsTotal()
    const perPage = 1000
    const totalPages = Math.ceil(total / perPage)

    const contracts = []
    for (const index of Array.from(Array(totalPages).keys())) {
      const offset = index * perPage
      const response = await queryContractsByCodeId(
        this.chain.rest,
        this.chain.cw721BaseCodeId,
        {
          offset: offset,
          limit: perPage,
          countTotal: false,
        }
      )
      contracts.push(...response.contracts)
    }
    return contracts
  }

  public async getTokensByOwner(
    contractAddress: string,
    owner: string
  ): Promise<Tokens> {
    const query = {
      tokens: {
        owner: owner,
      },
    }
    const queryData = btoa(JSON.stringify(query))
    const response: { data: Tokens } = await querySmartContractState(
      this.chain.rest,
      contractAddress,
      queryData
    )

    return response.data
  }

  public async getContractInfo(contractAddress: string): Promise<ContractInfo> {
    const query = {
      contract_info: {},
    }
    const queryData = btoa(JSON.stringify(query))
    const response: { data: ContractInfo } = await querySmartContractState(
      this.chain.rest,
      contractAddress,
      queryData
    )

    return {
      ...response.data,
      contract: contractAddress,
    }
  }
}

export default new CW721()
