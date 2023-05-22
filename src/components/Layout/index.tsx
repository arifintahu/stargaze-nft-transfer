import { ReactNode } from 'react'
import { Box } from '@chakra-ui/react'
import Navbar from '../Navbar'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <Box px={24} pt={12} minH="100vh">
        {children}
      </Box>
    </>
  )
}
