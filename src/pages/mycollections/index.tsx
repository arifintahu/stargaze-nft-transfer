import Head from 'next/head'
import { useEffect } from 'react'
import ics721 from '@/utils/client/rpc/contract/ics721'

export default function MyCollections() {
  useEffect(() => {
    getCollections()
  })

  const getCollections = async () => {
    const collections = await ics721.getContractInfo(
      'stars1nv2r5htxtwj6fzgk7hz0fe69tved37r0q2lx643704surgq5cjfsuefn2z'
    )
    console.log(collections)
  }

  return (
    <>
      <Head>
        <title>Stargaze | My Collections</title>
        <meta name="description" content="Stargaze | My Collections" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main></main>
    </>
  )
}
