import { Coin } from '@/config/types'
import { Balance } from '@/utils/client/rest/cosmos/bank'

export const trimAddress = (address: string): string => {
  const indexPrefix = address.indexOf('1')
  const first = address.slice(0, indexPrefix + 2)
  const last = address.slice(address.length - 5, address.length)
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
