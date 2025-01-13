
import useDAOCheck from "@/hooks/useDAOCheck"
import { useEffect, useState } from "react"
import Templates from "../../data/templates.json"
import { useConnectWallet } from '@web3-onboard/react'
import { ethers } from "ethers"
import { Check, X } from "react-feather"


const Directory = () => {

    const [{ wallet }] = useConnectWallet()

    const { listDAO } = useDAOCheck()

    const [daos, setDaos] = useState([])
    const [ownedByMe, setOwnedByMe] = useState(false)
    const [isParent, setIsParent] = useState(true)
    const [jurisdiction, setJurisdiction] = useState()

    useEffect(() => {
        listDAO().then(setDaos)
    }, [])

    const account = wallet && wallet.accounts && wallet.accounts[0] ? wallet.accounts[0].address : ethers.ZeroAddress

    const filtered = daos.filter((item) => {

        if (ownedByMe && account.toLowerCase() !== item.owner.toLowerCase()) {
            return false
        }

        if (isParent && isParent !== item.isParent) {
            return false
        }

        if (jurisdiction && jurisdiction !== item.jurisdiction) {
            return false
        }

        return true
    })

    return (
        <div className=" flex-grow">
            <div className="ml-auto mt-4 mr-auto w-full max-w-4xl">
                <div className="grid grid-cols-9">
                    <div className="col-span-2">
                        <h2 className="font-bold text-lg mb-1">Filter</h2>
                        <label className="text-gray-700 font-medium text-sm">
                            Owned By
                        </label>
                        <div className="flex items-center mb-2 mt-2  ">
                            <input onClick={() => setOwnedByMe(false)} checked={ownedByMe === false} type="radio" value="" name="owner" className="w-4 h-4 text-blue-600 cursor-pointer bg-gray-100 border-gray-300" />
                            <label className="ms-2 text-sm font-medium text-gray-900  ">Anyone</label>
                        </div>
                        <div className="flex items-center mb-2 ">
                            <input onClick={() => setOwnedByMe(true)} checked={ownedByMe === true} type="radio" value="" name="owner" className="w-4 h-4 text-blue-600 cursor-pointer bg-gray-100 border-gray-300  " />
                            <label className="ms-2 text-sm font-medium text-gray-900  ">You</label>
                        </div>
                        <label className="text-gray-700   font-medium text-sm">
                            DAO Type
                        </label>
                        <div className="flex items-center mb-2 mt-2  ">
                            <input onClick={() => setIsParent(false)} checked={isParent === false} type="radio" value="" name="dao-type" className="w-4 h-4 text-blue-600 cursor-pointer bg-gray-100 border-gray-300" />
                            <label className="ms-2 text-sm font-medium text-gray-900  ">All</label>
                        </div>
                        <div className="flex items-center   mb-2 ">
                            <input onClick={() => setIsParent(true)} checked={isParent === true} type="radio" value="" name="dao-type" className="w-4 h-4 text-blue-600 cursor-pointer bg-gray-100 border-gray-300  " />
                            <label className="ms-2 text-sm font-medium text-gray-900  ">Parent</label>
                        </div>
                        <label className="text-gray-700   font-medium text-sm">
                            Jurisdiction
                        </label>
                        <div className="flex items-center mb-2 mt-2  ">
                            <input onClick={() => setJurisdiction()} checked={!jurisdiction} type="radio" value="" name="jurisdiction" className="w-4 h-4 text-blue-600 cursor-pointer bg-gray-100 border-gray-300" />
                            <label className="ms-2 text-sm font-medium text-gray-900  ">All</label>
                        </div>
                        {Templates.map((item, index) => {
                            return (
                                <div key={index} className="flex items-center mb-2 mt-2  ">
                                    <input onClick={() => setJurisdiction(item.name)} checked={jurisdiction === item.name} type="radio" value="" name="jurisdiction" className="w-4 h-4 text-blue-600 cursor-pointer bg-gray-100 border-gray-300" />
                                    <label className="ms-2 text-sm font-medium text-gray-900  ">{item.name}</label>
                                </div>
                            )
                        })}

                    </div>
                    <div className="col-span-7 ">


                        <div className="relative overflow-x-auto">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            registered DAO
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Jurisdiction
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Sub-DAO of
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        filtered.map((item, index) => {

                                            const target = Templates.find((t => item.jurisdiction === t.name))
                                            const flag = target && target.image

                                            return (
                                                <tr key={index} className="bg-white border-b ">
                                                    <th scope="row" className="px-6 py-2   font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                        {item.name}
                                                        <p className="text-[11px] text-gray-500">
                                                            {item.address}
                                                        </p>
                                                    </th>
                                                    <td className="px-6 py-2">
                                                        <div className="flex flex-row text-gray-900">

                                                            {item.jurisdiction}
                                                            {flag && (
                                                                <img src={flag} alt="" className="h-5 w-5 ml-3 mr-auto  object-cover flex-shrink-0 rounded-full" />
                                                            )}
                                                        </div>


                                                    </td>
                                                    <td className="px-6 py-2">
                                                        { item.isParent ? "None" : <>
                                                        { daos.find(d => d.daoId === item.parentId).name}
                                                        </>}
                                                        {/* {item.isParent ? <span><Check style={{ color: "green" }} size={22} /></span> : <span><X style={{ color: "red" }} size={22}  /></span>} */}
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Directory