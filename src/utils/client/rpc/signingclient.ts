import { Tendermint34Client, WebsocketClient } from '@cosmjs/tendermint-rpc'
import {
  ExecuteResult,
  SigningCosmWasmClient,
  SigningCosmWasmClientOptions,
} from '@cosmjs/cosmwasm-stargate'
import { OfflineSigner, Registry } from '@cosmjs/proto-signing'
import { GasPrice, calculateFee } from '@cosmjs/stargate'
import { getNanoTimestamp } from '@/utils/helpers'

const replaceHTTPtoWebsocket = (url: string): string => {
  return url.replace('http', 'ws')
}

export async function connectWebsocketClient(
  rpcAddress: string
): Promise<Tendermint34Client> {
  const wsUrl = replaceHTTPtoWebsocket(rpcAddress)
  const wsClient = new WebsocketClient(wsUrl)
  const tmClient = await Tendermint34Client.create(wsClient)
  return tmClient
}

export class SigningClient extends SigningCosmWasmClient {
  public static async connectWithSigner(
    endpoint: string,
    signer: OfflineSigner,
    options: SigningCosmWasmClientOptions = {}
  ): Promise<SigningClient> {
    const tmClient = await connectWebsocketClient(endpoint)
    return new SigningClient(tmClient, signer, {
      registry: new Registry(),
      ...options,
    })
  }

  protected constructor(
    tmClient: Tendermint34Client | undefined,
    signer: OfflineSigner,
    options: SigningCosmWasmClientOptions
  ) {
    super(tmClient, signer, options)
  }

  public async wasmSendNFT(
    senderAddress: string,
    contractAddress: string,
    nftContractAddress: string,
    tokenId: string,
    receiverAddress: string,
    channelId: string,
    gasPrice: string,
    gasLimit: number = 200_000
  ): Promise<ExecuteResult> {
    const executeFee = calculateFee(gasLimit, GasPrice.fromString(gasPrice))
    const msgReceiver = {
      receiver: receiverAddress,
      channel_id: channelId,
      timeout: {
        timestamp: getNanoTimestamp(10),
      },
    }

    const msg = {
      send_nft: {
        contract: contractAddress,
        token_id: tokenId,
        msg: btoa(JSON.stringify(msgReceiver)),
      },
    }
    return this.execute(senderAddress, nftContractAddress, msg, executeFee)
  }
}
