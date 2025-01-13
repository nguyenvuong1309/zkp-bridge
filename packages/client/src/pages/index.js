
import Header from '@/components/Header'
import Footer from '@/components/Footer' 
import AllDao from '@/components/overview/AllDao'


export default function Home() {
  return (
    <main
      className={`  bg-neutral-100 text-black flex h-screen flex-col mx-auto justify-between`}
    >
      <Header />
 
        <AllDao/> 

      <Footer />
    </main>
  )
}
