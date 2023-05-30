import {
  Box,
  Flex,
  Image,
  Text,
  Heading,
  SimpleGrid,
  Input,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
} from '@chakra-ui/react'
import Head from 'next/head'
import { useState, useRef, useEffect, ChangeEvent, MouseEvent } from 'react'
import { useSelector } from 'react-redux'
import { getChain, getDestinationChains } from '@/config'
import { DestinationChain } from '@/config/types'
import { ChevronDownIcon } from '@chakra-ui/icons'
import SelectSearch, { Option } from '@/components/SelectSearch'
import { selectAddress } from '@/store/accountSlice'
import cw721 from '@/utils/client/rest/contract/cw721'
import { convertAddress } from '@/utils/helpers'
import { SigningClient } from '@/utils/client/rpc/signingclient'

export default function Home() {
  const chain = getChain()
  const destChains = getDestinationChains()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const finalRef = useRef(null)
  const address = useSelector(selectAddress)

  const [destChain, setDestChain] = useState(destChains[0])
  const [contracts, setContracts] = useState<Option[]>([])
  const [contract, setContract] = useState<Option | null>()
  const [tokens, setTokens] = useState<Option[]>([])
  const [token, setToken] = useState<Option | null>()
  const [destAddress, setDestAddress] = useState('')

  const [isLoadingContracts, setIsLoadingContracts] = useState(false)
  const [isLoadingTokens, setIsLoadingTokens] = useState(false)

  const handleDestChain = (chain: DestinationChain) => {
    setDestChain(chain)
    onClose()
  }

  useEffect(() => {
    if (!contracts.length) {
      getAllContracts()
    }
  }, [contracts])

  const getAllContracts = async () => {
    setIsLoadingContracts(true)
    const allContracts = await cw721.getAllContracts()
    const optionContracts: Option[] = allContracts.map((item) => {
      return {
        label: item,
        value: item,
      }
    })
    setIsLoadingContracts(false)
    setContracts(optionContracts)
  }

  useEffect(() => {
    if (destChain && address && token) {
      const converted = convertAddress(address, destChain.address.prefix)
      setDestAddress(converted)
    }
  }, [destChain, address, token])

  const handleSelectContract = async (option: Option) => {
    if (address) {
      setIsLoadingTokens(true)
      setContract(option)
      const result = await cw721.getTokensByOwner(option.value, address)
      const optionTokens: Option[] = result.tokens.map((item) => {
        return {
          label: item,
          value: item,
        }
      })
      setIsLoadingTokens(false)
      setTokens(optionTokens)
      setToken(null)
    } else {
      alert('Please install keplr extension')
    }
  }

  const handleSelectToken = (option: Option) => {
    setToken(option)
  }

  const handleDestAddress = (e: ChangeEvent<HTMLInputElement>) => {
    setDestAddress(e.target.value)
  }

  const handleTransfer = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    console.log(contract, token, destAddress)
    if (window.keplr) {
      await window.keplr.enable(chain.id)
      const offlineSigner = window.keplr.getOfflineSigner(chain.id)
      const accounts = await offlineSigner.getAccounts()
      if (contract?.value && token?.value && destAddress) {
        const client = await SigningClient.connectWithSigner(
          chain.rpc,
          offlineSigner
        )
        const result = await client.wasmSendNFT(
          accounts[0].address,
          chain.contractAddress,
          contract.value,
          token.value,
          destAddress,
          destChain.nftTransfer.channel,
          chain.gasPrice
        )
        console.log(result)
      } else {
        alert('Invalid Form')
      }
    } else {
      alert('Please install keplr extension')
    }
  }

  return (
    <>
      <Head>
        <title>Stargaze | NFT Transfer</title>
        <meta name="description" content="Stargaze | NFT Transfer" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Flex justifyContent={'center'}>
          <Box
            w="full"
            minH={400}
            maxW={600}
            borderRadius={'lg'}
            p={8}
            alignItems={'center'}
            display={'flex'}
            flexDirection={'column'}
            gap={6}
            bg={'satellite.100'}
          >
            <Heading size={'lg'} mb={6}>
              NFT Transfer
            </Heading>
            <SimpleGrid columns={2} spacing={6} w={'full'}>
              <Box borderRadius={'md'} bg={'satellite.500'} px={6} py={3}>
                <Text fontSize={'xs'}>From</Text>
                <Flex alignItems={'center'} gap={3} p={3}>
                  <Image
                    src={chain.logo}
                    alt={chain.name}
                    w={25}
                    h={25}
                  ></Image>
                  <Text fontWeight={'semibold'}>{chain.name}</Text>
                </Flex>
              </Box>
              <Box borderRadius={'md'} bg={'satellite.500'} px={6} py={3}>
                <Text fontSize={'xs'}>To</Text>
                <Flex
                  alignItems={'center'}
                  justifyContent={'space-between'}
                  cursor={'pointer'}
                  _hover={{ bg: 'satellite.100' }}
                  p={3}
                  borderRadius={'md'}
                  onClick={onOpen}
                >
                  <Flex alignItems={'center'} gap={3}>
                    <Image
                      src={destChain.logo}
                      alt={destChain.name}
                      w={25}
                      h={25}
                    ></Image>
                    <Text fontWeight={'semibold'}>{destChain.name}</Text>
                  </Flex>
                  <Flex>
                    <ChevronDownIcon fontSize={'lg'} />
                  </Flex>
                </Flex>
              </Box>
            </SimpleGrid>
            <Box
              borderRadius={'md'}
              bg={'satellite.500'}
              minH={50}
              px={6}
              py={3}
              w={'full'}
            >
              <Text fontSize={'xs'} mb={2}>
                I want to transfer from {chain.name} contract
              </Text>
              <SelectSearch
                options={contracts}
                value={contract}
                onChange={handleSelectContract}
                isLoading={isLoadingContracts}
                placeholder="Select contract address"
              />
            </Box>
            <Box
              borderRadius={'md'}
              bg={'satellite.500'}
              minH={50}
              px={6}
              py={3}
              w={'full'}
            >
              <Text fontSize={'xs'} mb={2}>
                I want to transfer my NFT
              </Text>
              <SelectSearch
                options={tokens}
                value={token}
                onChange={handleSelectToken}
                isLoading={isLoadingTokens}
                placeholder="Select NFT"
              />
            </Box>
            <Box
              borderRadius={'md'}
              bg={'satellite.500'}
              minH={50}
              px={6}
              py={3}
              w={'full'}
            >
              <Text fontSize={'xs'} mb={2}>
                And receive on {destChain.name} to this receiver address
              </Text>
              <Input
                onChange={handleDestAddress}
                value={destAddress}
                placeholder="Receiver address"
                border={'none'}
              />
            </Box>
            <Box
              borderRadius={'md'}
              bg={'satellite.50'}
              px={6}
              py={3}
              w={'full'}
            >
              <Flex justifyContent={'space-between'} fontSize={'sm'} mb={1}>
                <Text>Gas price</Text>
                <Text>{chain.gasPrice}</Text>
              </Flex>
              <Flex justifyContent={'space-between'} fontSize={'sm'} mb={1}>
                <Text>IBC port</Text>
                <Text>{destChain.nftTransfer.port}</Text>
              </Flex>
              <Flex justifyContent={'space-between'} fontSize={'sm'} mb={1}>
                <Text>IBC channel</Text>
                <Text>{destChain.nftTransfer.channel}</Text>
              </Flex>
              <Flex justifyContent={'space-between'} fontSize={'sm'} mb={1}>
                <Text>Destination chain ID</Text>
                <Text>{destChain.id}</Text>
              </Flex>
            </Box>

            <Button
              onClick={handleTransfer}
              colorScheme="stargaze"
              px={16}
              w={'full'}
            >
              Transfer
            </Button>
          </Box>
        </Flex>
      </main>

      <Modal
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        size={'xl'}
      >
        <ModalOverlay bg={'whiteAlpha.500'} />
        <ModalContent bg={'black'} borderRadius={'lg'}>
          <ModalHeader>Select destination chain</ModalHeader>
          <ModalCloseButton />
          <ModalBody px={6} pb={8}>
            <SimpleGrid columns={2} spacing={10}>
              {destChains.map((chain) => (
                <Flex
                  key={chain.id}
                  alignItems={'center'}
                  gap={3}
                  p={3}
                  borderColor={'whiteAlpha.500'}
                  borderWidth={1}
                  borderRadius={'md'}
                  cursor={'pointer'}
                  _hover={{ bg: 'satellite.100' }}
                  onClick={() => handleDestChain(chain)}
                >
                  <Image
                    src={chain.logo}
                    alt={chain.name}
                    w={25}
                    h={25}
                  ></Image>
                  <Text fontWeight={'semibold'}>{chain.name}</Text>
                </Flex>
              ))}
            </SimpleGrid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
