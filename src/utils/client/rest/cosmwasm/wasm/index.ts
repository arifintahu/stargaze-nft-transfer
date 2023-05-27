import request from '@/utils/request'
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

export interface SmartContractStateResponse {
  data: any
}
export async function querySmartContractState(
  restUrl: string,
  contractAddress: string,
  queryData: string
): Promise<SmartContractStateResponse> {
  const path = `/cosmwasm/wasm/v1/contract/${contractAddress}/smart/${queryData}`
  const response: SmartContractStateResponse = await request.get(restUrl, path)
  return response
}
