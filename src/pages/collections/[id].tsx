import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectAddress } from '@/store/accountSlice'
import {
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
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import cw721 from '@/utils/client/rest/contract/cw721'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons'

interface NFT {
  title: string
  id: string
  owner: string
}

const PER_PAGE = 15

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
          title: '',
          id: item,
          owner: '',
        }
      })
      setNFTs(items)
    }
  }, [tokens, page])

  //   useEffect(() => {
  //     if (collections.length && !collections[0].title) {
  //       updateCollections()
  //     }
  //   }, [collections])

  //   const updateCollections = async () => {
  //     const promiseInfos = collections.map((item) =>
  //       cw721.getContractInfo(item.contract)
  //     )
  //     const infos = await Promise.all(promiseInfos)
  //     const items = collections.map((item) => {
  //       const info = infos.find((info) => info.contract === item.contract)
  //       if (info) {
  //         return {
  //           title: getCollectionName(info.name),
  //           contract: item.contract,
  //           type: isIBC(info.name) ? 'IBC' : 'Native',
  //         }
  //       }
  //       return item
  //     })
  //     setCollections(items)
  //   }

  return (
    <>
      <Head>
        <title>Stargaze | List NFTs</title>
        <meta name="description" content="Stargaze | List NFTs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Flex alignItems={'center'} flexDirection={'column'} gap={8}>
          <Heading size={'lg'}>List NFTs</Heading>
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
                      NFT Title
                    </Th>
                    <Th
                      textColor={'stargaze.500'}
                      borderTopWidth={1}
                      borderBottomColor={'gray.500'}
                      borderTopColor={'gray.500'}
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
                  </Tr>
                </Thead>
                <Tbody>
                  {nfts.map((item) => (
                    <Tr key={item.id}>
                      <Td borderBottomColor={'gray.500'}>
                        {item.title.length > 55
                          ? item.title.slice(0, 52) + '...'
                          : item.title}
                      </Td>
                      <Td borderBottomColor={'gray.500'}>
                        <Text w={40}>{item.id}</Text>
                      </Td>
                      <Td borderBottomColor={'gray.500'}>{item.owner}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              <Flex justifyContent="space-between" m={4} alignItems="center">
                <Flex>
                  <Tooltip label="First Page">
                    <IconButton
                      colorScheme="stargaze"
                      onClick={() => setPage(1)}
                      isDisabled={page === 1}
                      icon={<ArrowLeftIcon h={3} w={3} />}
                      mr={4}
                      aria-label="First Page"
                    />
                  </Tooltip>
                  <Tooltip label="Previous Page">
                    <IconButton
                      colorScheme="stargaze"
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
                      colorScheme="stargaze"
                      onClick={() => setPage(page + 1)}
                      isDisabled={page === totalPages}
                      icon={<ChevronRightIcon h={6} w={6} />}
                      aria-label="Next Page"
                    />
                  </Tooltip>
                  <Tooltip label="Last Page">
                    <IconButton
                      colorScheme="stargaze"
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
        </Flex>
      </main>
    </>
  )
}
