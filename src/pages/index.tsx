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
} from '@chakra-ui/react'
import Head from 'next/head'

export default function Home() {
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
                <Flex alignItems={'center'} gap={3}>
                  <Image
                    src={'/assets/stargaze_star_white.svg'}
                    alt="Stargaze logo"
                    w={25}
                    h={25}
                  ></Image>
                  <Text fontWeight={'semibold'}>Stargaze</Text>
                </Flex>
              </Box>
              <Box borderRadius={'md'} bg={'satellite.500'} px={6} py={3}>
                <Text fontSize={'xs'} mb={2}>
                  To
                </Text>
                <Flex alignItems={'center'} gap={3}>
                  <Image
                    src={'/assets/stargaze_star_white.svg'}
                    alt="Stargaze logo"
                    w={25}
                    h={25}
                  ></Image>
                  <Text fontWeight={'semibold'}>Stargaze</Text>
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
    </>
  )
}
