import { ReactNode } from 'react'
import { Box } from '@chakra-ui/react'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Box px={24} pt={12} minH="100vh">
        {children}
      </Box>
    </>
  )
}
