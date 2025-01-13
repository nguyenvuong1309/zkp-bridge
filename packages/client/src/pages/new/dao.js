
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Protected from '@/components/Protected'
import NewDao from '@/components/overview/NewDao'

export default function NewDaoPage() {
    return (
        <main
            className={`  bg-neutral-100 text-black flex h-screen flex-col mx-auto justify-between`}
        >
            <Header />

            <Protected>
                <NewDao />
            </Protected>

            <Footer />
        </main>
    )
}