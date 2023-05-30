import Head from 'next/head'
import { useEffect } from 'react'

export default function MyCollections() {
  useEffect(() => {
    getCollections()
  })

  const getCollections = async () => {}

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
