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
} from '@chakra-ui/react'
import { useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import NextLink from 'next/link'
import { setChainId, selectChainId } from '@/store/chainSlice'
import { trimAddress } from '@/utils/helpers'

export default function Navbar() {
  const [address, setAddress] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const chainId = useSelector(selectChainId)
  const finalRef = useRef(null)

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

  return (
    <>
      <Box
        px={12}
        py={3}
        borderBottomColor={'whiteAlpha.300'}
        borderBottomWidth={1}
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
              <Link
                as={NextLink}
                href={'/'}
                style={{ textDecoration: 'none' }}
                _focus={{ boxShadow: 'none' }}
              >
                <Button variant={'ghost'} _hover={{ background: 'gray.900' }}>
                  NFT Transfer
                </Button>
              </Link>
              <Link
                as={NextLink}
                href={'/mycollections'}
                style={{ textDecoration: 'none' }}
                _focus={{ boxShadow: 'none' }}
              >
                <Button variant={'ghost'} _hover={{ background: 'gray.900' }}>
                  My Collections
                </Button>
              </Link>
            </HStack>
          </Flex>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              {!!address ? (
                <Flex
                  flexDirection={'column'}
                  justifyContent={'center'}
                  alignItems={'flex-end'}
                >
                  <Text fontSize={'sm'}>{trimAddress(address)}</Text>
                  <Text fontSize={'sm'}>{''}</Text>
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
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Connect an Interchain Wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody px={6} py={8}>
            <Button
              colorScheme="orange"
              variant="outline"
              width={'full'}
              onClick={handleKeplr}
            >
              Keplr Wallet
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
