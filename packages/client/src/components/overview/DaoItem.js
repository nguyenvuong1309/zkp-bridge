import useDAOCheck from "@/hooks/useDAOCheck"
import Templates from "../../data/templates.json"
import { useEffect, useState } from "react"
import { shortAddress } from "@/utils"
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Copy } from "react-feather";
import QRCode from "react-qr-code";

const EachRow = ({
    daoId,
    passcode,
    jurisdiction,
    openWallet,
    name
}) => {

    const { listWallet } = useDAOCheck()

    const [wallets, setWallets] = useState([])
    const template = Templates.find((t => jurisdiction === t.name))
    const flag = template && template.image

    useEffect(() => {
        listWallet(daoId, passcode).then(setWallets)
    }, [passcode, daoId])

    const total = wallets.reduce((output, item) => {
        return output + item.balanceInUsd
    }, 0)

    const totalDuty = wallets.reduce((output, item) => {
        return output + item.dutyInUsd
    }, 0)

    return (
        <div className="ml-auto mr-auto w-full max-w-2xl">
            <div className="grid grid-cols-2 w-full pb-2">
                {/* <div className="col-span-1 text-sm flex flex-row">
                    <span className="font-bold">
                        Jurisdiction:
                    </span>
                    {flag && (
                        <img src={flag} alt="" className="h-4 w-4 mt-[2px] ml-2 mr-2 object-cover flex-shrink-0 rounded-full" />
                    )}
                    <div>
                        {jurisdiction}
                    </div>
                </div> */}
                <div className="col-span-1 text-sm flex flex-row">
                    <span className="font-bold mr-2">
                        Balance:
                    </span>
                    <div>
                        ${total.toLocaleString()}{` ($`}{totalDuty.toLocaleString()})
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-9 w-full">

                {wallets.map((item, index) => {
                    console.log("item.address",item.address)
                    if(index !== 0) return null

                    return (
                        <div key={index} className="col-span-3 p-1 ">
                            <div className="border-2 border-black bg-neutral-100 rounded-md mx-2">
                                <div className="w-full mt-1 text-xs text-center text-black font-bold">
                                    {template?.duty}{` +`}{item.dutyRate / 100}%
                                </div>
                                <div onClick={() => openWallet({
                                    ...item,
                                    daoId,
                                    passcode,
                                    jurisdiction,
                                    name
                                })} className="flex cursor-pointer py-1">
                                    <div className="w-1/2 ml-auto mr-auto">
                                        <QRCode
                                            size={100}
                                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                            value={item.address}
                                            viewBox={`0 0 256 256`}
                                        />
                                    </div>
                                    {/* <img src={"/QR-Code.png"} className="w-1/2 mx-auto" /> */}
                                </div>
                                <div className="text-xs text-center text-black font-bold">
                                    On-chain Address
                                </div>
                                <CopyToClipboard text={item.address}>
                                    <div className="text-xs mb-1 text-center flex flex-row justify-center items-center">
                                        <div className="mt-auto mb-auto cursor-pointer">
                                            {shortAddress(item.address)}
                                        </div>

                                        <button className="ml-1 cursor-pointer">
                                            <Copy size={12} />
                                        </button>
                                    </div>
                                </CopyToClipboard>

                            </div>

                        </div>
                    )
                })

                }
            </div>
        </div>
    )
}

const DaoItem = ({
    daoId,
    passcode,
    jurisdiction,
    name,
    childs,
    openWallet
}) => {

    return (
        <div className="py-2 px-2">
            <h2 className="mb-1 text-center text-neutral-800 font-medium text-xl">{name}</h2>
            <div className="rounded-lg  border-2 border-gray-600 flex flex-col w-full p-3 py-5  bg-white ">

                <EachRow
                    daoId={daoId}
                    passcode={passcode}
                    jurisdiction={jurisdiction}
                    openWallet={openWallet}
                    name={name}
                />

                {
                    childs.map((dao, index) => {
                        return (
                            <div className="mt-4" key={index}>
                                <EachRow
                                    daoId={dao.daoId}
                                    passcode={passcode}
                                    jurisdiction={dao.jurisdiction}
                                    openWallet={openWallet}
                                    name={name}
                                />
                            </div>

                        )
                    })
                }
            </div>
        </div>
    )
}

export default DaoItem