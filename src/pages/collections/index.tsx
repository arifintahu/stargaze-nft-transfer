import Head from 'next/head'
import { ChangeEvent, useEffect, useState } from 'react'
import {
  Badge,
  Box,
  Flex,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import cw721 from '@/utils/client/rest/contract/cw721'
import { trimAddress, getCollectionName, isIBC } from '@/utils/helpers'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  SearchIcon,
} from '@chakra-ui/icons'

interface Collection {
  title: string
  contract: string
  type: string
  totalTokens: number
}

const PER_PAGE = 15

export default function Collections() {
  const [contracts, setContracts] = useState<string[]>([])
  const [isLoadingContracts, setIsLoadingContracts] = useState(true)
  const [isLoadingInfo, setIsLoadingInfo] = useState(false)
  const [collections, setCollections] = useState<Collection[]>([])

  const [filteredContracts, setFilteredContracts] = useState<string[]>([])
  const [search, setSearch] = useState('')

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const router = useRouter()

  const getAllContracts = async () => {
    const allContracts = await cw721.getAllContracts()
    setIsLoadingContracts(false)
    setContracts(allContracts)
  }

  const copyAddress = (contract: string) => {
    navigator.clipboard.writeText(contract)
  }

  useEffect(() => {
    if (isLoadingContracts) {
      getAllContracts()
    }
  }, [contracts, isLoadingContracts])

  useEffect(() => {
    const filtered = contracts.filter((contract) => contract.includes(search))
    setFilteredContracts(filtered)
  }, [search, contracts])

  useEffect(() => {
    setTotalPages(Math.ceil(filteredContracts.length / PER_PAGE))
  }, [filteredContracts])

  useEffect(() => {
    const start = (page - 1) * PER_PAGE
    const end = start + PER_PAGE
    const items = filteredContracts.slice(start, end).map((item) => {
      return {
        title: '',
        contract: item,
        type: '',
        totalTokens: 0,
      }
    })
    setCollections(items)
  }, [filteredContracts, page])

  useEffect(() => {
    if (collections.length && !collections[0].title) {
      updateCollections()
    }
  }, [collections])

  const updateCollections = async () => {
    setIsLoadingInfo(true)
    const promiseContractInfos = collections.map(async (item) => {
      return {
        info: await cw721.getContractInfo(item.contract),
        tokens: await cw721.getAllTokens(item.contract),
      }
    })
    const contractInfos = await Promise.all(promiseContractInfos)
    const items = collections.map((item) => {
      const contractInfo = contractInfos.find(
        (val) => val.info.contract === item.contract
      )
      if (contractInfo) {
        return {
          title: getCollectionName(contractInfo.info.name),
          contract: item.contract,
          type: isIBC(contractInfo.info.name) ? 'IBC' : 'Native',
          totalTokens: contractInfo.tokens.tokens.length,
        }
      }
      return item
    })
    setCollections(items)
    setIsLoadingInfo(false)
  }

  const handleClick = (contract: string) => {
    router.push('/collections/' + contract)
  }

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setPage(1)
  }

  return (
    <>
      <Head>
        <title>Stargaze | Collections</title>
        <meta name="description" content="Stargaze | Collections" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Flex alignItems={'center'} flexDirection={'column'} gap={8} mb={16}>
          <Heading size={'lg'} mb={6}>
            Collections
          </Heading>
          <InputGroup borderColor={'transparent'}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              type="text"
              bg={'gray.900'}
              focusBorderColor="stargaze.500"
              _hover={{ borderColor: 'transparent' }}
              placeholder="Search by contract address..."
              onChange={handleSearch}
            />
          </InputGroup>
          {isLoadingContracts ? (
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="stargaze.500"
              size="xl"
            />
          ) : (
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
                        w={500}
                      >
                        <Flex gap={1}>
                          <Text>Title</Text>
                          {isLoadingInfo && (
                            <Spinner
                              thickness="2px"
                              speed="0.85s"
                              emptyColor="gray.200"
                              color="stargaze.500"
                              size="sm"
                            />
                          )}
                        </Flex>
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
                        <Flex gap={1}>
                          <Text>Number NFTs</Text>
                          {isLoadingInfo && (
                            <Spinner
                              thickness="2px"
                              speed="0.85s"
                              emptyColor="gray.200"
                              color="stargaze.500"
                              size="sm"
                            />
                          )}
                        </Flex>
                      </Th>
                      <Th
                        textColor={'stargaze.500'}
                        borderTopWidth={1}
                        borderBottomColor={'gray.500'}
                        borderTopColor={'gray.500'}
                      >
                        <Flex gap={1}>
                          <Text>Type</Text>
                          {isLoadingInfo && (
                            <Spinner
                              thickness="2px"
                              speed="0.85s"
                              emptyColor="gray.200"
                              color="stargaze.500"
                              size="sm"
                            />
                          )}
                        </Flex>
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {collections.map((item) => (
                      <Tr
                        key={item.contract}
                        _hover={{ background: 'gray.800' }}
                        cursor="pointer"
                        onClick={() => handleClick(item.contract)}
                      >
                        <Td borderBottomColor={'gray.500'}>
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
                          {item.title === '' ? '' : item.totalTokens}
                        </Td>
                        <Td borderBottomColor={'gray.500'}>
                          {item.type === 'Native' ? (
                            <Badge
                              background={'stargaze.100'}
                              color={'stargaze.900'}
                            >
                              {item.type}
                            </Badge>
                          ) : (
                            <Badge colorScheme="blue">{item.type}</Badge>
                          )}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
                <Flex justifyContent="space-between" m={4} alignItems="center">
                  <Flex>
                    <Tooltip label="First Page">
                      <IconButton
                        background={'stargaze.500'}
                        color={'white'}
                        _hover={{ background: 'stargaze.700' }}
                        onClick={() => setPage(1)}
                        isDisabled={page === 1}
                        icon={<ArrowLeftIcon h={3} w={3} />}
                        mr={4}
                        aria-label="First Page"
                      />
                    </Tooltip>
                    <Tooltip label="Previous Page">
                      <IconButton
                        background={'stargaze.500'}
                        color={'white'}
                        _hover={{ background: 'stargaze.700' }}
                        onClick={() => setPage(page - 1)}
                        isDisabled={page === 1}
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
                        background={'stargaze.500'}
                        color={'white'}
                        _hover={{ background: 'stargaze.700' }}
                        onClick={() => setPage(page + 1)}
                        isDisabled={page === totalPages}
                        icon={<ChevronRightIcon h={6} w={6} />}
                        aria-label="Next Page"
                      />
                    </Tooltip>
                    <Tooltip label="Last Page">
                      <IconButton
                        background={'stargaze.500'}
                        color={'white'}
                        _hover={{ background: 'stargaze.700' }}
                        onClick={() => setPage(totalPages)}
                        isDisabled={page === totalPages}
                        icon={<ArrowRightIcon h={3} w={3} />}
                        ml={4}
                        aria-label="Last Page"
                      />
                    </Tooltip>
                  </Flex>
                </Flex>
              </TableContainer>
            </Box>
          )}
        </Flex>
      </main>
    </>
  )
}
