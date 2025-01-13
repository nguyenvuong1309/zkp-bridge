import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useConnectWallet } from '@web3-onboard/react'
import { Puff } from 'react-loading-icons'


const Header = () => {

    const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()

    const router = useRouter()

    const { pathname } = router

    return (
        <nav
            className="w-full grid grid-cols-5 p-2 gap-3">
            <div className='py-2 col-span-1 pl-10'>
                <Link href="http://localhost:3000">
                    {/* <Image
                        src="/daocheck-logo-2.png"
                        width={200}
                        height={50}
                        alt="Logo"
                    /> */}
                     <Image
                        src="/Web-3-logo.png"
                        width={50}
                        height={50}
                        alt="Logo"
                    />
                </Link>
            </div>
            <div className='col-span-3'>
                <div className="text-md font-medium text-blue-700 lg:flex-grow">
                    <div className="container flex items-center justify-center p-4 mx-auto  capitalize  text-black">
                        <Link className={`border-b-2 ${(pathname === ("/") || pathname.includes("/new") ) ? "black border-black  " : "border-transparent hover:black hover:border-black"} mx-1.5 sm:mx-6`} href="/">
                            Overview
                        </Link>
                        <Link className={`border-b-2 ${pathname.includes("/directory") ? "black border-black  " : "border-transparent hover:black hover:border-black"} mx-1.5 sm:mx-6`} href="/directory">
                            Directory
                        </Link>
                        {/* <Link className={`border-b-2 ${pathname.includes("/settings") ? "black border-black  " : "border-transparent hover:black hover:border-black"} mx-1.5 sm:mx-6`} href="/settings">
                            Settings
                        </Link> */}
                    </div>
                </div>
            </div>
            <div className='py-2 col-span-1 flex'>
                <button disabled={connecting} onClick={() => (wallet ? disconnect(wallet) : connect())} className={`text-black ${wallet ? "bg-transparent border-2 border-gray-600 bg-white text-black" : "bg-black text-white"} ml-auto mr-2 font-bold   text-sm py-2 px-8 rounded-md`}>
                    {connecting ? <><Puff stroke="#ffffff" style={{ height: "18px", width: "18px" }} className='mx-10' /></> : wallet ? 'Disconnect' : 'Connect Wallet'}
                </button>
            </div>
        </nav>
    )
}

export default Header