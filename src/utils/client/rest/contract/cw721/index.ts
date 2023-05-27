import { getChain } from '@/config'
import { Chain } from '@/config/types'
import { queryContractsByCodeId } from '@/utils/client/rest/cosmwasm/wasm'

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
}

export default new CW721()
