import config from './config.json'
import { Chain, DestinationChain } from './types'

export function getChain(): Chain {
  return config.chain
}

export function getDestinationChains(): DestinationChain[] {
  return config.destination_chains
}
