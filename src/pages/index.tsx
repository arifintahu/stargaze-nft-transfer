import {
  Box,
  Flex,
  Image,
  Text,
  Heading,
  SimpleGrid,
  Select,
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
import { ChevronDownIcon } from '@chakra-ui/icons'

export default function Home() {
  const chain = getChain()
  const destChains = getDestinationChains()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const finalRef = useRef(null)

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
                <Text fontSize={'xs'} mb={2}>
                  From
                </Text>
                <Flex alignItems={'center'} gap={3} p={3}>
                  <Image
                    src={chain.logo}
                    alt={chain.description}
                    w={25}
                    h={25}
                  ></Image>
                  <Text fontWeight={'semibold'}>{chain.description}</Text>
                </Flex>
              </Box>
              <Box borderRadius={'md'} bg={'satellite.500'} px={6} py={3}>
                <Text fontSize={'xs'} mb={2}>
                  To
                </Text>
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
                      src={'/assets/stargaze_star_white.svg'}
                      alt="Stargaze logo"
                      w={25}
                      h={25}
                    ></Image>
                    <Text fontWeight={'semibold'}>Stargaze</Text>
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
                I want to transfer from Stargaze collection
              </Text>
              <Select
                placeholder="Select option"
                border={'none'}
                colorScheme="stargaze"
              >
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </Select>
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
                I want to transfer this NFT
              </Text>
              <Select
                placeholder="Select option"
                border={'none'}
                colorScheme="stargaze"
              >
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </Select>
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
          <ModalBody px={6} py={8}>
            <SimpleGrid columns={2} spacing={10}>
              {destChains.map((chain) => (
                <Flex
                  key={chain.chain_id}
                  alignItems={'center'}
                  gap={3}
                  p={3}
                  borderColor={'whiteAlpha.500'}
                  borderWidth={1}
                  borderRadius={'md'}
                  cursor={'pointer'}
                  _hover={{ bg: 'satellite.100' }}
                >
                  <Image
                    src={chain.logo}
                    alt={chain.description}
                    w={25}
                    h={25}
                  ></Image>
                  <Text fontWeight={'semibold'}>{chain.description}</Text>
                </Flex>
              ))}
            </SimpleGrid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
