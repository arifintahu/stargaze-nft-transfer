import { bech32, bech32m } from 'bech32'
import { Coin } from '@/config/types'
import { Balance } from '@/utils/client/rest/cosmos/bank'
import { getChain } from '@/config'

export const trimAddress = (
  address: string,
  start: number = 2,
  end: number = 5
): string => {
  const indexPrefix = address.indexOf('1')
  const first = address.slice(0, indexPrefix + start)
  const last = address.slice(address.length - end, address.length)
  return first + '...' + last
}

export const showBalance = (balances: Balance[], coin: Coin) => {
  const balance = balances.find((item) => item.denom === coin.minimalDenom)
  if (!balance) {
    return `0 ${coin.denom}`
  }

  const convertToDenom =
    Math.floor((balance.amount * 100) / 10 ** coin.decimals) / 100
  return `${convertToDenom.toLocaleString()} ${coin.denom}`
}

export const convertAddress = (
  address: string,
  toPrefix: string,
  isToETH: boolean = false
): string => {
  const decoded = bech32.decode(address)
  if (isToETH) {
    return bech32m.encode(toPrefix, decoded.words)
  } else {
    return bech32.encode(toPrefix, decoded.words)
  }
}

export const getNanoTimestamp = (minutes: number): string => {
  const timestamp = new Date().getTime() + minutes * 60
  const nanoTimestamp = timestamp * 10 ** 6
  return nanoTimestamp.toString()
}

export const getCollectionName = (name: string): string => {
  const arr = name.split('/')
  if (!arr.length) {
    return ''
  }

  return arr[arr.length - 1]
}

export const isIBC = (name: string): boolean => {
  const chain = getChain()
  if (name.startsWith(`wasm.${chain.contractAddress}`)) {
    return true
  }

  return false
}
