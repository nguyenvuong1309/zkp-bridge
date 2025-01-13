import { ArrowRight } from "react-feather"
import { NumberInput, TextArea, TextInput } from "../Input"
import { useState, useReducer, useCallback } from "react"

const ParentForm = ({
    errorMessage,
    name,
    secret,
    address,
    jurisdiction,
    dutyName,
    dutyTiers,
    handleChange,
    handleTier,
    moreTier,
    removeTier,
    onCreateWallet
}) => {

    return (
        <div>
            {/* ENTITY NAME */}
            <div className="grid grid-cols-5 gap-5 w-full text-black font-medium  ">
                <div className="col-span-1 flex items-center justify-end mt-1">
                    DAO Name
                </div>
                <div className="col-span-3 ">
                    <TextInput
                        name={"name"}
                        value={name}
                        handleChange={handleChange}
                        placeholder={"DAO Legal Name ex. DAOCheck LLC"}
                    />
                </div>
            </div>

            {/* ENTITY ADDRESS */}
            <div className="grid grid-cols-5 gap-5 mt-1 w-full text-black font-medium  ">
                <div className="col-span-1 flex  justify-end mt-[18px]">
                    Address
                </div>
                <div className="col-span-3 ">
                    <TextArea
                        name={"address"}
                        value={address}
                        handleChange={handleChange}
                        placeholder={"DAO Legal Address ex. 611 Beacon St. Loves Park, IL 61111 United States"}
                    />
                </div>
            </div>

            {/* ENTITY JURISDICTION */}

            {/* <div className="grid grid-cols-5 gap-5 w-full text-black font-medium  ">
                <div className="col-span-1 flex items-center justify-end mt-1">
                    Jurisdiction
                </div>
                <div className="col-span-3 ">
                    <TextInput
                        name={"jurisdiction"}
                        value={jurisdiction}
                        handleChange={handleChange}
                        placeholder={"DAO Jurisdiction ex. Singapore"}
                    />
                </div>
            </div> */}

            {/* DUTY NAME */}

            {/* <div className="grid grid-cols-5 gap-5 mt-1 w-full text-black font-medium  ">
                <div className="col-span-1 flex items-center justify-end mt-1">
                    Duty Name
                </div>
                <div className="col-span-3 ">
                    <TextInput
                        name={"dutyName"}
                        value={dutyName}
                        handleChange={handleChange}
                        placeholder={"Duty Name ex. GST"}
                    />
                </div>
            </div> */}

            {/* DUTY TIERS */}

            {/* <div className="grid grid-cols-5 gap-5 mt-1 w-full text-black font-medium  ">

                {dutyTiers.map((item, index) => {
                    return (
                        <>
                            <div className="col-span-1 flex items-center justify-end mt-1">
                                Duty Tier-{index + 1}
                            </div>
                            <div className="col-span-1 flex flex-row ">
                                <NumberInput
                                    value={item / 100}
                                    name={index}
                                    handleChange={handleTier}
                                />
                                <div className="mt-auto mb-auto ml-2 pt-1">
                                    %
                                </div>

                            </div>
                        </>
                    )
                })
                }

                <div className="col-span-1 flex pt-2">
                    <button onClick={removeTier} disabled={dutyTiers.length === 1} className={`bg-black font-bold mt-auto mb-auto text-sm py-1 px-2 rounded-md mr-1 text-white ${dutyTiers.length === 1 && "opacity-60"}`}>
                        -
                    </button>
                    <button onClick={moreTier} disabled={dutyTiers.length === 2} className={`bg-black font-bold mt-auto mb-auto text-sm py-1 px-2 rounded-md text-white ${dutyTiers.length === 2 && "opacity-60"}`}>
                        +
                    </button>
                </div>
            </div>

            <div className="px-2 pt-1 my-4 mb-2">
                <div className="border-b-2 border-gray-600">

                </div>
            </div> */}

            {/* SECRET */}
            <div className="grid grid-cols-5 gap-5 w-full text-black font-medium  ">
                <div className="col-span-1 flex items-center justify-end mt-1">
                    Passcode
                </div>
                <div className="col-span-3 ">
                    <TextInput
                        name={"secret"}
                        value={secret}
                        handleChange={handleChange}
                        placeholder={"DAO Legal Name ex. DAOCheck LLC"}
                    />
                </div>
            </div>
            <div className="grid grid-cols-5 gap-5 w-full text-black font-medium  ">
                <div className="col-span-1 flex items-center justify-end mt-1">

                </div>
                <div className="col-span-3 ">
                    <p className="text-xs mt-2 text-neutral-600">
                   This allows you to access financial transactions and withdraw payments belonging to your DAO.
                    </p>
                </div>
            </div>

            <div className="py-4 px-2 pb-[6px] mt-2">
                <button onClick={onCreateWallet} className="bg-black flex flex-row items-center justify-center font-bold w-full  py-3 px-8 rounded-md text-white">
                    Next<ArrowRight className="ml-1" />
                </button>
            </div>
            <div className="w-full max-w-md ml-auto mr-auto">
                {errorMessage && <p className="text-xs text-center mb-1 text-blue-700 font-bold">
                    {errorMessage}
                </p>}
                <p className="text-xs text-center font-medium text-black">
                    This will create on-chain wallets that belong to your DAO, with a wallet for each tier. Only your account can track transactions and withdraw funds
                </p>
            </div>
        </div>
    )
}

export default ParentForm