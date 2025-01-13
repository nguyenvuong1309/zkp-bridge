
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Directory from '@/components/directory'

export default function DirectoryPage() {
  return (
    <main
      className={`  bg-neutral-100 text-black flex h-screen flex-col mx-auto justify-between`}
    >
      <Header />

      <Directory />

      <Footer />
    </main>
  )
}
