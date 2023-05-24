export interface Coin {
  readonly denom: string
  readonly minimalDenom: string
  readonly decimals: number
}

export interface Chain {
  readonly id: string
  readonly name: string
  readonly logo: string
  readonly rpc: string
  readonly rest: string
  readonly gasPrice: string
  readonly coin: Coin
}

export interface NftTransfer {
  readonly port: string
  readonly channel: string
}

export interface DestinationChain {
  readonly id: string
  readonly name: string
  readonly logo: string
  readonly nftTransfer: NftTransfer
}
