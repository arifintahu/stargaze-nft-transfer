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
} from '@chakra-ui/react'
import { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { setChainId, selectChainId } from '@/store/chainSlice'
import { trimAddress } from '@/utils/helpers'
import { CopyIcon } from '@chakra-ui/icons'

const menuList = [
  {
    id: 1,
    route: '/',
    name: 'NFT Transfer',
  },
  {
    id: 2,
    route: '/mycollections',
    name: 'My Collections',
  },
]

export default function Navbar() {
  const [address, setAddress] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const chainId = useSelector(selectChainId)
  const finalRef = useRef(null)
  const router = useRouter()
  const dispatch = useDispatch()

  const handleKeplr = async () => {
    if (window.keplr) {
      await window.keplr.enable(chainId)
      const offlineSigner = window.keplr.getOfflineSigner(chainId)
      const accounts = await offlineSigner.getAccounts()
      if (accounts[0].address) {
        setAddress(accounts[0].address)
        onClose()
      }
    } else {
      alert('Please install keplr extension')
    }
  }

  useEffect(() => {
    dispatch(setChainId('elgafar-1'))
  })

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
                    <Text fontSize={'sm'}>0 STARS</Text>
                  </Flex>
                  <IconButton
                    size={'sm'}
                    variant={'ghost'}
                    aria-label="Copy address"
                    _hover={{ background: 'gray.900' }}
                    icon={<CopyIcon />}
                  />
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
