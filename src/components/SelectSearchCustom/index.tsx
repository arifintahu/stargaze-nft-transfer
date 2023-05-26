import { ChevronDownIcon } from '@chakra-ui/icons'
import { Box, Button, Flex, Input, Select } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import {
  useSelect,
  SelectSearchProps,
  SelectSearchOption,
  SelectedOptionValue,
  SelectedOption,
} from 'react-select-search'

export default function SelectSearchCustom({
  options,
  value,
}: SelectSearchProps) {
  const [snapshot, valueProps, optionProps] = useSelect({
    options,
    value,
  })

  useEffect(() => {
    console.log(snapshot)
  }, [snapshot])

  const handleFocus = () => {
    valueProps.onFocus()
    console.log(snapshot.focus)
  }

  return (
    <Box>
      <Select border={'none'}>
        <option value="option1" style={{ background: '#1C2937' }}>
          Option 1
        </option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </Select>
      {/* <Flex
                alignItems={'center'}
                justifyContent={'space-between'}
                cursor={'pointer'}
                _hover={{ bg: 'satellite.100' }}
                p={3}
                borderRadius={'md'}
                borderWidth={1}
                borderColor={'whiteAlpha.300'}
                w={'lg'}
            >
                <Input 
                    tabIndex={Number(valueProps.tabIndex)}
                    onFocus={handleFocus}
                    value={snapshot.displayValue}
                    placeholder='Select contract address'
                    border={'none'}
                />
                <ChevronDownIcon fontSize={'lg'} />
            </Flex>
            <Box
                p={3}
                borderRadius={'md'}
                borderWidth={1}
                background={'satellite.100'}
                borderColor={'whiteAlpha.300'}
                position={'absolute'}
                width={'lg'}
                zIndex={2}
            >
                {snapshot.options.map((option: any) => (
                    <Box key={option.name}>
                        {option.value}
                    </Box>
                ))}
            </Box> */}
    </Box>
  )
}
