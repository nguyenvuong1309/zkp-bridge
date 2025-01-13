
import BasePanel from "./Base"
import QRCode from "react-qr-code";
import Templates from "../data/templates.json"
import { useCallback, useEffect, useState } from "react";
import { Puff } from 'react-loading-icons'
import { ethers } from "ethers";
import useDAOCheck from "@/hooks/useDAOCheck";
import { shortAddress } from "@/utils";


const WalletDetails = ({
    visible,
    close,
    walletData
}) => {

    const { listHistory, withdraw } = useDAOCheck()

    const [title, setTitle] = useState()
    const [txs, setTxs] = useState([])

    const [loading, setLoading] = useState(false)

    const template = walletData && Templates.find((t => t.name === walletData.jurisdiction))
    const flag = template && template.image

    useEffect(() => {
        walletData && setTitle(`Smart contract#${Number(walletData.onchainId.replace(`${walletData.daoId}`, "")) + 1}`)
    }, [walletData, template])

    useEffect(() => {
        walletData && listHistory(walletData.address).then(setTxs)
    }, [walletData])

    const onWithdraw = useCallback(async () => {

        setLoading(true)
        walletData.address = "0x25bE1016Cd01747E8ED5e22ddA4aD0449653f66F"

        try {
            await withdraw(walletData.commitment, walletData.passcode, walletData.onchainId, walletData.balance, walletData.duty)
        } catch (e) {
            console.log(e)
        }

        setLoading(false)

    }, [walletData])

    return (
        <BasePanel
            visible={visible}
            close={close}
            title={`${title}`}
        >
            {walletData && (
                <>

                    <div className="grid grid-cols-2">
                        <div className="col-span-1">
                            <QRCode
                                size={100}
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                value={walletData.address}
                                viewBox={`0 0 256 256`}
                            />
                        </div>
                        <div className="col-span-1 px-2 pl-4 ">
                            <h2 className="font-bold">
                                Name
                            </h2>
                            <p>
                                {walletData.name}
                            </p>

                            {/* <h2 className="font-bold">
                                Jurisdiction
                            </h2>
                            <div className="flex flex-row">
                                {walletData.jurisdiction}
                            </div>
                            <div className="grid grid-cols-3">
                                <div className="col-span-2">
                                    <h2 className="font-bold">
                                        Duty Name
                                    </h2>
                                    <div>
                                        {template?.duty}
                                    </div>
                                </div>
                                <div className="col-span-1 text-right">
                                    <h2 className="font-bold">
                                        Rate
                                    </h2>
                                    <div>
                                        {walletData.dutyRate / 100}%
                                    </div>
                                </div>
                            </div>
                            <h2 className="font-bold">
                                Balances Locked
                            </h2>
                            <div className="flex flex-row">
                                ${walletData.balanceInUsd.toLocaleString()}
                            </div>
                            <h2 className="font-bold">
                                Duty Locked
                            </h2>
                            <div className="flex flex-row">
                                ${walletData.dutyInUsd.toLocaleString()}
                            </div> */}


                        </div>
                    </div>
                    <div className="flex flex-row mt-4">
                        <h2 className="font-bold ">
                            Address
                        </h2>
                        <div className=" flex-grow text-right hover:underline">
                            <a target="_blank" href={`https://blockscout.com/shibuya/address/${walletData.address}`}>
                                {walletData.address}
                            </a>

                        </div>
                    </div>

                    <h2 className="font-bold mt-2  ">
                        All Assets (1)
                    </h2>
                    <div className="border mt-1 border-black rounded-md p-3 py-3 w-full grid grid-cols-5 ">
                        <div className="col-span-1 font-medium flex items-center">
                            Shibuya
                        </div>
                        <div className="col-span-2 flex items-center">
                            <span className="font-medium mr-1">Total:</span>
                            {Number(ethers.formatEther(walletData.balance)) + Number(ethers.formatEther(walletData.duty))}{` SBY`}
                        </div>
                        <div className="col-span-2 flex">
                            <button disabled={loading} onClick={onWithdraw} className={`rounded-md ml-auto w-full ${loading && "opacity-70"} bg-black py-2 mt-auto mb-auto px-6 text-sm font-medium flex flex-row   items-center justify-center text-white`}>
                                {loading && <Puff style={{ width: "20px", height: "20px", marginRight: "8px" }} />}
                                Withdraw
                            </button>
                        </div>
                    </div>
                    <h2 className="font-bold mt-4  ">
                        Transactions ({txs.length})
                    </h2>
                    <div className="text-sm p-1 font-medium">
                        <table className="table-auto w-full ">
                            <tbody>
                                <tr>
                                    <td className="py-2 border-b  border-gray-600">From</td>
                                    {/* <td className="py-2   border-b border-gray-600">
                                        Currency
                                    </td> */}
                                    {/* <td className="py-2   border-b border-gray-600">
                                        Payment
                                    </td> */}
                                    <td className="py-2   border-b border-gray-600">
                                        Duty
                                    </td>
                                    <td className="py-2   border-b border-gray-600">
                                        Total
                                    </td>
                                    <td className="py-2   border-b border-gray-600">
                                        Date
                                    </td>
                                </tr>
                                {txs.map((tx, index) => {

                                    const { value } = tx
                                    const total = Number(ethers.formatEther(value))
                                    const duty = total * (walletData.dutyRate / 10000)
                                    const payment = total - duty

                             
                                    return (
                                        <tr key={index}>
                                            <td className=" py-2  border-b hover:underline  border-gray-600">
                                                <a target="_blank" href={`https://blockscout.com/shibuya/address/${tx.from}`}>
                                                    {shortAddress(tx.from)}
                                                </a>
                                            </td>

                                            {/* <td className=" py-2   border-b border-gray-600">
                                                SBY
                                            </td> */}
                                            {/* <td className=" py-2   border-b border-gray-600">
                                                {payment.toLocaleString()} SBY
                                            </td> */}
                                            <td className=" py-2   border-b border-gray-600">
                                                {duty.toLocaleString()} SBY
                                            </td>
                                            <td className=" py-2   border-b border-gray-600">
                                                {total.toLocaleString()} SBY
                                            </td>
                                            <td className=" py-2   border-b border-gray-600">
                                                {(new Date((Number(tx.timeStamp) * 1000)).toLocaleDateString())}
                                            </td>
                                        </tr>
                                    )
                                })}

                            </tbody>
                        </table>
                    </div>

                </>
            )}
        </BasePanel>
    )
}

export default WalletDetails