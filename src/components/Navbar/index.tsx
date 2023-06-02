import {
  Box,
  Flex,
  Button,
  Stack,
  useDisclosure,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  HStack,
  Link,
  IconButton,
  Tooltip,
} from '@chakra-ui/react'
import { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { CopyIcon, CheckIcon } from '@chakra-ui/icons'
import { FiLogOut } from 'react-icons/fi'

import { setAddress, selectAddress } from '@/store/accountSlice'
import { trimAddress, showBalance } from '@/utils/helpers'
import { getChain } from '@/config'
import { getBalances, Balance } from '@/utils/client/rest/cosmos/bank'

const menuList = [
  {
    id: 1,
    route: '/',
    name: 'NFT Transfer',
  },
  {
    id: 2,
    route: '/collections',
    name: 'Collections',
  },
]

export default function Navbar() {
  const chain = getChain()

  const [isCopied, setIsCopied] = useState(false)
  const [balances, setBalances] = useState<Balance[]>([])

  const { isOpen, onOpen, onClose } = useDisclosure()
  const address = useSelector(selectAddress)
  const finalRef = useRef(null)
  const router = useRouter()
  const dispatch = useDispatch()

  const handleKeplr = async () => {
    if (window.keplr) {
      await window.keplr.enable(chain.id)
      const offlineSigner = window.keplr.getOfflineSigner(chain.id)
      const accounts = await offlineSigner.getAccounts()
      if (accounts[0].address) {
        dispatch(setAddress(accounts[0].address))
        onClose()
      }
    } else {
      alert('Please install keplr extension')
    }
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(address)
    setIsCopied(true)
  }

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    }
  }, [isCopied])

  useEffect(() => {
    if (address) {
      getBalances(chain.rest, address).then((response) => {
        setBalances(response.balances)
      })
    }
  }, [address])

  return (
    <>
      <Box
        px={12}
        py={3}
        borderBottomColor={'whiteAlpha.300'}
        borderBottomWidth={1}
        position={'sticky'}
        top={0}
        bg={'black'}
      >
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Flex alignItems={'center'} gap={6}>
            <Image
              alt="Stargaze logo"
              src="/assets/stargaze_logo_800.svg"
              w={130}
              h={'auto'}
            ></Image>
            <HStack gap={3}>
              {menuList.map((item) => (
                <Link
                  key={item.id}
                  as={NextLink}
                  href={item.route}
                  style={{ textDecoration: 'none' }}
                  _focus={{ boxShadow: 'none' }}
                >
                  {item.route === router.route ? (
                    <Button colorScheme="stargaze">{item.name}</Button>
                  ) : (
                    <Button
                      variant={'ghost'}
                      _hover={{ background: 'gray.900' }}
                    >
                      {item.name}
                    </Button>
                  )}
                </Link>
              ))}
            </HStack>
          </Flex>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              {!!address ? (
                <Flex
                  borderColor={'whiteAlpha.300'}
                  borderWidth={1}
                  py={2}
                  px={4}
                  borderRadius={'md'}
                  minW={300}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  <Flex
                    flexDirection={'column'}
                    justifyContent={'center'}
                    alignItems={'flex-start'}
                  >
                    <Text fontSize={'sm'}>{trimAddress(address)}</Text>
                    <Text fontSize={'sm'}>
                      {showBalance(balances, chain.coin)}
                    </Text>
                  </Flex>
                  <Flex gap={1}>
                    <Tooltip label={isCopied ? 'Copied' : 'Copy Address'}>
                      <IconButton
                        size={'sm'}
                        variant={'ghost'}
                        aria-label="Copy Address"
                        _hover={{ background: 'gray.900' }}
                        icon={isCopied ? <CheckIcon /> : <CopyIcon />}
                        onClick={copyAddress}
                      />
                    </Tooltip>
                    <Tooltip label="Disconnect">
                      <IconButton
                        size={'sm'}
                        variant={'ghost'}
                        aria-label="Disconnect"
                        _hover={{ background: 'gray.900' }}
                        icon={<FiLogOut />}
                        onClick={() => dispatch(setAddress(''))}
                      />
                    </Tooltip>
                  </Flex>
                </Flex>
              ) : (
                <Button
                  colorScheme="stargaze"
                  fontSize={'md'}
                  px={16}
                  minW={150}
                  onClick={onOpen}
                >
                  Connect Wallet
                </Button>
              )}
            </Stack>
          </Flex>
        </Flex>
      </Box>

      <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg={'whiteAlpha.500'} />
        <ModalContent bg={'black'} borderRadius={'lg'}>
          <ModalHeader>Select Wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody px={6} py={8}>
            <Button colorScheme="stargaze" width={'full'} onClick={handleKeplr}>
              Keplr Wallet
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
