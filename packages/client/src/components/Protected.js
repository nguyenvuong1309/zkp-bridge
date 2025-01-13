import { useConnectWallet } from "@web3-onboard/react"
import Image from 'next/image'


const Protected = ({ children }) => {

    const [{ wallet, connecting }] = useConnectWallet()

    if (!wallet || wallet && wallet.chains[0] && wallet.chains[0].id !== "0x51" ) {
        return (
            <div className="rounded-lg h-[300px] border-2 border-gray-600 ml-auto mr-auto max-w-2xl flex w-full p-6 py-6 m-1 mb-20 bg-white ">

                <div className="text-center max-w-sm m-auto">
                    <h2 className=" text-2xl font-bold">
                        Wrong Network
                    </h2>
                    <p className="text-sm my-2 text-neutral-600">
                        We're unable to see that you have connected any Web3 wallet on the following network:
                    </p>
                    <div className="w-full mb-1 bg-neutral-100 rounded-lg border-2 border-gray-600 ml-auto mr-auto grid grid-cols-4 p-2 mt-4 gap-3 text-lg">
                        <div className="col-span-1 py-1 px-2">
                            <Image
                                src="/astar-logo.png"
                                width={100}
                                height={100}
                                alt="Astar"
                            />
                        </div>
                        <div className="col-span-3 flex flex-col font-semibold text-left">
                            <div className="mt-auto">
                                Shibuya Testnet
                            </div>
                            <div className="text-xs p-0 m-0  text-neutral-600 mb-auto">
                                Chain ID: 81
                            </div> 
                        </div>
                    </div> 
                </div>
            </div>
        )
    }

    return (
        <>
            {children}
        </>
    )
}

export default Protected