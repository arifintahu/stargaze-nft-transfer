import { Box } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { Select } from 'chakra-react-select'

export interface Option {
  value: string
  label: string
}

interface SelectSearchProps {
  options: Option[]
  onChange: any
  isLoading?: boolean
  placeholder?: string
}

export default function SelectSearch({
  options,
  onChange,
  isLoading = false,
  placeholder = 'Select option',
}: SelectSearchProps) {
  return (
    <Box>
      <Select
        isLoading={isLoading}
        useBasicStyles
        placeholder={placeholder}
        chakraStyles={{
          menuList: (provided) => ({
            ...provided,
            background: 'satellite.500',
            borderColor: 'gray.500',
          }),
          option: (provided) => ({
            ...provided,
            background: 'satellite.500',
            _hover: { background: 'satellite.100' },
          }),
          control: (provided) => ({
            ...provided,
            borderColor: 'whiteAlpha.200',
          }),
        }}
        options={options}
        onChange={onChange}
      />
    </Box>
  )
}
