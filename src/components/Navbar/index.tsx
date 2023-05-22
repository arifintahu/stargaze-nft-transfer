import {
  Box,
  Flex,
  Button,
  useColorModeValue,
  Stack,
  Heading,
  Link,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
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
      <Box px={24}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Flex alignItems={'center'} gap={6}>
            <Link
              as={NextLink}
              href={'/'}
              style={{ textDecoration: 'none' }}
              _focus={{ boxShadow: 'none' }}
            >
              <Heading
                size={'sm'}
                fontFamily={'mono'}
                textTransform={'uppercase'}
                letterSpacing={3}
              >
                Inter Collection
              </Heading>
            </Link>
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
                  as={'a'}
                  display={{ base: 'none', md: 'inline-flex' }}
                  fontSize={'md'}
                  px={8}
                  href={'#'}
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
