import { X } from "react-feather"


const BaseModal = ({
    visible,
    title,
    close,
    children, 
    maxWidth = "max-w-lg"
}) => {
    return (
        <>
            {visible && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
                    <div className={`relative text-black bg-white p-6 w-full ${maxWidth}  rounded-md`}>
                        <h5 className="text-xl font-bold mb-2">{title}</h5>
                        <button className="absolute top-3 right-3 text-gray-800 hover:text-gray-500" onClick={close}>
                            <X />
                        </button>
                        {children}

                    </div>
                </div>
            )}
        </>
    )
}

export default BaseModal