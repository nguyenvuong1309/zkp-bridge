import { useCallback, useState } from "react"
import BaseModal from "./Base"
import { TextInput } from "@/components/Input"

const Passcode = ({
    close,
    visible,
    onSave,
    defaultValue
}) => {

    const [value, setValue] = useState(defaultValue)

    return (
        <BaseModal
            visible={visible}
            close={close}
            title={"Update Passcode"}
        >
            <div className="text-sm max-w-lg font-medium text-neutral-800">
                The passcode is a secret phrase used to access your financial transactions and make withdrawals.
            </div>
            <div className="grid grid-cols-7 mt-2 gap-5 w-full text-black font-medium  ">
                <div className="col-span-2 flex items-center justify-end mt-1">
                    Your Passcode
                </div>
                <div className="col-span-4 ">
                    <TextInput
                        name={"passcode"}
                        value={value}
                        handleChange={(e) => setValue(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex pt-4">
                <button onClick={() => {
                    onSave(value)
                    close()
                }} className="rounded-md ml-auto mr-auto bg-black py-2 mt-auto mb-auto px-8 font-medium text-white ">
                    Save
                </button>
            </div>
        </BaseModal>
    )

}

export default Passcode