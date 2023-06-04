import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectAddress } from '@/store/accountSlice'
import {
  Box,
  Flex,
  Heading,
  IconButton,
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
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  CheckIcon,
} from '@chakra-ui/icons'
import { trimAddress } from '@/utils/helpers'

interface NFT {
  id: string
  owner: string
  uri: string
}

const PER_PAGE = 10

export default function Collections() {
  const address = useSelector(selectAddress)

  const [tokens, setTokens] = useState<string[]>([])
  const [isLoadingTokens, setIsLoadingTokens] = useState(true)
  const [nfts, setNFTs] = useState<NFT[]>([])

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const router = useRouter()
  const { id } = router.query

  const getAllTokens = async (contractAddress: string) => {
    const allTokens = await cw721.getAllTokens(contractAddress)
    setIsLoadingTokens(false)
    setTokens(allTokens.tokens)
  }

  const copyAddress = (contract: string) => {
    navigator.clipboard.writeText(contract)
  }

  useEffect(() => {
    if (isLoadingTokens && id) {
      getAllTokens(id as string)
    }
  }, [isLoadingTokens, id])

  useEffect(() => {
    if (tokens.length) {
      setTotalPages(Math.ceil(tokens.length / PER_PAGE))
    }
  }, [tokens])

  useEffect(() => {
    if (tokens.length) {
      const start = (page - 1) * PER_PAGE
      const end = start + PER_PAGE
      const items = tokens.slice(start, end).map((item) => {
        return {
          id: item,
          owner: '',
          uri: '',
        }
      })
      setNFTs(items)
    }
  }, [tokens, page])

  useEffect(() => {
    if (nfts.length && !nfts[0].owner) {
      updateNFTs()
    }
  }, [nfts])

  const updateNFTs = async () => {
    const promiseInfos = nfts.map((item) =>
      cw721.getAllNFTInfo(id as string, item.id)
    )
    const infos = await Promise.all(promiseInfos)
    const items = nfts.map((item) => {
      const info = infos.find((info) => info.id === item.id)
      if (info) {
        return {
          id: item.id,
          owner: info.access.owner,
          uri: info.info.token_uri,
        }
      }
      return item
    })
    setNFTs(items)
  }

  return (
    <>
      <Head>
        <title>Stargaze | Detail Collection</title>
        <meta name="description" content="Stargaze | Detail Collection" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Flex alignItems={'center'} flexDirection={'column'} gap={8}>
          <Heading size={'lg'}>Detail Collection</Heading>
          {isLoadingTokens ? (
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
                        w={400}
                      >
                        NFT ID
                      </Th>
                      <Th
                        textColor={'stargaze.500'}
                        borderTopWidth={1}
                        borderBottomColor={'gray.500'}
                        borderTopColor={'gray.500'}
                      >
                        Owner
                      </Th>
                      <Th
                        textColor={'stargaze.500'}
                        borderTopWidth={1}
                        borderBottomColor={'gray.500'}
                        borderTopColor={'gray.500'}
                      >
                        URI
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {nfts.map((item) => (
                      <Tr key={item.id}>
                        <Td borderBottomColor={'gray.500'}>
                          <Flex alignItems={'center'} gap={3}>
                            <Text>{item.id}</Text>
                            {item.owner !== '' && item.owner === address && (
                              <Tooltip label="Owned">
                                <CheckIcon color={'green'} />
                              </Tooltip>
                            )}
                          </Flex>
                        </Td>
                        <Td borderBottomColor={'gray.500'}>
                          {
                            <Flex alignItems={'center'}>
                              <Text w={40}>
                                {trimAddress(item.owner, 5, 6)}
                              </Text>
                              <IconButton
                                size={'sm'}
                                variant={'ghost'}
                                aria-label="Copy Address"
                                _hover={{ background: 'gray.900' }}
                                icon={<CopyIcon />}
                                onClick={() => copyAddress(item.owner)}
                              />
                            </Flex>
                          }
                        </Td>
                        <Td borderBottomColor={'gray.500'}>
                          {
                            <Flex alignItems={'center'}>
                              <Text w={60}>
                                {item.uri && item.uri.length > 30
                                  ? item.uri.slice(0, 27) + '...'
                                  : item.uri}
                              </Text>
                              {item.uri && (
                                <IconButton
                                  size={'sm'}
                                  variant={'ghost'}
                                  aria-label="Copy URI"
                                  _hover={{ background: 'gray.900' }}
                                  icon={<CopyIcon />}
                                  onClick={() => copyAddress(item.uri)}
                                />
                              )}
                            </Flex>
                          }
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
