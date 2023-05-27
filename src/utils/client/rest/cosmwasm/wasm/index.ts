import request from '@/utils/request'
import { getChain } from '@/config'
import { Pagination, QueryPagination } from '../../types'

export interface ContractsByCodeIdResponse {
  contracts: string[]
  pagination: Pagination
}
export async function queryContractsByCodeId(
  restUrl: string,
  codeId: number,
  pagination?: QueryPagination
): Promise<ContractsByCodeIdResponse> {
  const path = `/cosmwasm/wasm/v1/code/${codeId}/contracts`
  const query = {
    'pagination.offset': pagination?.offset ?? 0,
    'pagination.limit': pagination?.limit ?? 10,
    'pagination.count_total': pagination?.countTotal ?? true,
  }
  const response: ContractsByCodeIdResponse = await request.get(
    restUrl,
    path,
    query
  )
  return response
}
