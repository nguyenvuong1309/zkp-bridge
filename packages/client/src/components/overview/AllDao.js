
import { Fragment, useEffect, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDown } from 'react-feather'
import ButtonDropdown from '../ButtonDropdown'
import useDAOCheck from '@/hooks/useDAOCheck'
import { useConnectWallet } from '@web3-onboard/react'
import DaoItem from './DaoItem'
import Passcode from '@/modals/Passcode'
import WalletDetails from '@/panels/WalletDetails'

const NoDAO = () => (
    <div className="rounded-lg h-[300px] border-2 border-gray-600 flex w-full p-6 py-6 m-1 bg-white ">
        <div className="text-center max-w-sm m-auto">
            {/* <h2 className=" text-2xl font-bold">
                No DAO Found
            </h2>
            <p className="text-sm my-2 font-medium text-neutral-800">
                No DAO is made or managed by your account. Please proceed to set up a new one.
            </p> */}

            {/* <a href="https://docs.astar.network/docs/build/zkEVM/quickstart" target="_blank" className="text-xs underline my-2 text-gray-400">
                How to connect
            </a> */}
        </div>
    </div>
)


const AllDao = () => {

    const [daos, setDaos] = useState([])

    const [{ wallet }] = useConnectWallet()
    const { listDAO } = useDAOCheck()

    const [modal, setModal] = useState(false)

    const [walletPanel, setWalletPanel ] = useState()

    let defaultValue

    try {
        defaultValue = localStorage && localStorage.getItem("daocheck_passcode") || "SECRET"
    } catch (error) {
        console.error(error.message); //raises the error
    }

    const [passcode, setPasscode] = useState(defaultValue)

    const onSave = (value) => {
        setPasscode(value)
        try {
            value && localStorage.setItem("daocheck_passcode", value)
        } catch (error) {
            console.error(error.message); //raises the error
        }

    }

    const openWallet = (wallet) => {
        setWalletPanel(wallet)
    }

    useEffect(() => {

        (async () => {
            if (wallet && wallet.accounts && wallet.accounts[0]) {
                const account = wallet.accounts[0]
                const { address } = account
                const all = await listDAO()
                const onlyParent = all.filter(item => item.isParent)

                const onlyMe = onlyParent.filter(item => item.owner.toLowerCase() === address.toLowerCase())

                setDaos(onlyMe.map((data) => {
                    return {
                        ...data,
                        childs : all.filter(item => item.parentId === data.daoId)
                    }
                }))
            }
        })()
    }, [wallet])


    return (
        <>
        <WalletDetails
            visible={walletPanel !== undefined}
            close={() => setWalletPanel(undefined)}
            walletData={walletPanel}
        />
        <Passcode
            visible={modal}
            close={() => setModal(false)}
            defaultValue={passcode}
            onSave={onSave}
        />
        <div className="ml-auto mr-auto w-full p-2 max-w-4xl mb-20">
            <div className='flex flex-row'>
                <ButtonDropdown
                    title="Setup New..."
                    // items={["Parent DAO", "Child DAO"]}
                    // links={["/new/dao?type=parent", "/new/dao?type=child"]}
                    items={["Smart Contract"]}
                    links={["/new/dao?type=parent"]}
                />
                <div className="flex pb-1 ml-auto">
                    <button onClick={() => setModal(true)} className="rounded-md bg-black py-2 mt-auto mb-auto px-8 font-medium text-white ">
                        Change Passcode
                    </button>
                </div>

            </div>

            {daos.length === 0 && <NoDAO />}

            {daos.map((item, index) => {
                return (
                    <div key={index}>
                        <DaoItem
                            passcode={passcode}
                            openWallet={openWallet}
                            {...item}
                        />
                    </div>

                )
            })}

            {/* DISCLAIMER */}

            {/* <div className='max-w-lg ml-auto mr-auto text-sm mt-4 text-center font-medium text-neutral-600'>
                You're using a development version that is available only on Shibuya Testnet. Please note that some functions may not work as intended.
            </div> */}

        </div>
        </>
    )
}

export default AllDao