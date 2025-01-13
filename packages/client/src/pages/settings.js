

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Protected from '@/components/Protected'

export default function Settings() {
  return (
    <main
      className={`  bg-neutral-100 text-black flex h-screen flex-col mx-auto justify-between`}
    >
      <Header />

      <Protected>
        SETTINGS
      </Protected>

      <Footer />
    </main>
  )
}
