import { Theme, extendTheme } from '@chakra-ui/react'
import { colors } from './colors'
import { components } from './components'

const theme: Theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  } as Theme['config'],
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
    mono: 'IBM Plex Mono, monospace',
  },
  styles: {
    global: {
      'html, body': {
        background: '#000',
        color: '#fff',
        padding: 0,
        margin: 0,
        fontFeatureSettings: `'zero' 1`,
        scrollBehavior: 'smooth',
      },
      body: {
        colorScheme: 'dark',
      },
      '::selection': {
        backgroundColor: '#90cdf4',
        color: '#fefefe',
      },
      '::-moz-selection': {
        backgroundColor: '#90cdf4',
        color: '#fefefe',
      },
    },
  },
  colors,
  components,
}) as Theme

export default theme
