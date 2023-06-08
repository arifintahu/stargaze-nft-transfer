import { Box } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { Select, InputActionMeta } from 'chakra-react-select'

export interface Option {
  value: string
  label: string
}

interface SelectSearchProps {
  options: Option[]
  onChange: any
  value: any
  isLoading?: boolean
  placeholder?: string
}

const MAX_ITEMS = 20

export default function SelectSearch({
  options,
  onChange,
  value,
  isLoading = false,
  placeholder = 'Select option',
}: SelectSearchProps) {
  const [slicedOptions, setSlicedOptions] = useState<Option[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (options.length && search.length > 1) {
      const filteredOptions = options.filter((item) =>
        item.value.includes(search)
      )
      setSlicedOptions(filteredOptions.slice(0, MAX_ITEMS))
    } else {
      setSlicedOptions(options.slice(0, MAX_ITEMS))
    }
  }, [options, search])

  const handleSearch = (newValue: string, actionMeta: InputActionMeta) => {
    if (newValue.length && actionMeta.action === 'input-change') {
      setSearch(newValue)
    }
  }

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
        options={slicedOptions}
        onChange={onChange}
        onInputChange={handleSearch}
        value={value}
      />
    </Box>
  )
}
