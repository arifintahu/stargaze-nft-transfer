import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectAddress } from '@/store/accountSlice'
import {
  Badge,
  Box,
  Flex,
  Heading,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useToast,
} from '@chakra-ui/react'
import cw721 from '@/utils/client/rest/contract/cw721'
import { trimAddress } from '@/utils/helpers'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
} from '@chakra-ui/icons'

interface Collection {
  title: string
  contract: string
  type: string
}

const PER_PAGE = 20

export default function Collections() {
  const address = useSelector(selectAddress)
  const toast = useToast()

  const [contracts, setContracts] = useState<string[]>([])
  const [isLoadingContracts, setIsLoadingContracts] = useState(false)
  const [collections, setCollections] = useState<Collection[]>([])

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const getAllContracts = async () => {
    setIsLoadingContracts(true)
    const allContracts = await cw721.getAllContracts()
    setIsLoadingContracts(false)
    setContracts(allContracts)
  }

  const copyAddress = (contract: string) => {
    navigator.clipboard.writeText(contract)
  }

  useEffect(() => {
    if (!contracts.length) {
      getAllContracts()
    } else {
      setTotalPages(Math.ceil(contracts.length / PER_PAGE))
    }
  }, [contracts])

  useEffect(() => {
    if (!collections.length) {
      contracts.slice(0, PER_PAGE).map((item) => {
        setCollections((prevValue) => [
          ...prevValue,
          {
            title: item,
            contract: item,
            type: 'IBC',
          },
        ])
      })
    }
  }, [contracts, collections])

  return (
    <>
      <Head>
        <title>Stargaze | Collections</title>
        <meta name="description" content="Stargaze | Collections" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Flex alignItems={'center'} flexDirection={'column'} gap={8}>
          <Heading size={'lg'} mb={6}>
            Collections
          </Heading>
          <Box w={'full'}>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th
                      textColor={'stargaze.500'}
                      borderTopWidth={1}
                      borderBottomColor={'gray.500'}
                      borderTopColor={'gray.500'}
                    >
                      Title
                    </Th>
                    <Th
                      textColor={'stargaze.500'}
                      borderTopWidth={1}
                      borderBottomColor={'gray.500'}
                      borderTopColor={'gray.500'}
                    >
                      Contract
                    </Th>
                    <Th
                      textColor={'stargaze.500'}
                      borderTopWidth={1}
                      borderBottomColor={'gray.500'}
                      borderTopColor={'gray.500'}
                    >
                      Type
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {collections.map((item) => (
                    <Tr key={item.contract}>
                      <Td borderBottomColor={'gray.500'} maxW={200}>
                        {item.title.length > 55
                          ? item.title.slice(0, 52) + '...'
                          : item.title}
                      </Td>
                      <Td borderBottomColor={'gray.500'}>
                        {
                          <Flex alignItems={'center'}>
                            <Text w={40}>
                              {trimAddress(item.contract, 5, 6)}
                            </Text>
                            <IconButton
                              size={'sm'}
                              variant={'ghost'}
                              aria-label="Copy Address"
                              _hover={{ background: 'gray.900' }}
                              icon={<CopyIcon />}
                              onClick={() => copyAddress(item.contract)}
                            />
                          </Flex>
                        }
                      </Td>
                      <Td borderBottomColor={'gray.500'}>
                        <Badge colorScheme="stargaze">{item.type}</Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              <Flex justifyContent="space-between" m={4} alignItems="center">
                <Flex>
                  <Tooltip label="First Page">
                    <IconButton
                      colorScheme="stargaze"
                      onClick={console.log}
                      isDisabled={true}
                      icon={<ArrowLeftIcon h={3} w={3} />}
                      mr={4}
                      aria-label="First Page"
                    />
                  </Tooltip>
                  <Tooltip label="Previous Page">
                    <IconButton
                      colorScheme="stargaze"
                      onClick={console.log}
                      isDisabled={true}
                      icon={<ChevronLeftIcon h={6} w={6} />}
                      aria-label="Previous Page"
                    />
                  </Tooltip>
                </Flex>

                <Flex alignItems="center">
                  <Text flexShrink="0" mr={8}>
                    Page{' '}
                    <Text fontWeight="bold" as="span">
                      {page}
                    </Text>{' '}
                    of{' '}
                    <Text fontWeight="bold" as="span">
                      {totalPages}
                    </Text>
                  </Text>
                </Flex>

                <Flex>
                  <Tooltip label="Next Page">
                    <IconButton
                      colorScheme="stargaze"
                      onClick={console.log}
                      isDisabled={true}
                      icon={<ChevronRightIcon h={6} w={6} />}
                      aria-label="Next Page"
                    />
                  </Tooltip>
                  <Tooltip label="Last Page">
                    <IconButton
                      colorScheme="stargaze"
                      onClick={console.log}
                      isDisabled={true}
                      icon={<ArrowRightIcon h={3} w={3} />}
                      ml={4}
                      aria-label="Last Page"
                    />
                  </Tooltip>
                </Flex>
              </Flex>
            </TableContainer>
          </Box>
        </Flex>
      </main>
    </>
  )
}
