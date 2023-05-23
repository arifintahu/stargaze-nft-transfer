export interface Chain {
  readonly chain_id: string
  readonly description: string
  readonly logo: string
  readonly rpc: string
  readonly rest: string
  readonly gas_price: string
}

export interface DestinationChain {
  readonly chain_id: string
  readonly description: string
  readonly logo: string
  readonly port: string
  readonly channel: string
}
