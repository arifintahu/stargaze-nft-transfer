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
import { useState, useRef, useEffect } from 'react'
import { getChain, getDestinationChains } from '@/config'
import { DestinationChain } from '@/config/types'
import { ChevronDownIcon } from '@chakra-ui/icons'
import SelectSearch, { Option } from '@/components/SelectSearch'
import cw721 from '@/utils/client/rest/contract/cw721'

const options: Option[] = [
  {
    label: 'I am red',
    value: 'i-am-red',
  },
  {
    label: 'I fallback to purple',
    value: 'i-am-purple',
  },
]

export default function Home() {
  const chain = getChain()
  const destChains = getDestinationChains()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const finalRef = useRef(null)

  const [destChain, setDestChain] = useState(destChains[0])
  const [contracts, setContracts] = useState<Option[]>([])

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
    const allContracts = await cw721.getAllContracts()
    const optionContracts: Option[] = allContracts.map((item) => {
      return {
        label: item,
        value: item,
      }
    })

    setContracts(optionContracts)
  }

  const handleSelectContract = (option: Option) => {
    console.log(option)
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
                I want to transfer from {chain.name} NFT contract
              </Text>
              <SelectSearch
                options={contracts}
                onChange={handleSelectContract}
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
              <SelectSearch options={options} onChange={handleSelectContract} />
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
                And receive on IRIS to this destination address
              </Text>
              <Input placeholder="Destination address" border={'none'} />
            </Box>
            <Button colorScheme="stargaze" px={16} w={'full'}>
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
