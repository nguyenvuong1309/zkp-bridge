import { useState, useReducer, useCallback, useEffect } from "react"
import { ArrowLeft } from "react-feather"
import Link from "next/link"
import { useRouter } from 'next/router'
import Selector from "../Selector"
import Templates from "../../data/templates.json"
import Dao from "../../data/dao.json"
import ParentForm from "./ParentForm"
import ChildForm from "./ChildForm"
import CreateWallet from "@/modals/CreateWallet"

const NewDao = () => {

    const initialValue = {
        name: "",
        address: "",
        jurisdiction: "",
        dutyName: "",
        dutyTiers: [1000],
        parentId: 0,
        secret: "SECRET"
    }

    const router = useRouter()

    const [template, setTemplate] = useState(Templates[1])
    const [daoType, setDaoType] = useState(Dao.find(item => item.name.toLowerCase().includes(router.query.type)))
    const [errorMessage, setErrorMessage] = useState()
    const [modal, setModal] = useState(false)

    const [values, setValues] = useReducer(
        (currentValues, newValues) => ({ ...currentValues, ...newValues }), initialValue
    )

    const { name, address, jurisdiction, dutyName, dutyTiers, secret, parentId } = values

    const onUseTemplate = useCallback(() => {

        setValues({
            jurisdiction: template.name,
            dutyName: template.duty,
            dutyTiers: template.rates
        })
    }, [template])

    const handleChange = (event) => {
        const { name, value } = event.target
        setValues({ [name]: value })
    }

    const handleTier = useCallback((event) => {
        const { name, value } = event.target
        dutyTiers[Number(name)] = Number(value) * 100
        setValues({ dutyTiers })
    }, [dutyTiers])

    const handleParentId = (parentId) => {
        setValues({ parentId })
    }

    const moreTier = useCallback(() => {
        setValues({ dutyTiers: dutyTiers.concat([1000]) })
    }, [dutyTiers])

    const removeTier = useCallback(() => {
        setValues({ dutyTiers: dutyTiers.splice(-1) })
    }, [dutyTiers])

    useEffect(() => {
        onUseTemplate();
    }, [template])

    const onCreateWallet = useCallback(async () => {
        setErrorMessage()

        if (!name || !address || !jurisdiction || !dutyName || !secret) {
            setErrorMessage("Some fields are missing")
            return
        }

        if (address.length >= 32) {
            setErrorMessage("Address should not be longer than 32 character")
            return
        }

        setValues({ parentId : 0 })

        setModal(true)
    }, [name, address, jurisdiction, dutyName, secret])

    const onCreateWalletChild = useCallback(async () => {
        setErrorMessage()

        if (!name || !address || !jurisdiction || !dutyName || !secret || parentId === 0) {
            setErrorMessage("Some fields are missing")
            return
        }

        if (address.length >= 32) {
            setErrorMessage("Address should not be longer than 32 character")
            return
        }

        setModal(true)
    }, [name, address, jurisdiction, dutyName, secret, parentId])

    return (
        <>
            <CreateWallet
                visible={modal}
                close={() => setModal(false)}
                {...values}
            />
            <div className="ml-auto mr-auto w-full p-2 max-w-4xl mb-20">
                <div className="mb-6 p-2 ">
                    <h2 className="text-3xl text-black font-bold">Setup New DAO</h2>
                    <p className="mt-2 text-sm font-medium text-neutral-600">
                        Create a privacy on-chain wallet that enables seamless collection of crypto payments across different jurisdictions.
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                        <div className="rounded-lg  border-2 border-gray-600 flex flex-col w-full p-6 py-4 m-1 bg-white ">

                            <div className="grid grid-cols-5 gap-5 w-full text-black font-medium  ">
                                <div className="col-span-1 flex items-center justify-end mt-1">
                                    Type
                                </div>
                                <div className="col-span-3 ">
                                    <Selector
                                        selected={daoType}
                                        setSelected={setDaoType}
                                        options={Dao}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-5 gap-5 w-full text-black font-medium  ">
                                <div className="col-span-1 flex items-center justify-end mt-1">

                                </div>
                                <div className="col-span-4 ">
                                    <p className="text-xs mt-2 text-neutral-600">
                                        {daoType.description}
                                    </p>
                                </div>
                            </div>


                            <div className="px-4 my-4 mb-2">
                                <div className="border-b-2 border-gray-600">

                                </div>
                            </div>

                            {daoType.name === "Parent DAO" && <ParentForm
                                errorMessage={errorMessage}
                                handleChange={handleChange}
                                handleTier={handleTier}
                                moreTier={moreTier}
                                removeTier={removeTier}
                                onCreateWallet={onCreateWallet}
                                {...values}
                            />}
                            {/* {daoType.name === "Child DAO" && <ChildForm
                                errorMessage={errorMessage}
                                handleChange={handleChange}
                                handleTier={handleTier}
                                moreTier={moreTier}
                                removeTier={removeTier}
                                onCreateWallet={onCreateWalletChild}
                                handleParentId={handleParentId}
                                {...values}
                            />} */}

                        </div>
                    </div>
                    {/* <div className="col-span-1 px-2">
                        <h2 className="text-2xl text-black font-bold">Template</h2>
                        <p className="mt-1 text-sm font-medium text-neutral-600">
                            You can choose the following template that fits your jurisdiction
                        </p>
                        <Selector
                            selected={template}
                            setSelected={setTemplate}
                            options={Templates}
                        />
                        <div className="text-sm p-1 font-medium mt-2">
                            <table className="table-auto w-full text-gray-800">
                                <tbody>
                                    <tr>
                                        <td className="w-2/5 py-2 border-b-2  border-gray-600">Duty Name</td>
                                        <td className="w-3/5 py-2 text-right border-b-2 border-gray-600">
                                            {template.duty || "None"}
                                        </td>
                                    </tr>
                                    {template.rates.map((rate, index) => {
                                        return (
                                            <tr key={index}>
                                                <td className="w-2/5 py-2   border-b-2  border-gray-600">Tier-{index + 1}</td>
                                                <td className="w-3/5 py-2 text-right border-b-2 border-gray-600">
                                                    {rate / 100}%
                                                </td>
                                            </tr>
                                        )
                                    })}

                                </tbody>
                            </table>
                        </div>
                        <div className="py-4">
                            <button onClick={onUseTemplate} className="bg-black font-bold w-full  text-sm py-2 px-8 rounded-md text-white">
                                Use
                            </button>
                        </div>
                    </div> */}
                </div>
            </div>
        </>
    )
}

export default NewDao