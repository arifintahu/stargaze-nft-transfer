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
import { CopyIcon } from '@chakra-ui/icons'

interface Collection {
  title: string
  contract: string
  type: string
}

export default function Collections() {
  const address = useSelector(selectAddress)
  const toast = useToast()

  const [contracts, setContracts] = useState<string[]>([])
  const [isLoadingContracts, setIsLoadingContracts] = useState(false)
  const [collections, setCollections] = useState<Collection[]>([])

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
    }
  }, [contracts])

  useEffect(() => {
    if (!collections.length) {
      contracts.slice(0, 10).map((item) => {
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
                        <Badge>{item.type}</Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </Flex>
      </main>
    </>
  )
}
