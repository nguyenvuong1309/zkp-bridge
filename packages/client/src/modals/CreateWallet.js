import { useCallback, useState } from "react"
import BaseModal from "./Base"
import { ArrowRight } from "react-feather"
import { Puff } from 'react-loading-icons'
import useDAOCheck from "@/hooks/useDAOCheck"
import { hashCommitment } from "@/utils"


const CreateWallet = ({
    close,
    visible,
    name,
    secret,
    address,
    jurisdiction,
    dutyName,
    dutyTiers,
    parentId
}) => {

    const { registerDao, createWallet } = useDAOCheck()

    const [loading, setLoading] = useState(false)
    const [process, setProcess] = useState(0)

    const totalProcess = 2 + dutyTiers.length

    const onProceed = useCallback(async () => {

        setLoading(true)
        setProcess(0)

        try {
            
            const daoPrefix = await registerDao({
                name,
                address,
                jurisdiction,
                isParent : parentId === 0 ? true : false,
                parentId 
            })

            setProcess(1)

            for (let i = 0; i <= dutyTiers.length; i++) {
                
                const commitment = await hashCommitment(`${daoPrefix}${i}`, secret)

                await createWallet(commitment, i ==0 ? 0 : dutyTiers[i-1])

                setProcess(1 + i + 1)
            }

        } catch (e) {
            console.log("error : ", e)
        }

        setLoading(false)

    }, [name, address, jurisdiction, dutyName, dutyTiers, secret, registerDao, parentId])
 

    return (
        <BaseModal
            visible={visible}
            close={close}
            title={parentId === 0 ? "Create smart contract" : "Create Wallet for Child DAO" }
        >
            <div className="text-sm max-w-lg font-medium text-neutral-800">
                {/* { parentId === 0 && "Upon confirmation, we will generate on-chain wallets corresponding to each duty tier for your DAO on Shibuya Testnet"}
                { parentId !== 0 && "Upon confirmation, we will generate on-chain wallets corresponding to each duty tier for your DAO on Shibuya Testnet"} */}
                { parentId === 0 && ""}
                { parentId !== 0 && ""}
         
            </div>
            {/* <div className="grid grid-cols-8 my-2">

                <div className="col-span-2 p-2">
                    <div className="border-2 border-black h-[105px] mx-2">
                        <div className="w-full h-[18px] bg-black text-xs text-center text-white font-medium">
                            Tier-0
                        </div>
                        <div className="flex py-1 pb-0">
                            <img src={"/QR-Code.png"} className="w-3/4 mx-auto" />
                        </div>
                        <div className="w-full mt-[2px] text-xs text-center text-black font-bold">
                            +0%
                        </div>
                    </div>
                </div>
                {dutyTiers.map((t, index) => {
                    return (
                        <div className="col-span-2 p-2">
                            <div className="border-2 border-black h-[105px] mx-2">
                                <div className="w-full h-[18px] bg-black text-xs text-center text-white font-medium">
                                    Tier-{index + 1}
                                </div>
                                <div className="flex py-1 pb-0">
                                    <img src={"/QR-Code.png"} className="w-3/4 mx-auto" />
                                </div>
                                <div className="w-full mt-[2px] text-xs text-center text-black font-bold">
                                    +{t / 100}%
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div> */}
            <div className="py-2   pb-[6px] ">
                <button disabled={loading} onClick={onProceed} className={`${loading && "opacity-70"} bg-black flex flex-row items-center justify-center text-sm font-bold w-full  py-3 px-8 rounded-md text-white`}>
                    {loading && <Puff style={{ width: "20px", height: "20px", marginRight: "8px" }} />}
                    Proceed
                </button>
            </div>
            <div className="text-center text-xs text-black font-medium p-1">
                {process}/{totalProcess} process completed
            </div>
            {process === totalProcess && (
                <div className="text-center text-xs text-blue-600 font-bold">
                    Done!
                </div>
            )

            }
        </BaseModal>
    )
}

export default CreateWallet