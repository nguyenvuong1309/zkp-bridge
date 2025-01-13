import { Listbox, Transition } from '@headlessui/react'
import { Fragment, useState, useEffect, useCallback } from 'react'

import { CheckIcon, ChevronUpDownIcon, ChevronDownIcon, ArrowRightIcon } from "@heroicons/react/20/solid"


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const Selector = ({ 
    selected,
    setSelected,
    options
}) => {
    return (
        <Listbox value={selected} onChange={setSelected}>
            {({ open }) => (
                <> 
                    <div className="relative mt-2">
                        <Listbox.Button className="relative hover:cursor-pointer w-full cursor-default rounded-md  py-3 pl-3 pr-10 text-left  shadow-sm sm:text-sm sm:leading-6  bg-white border-2 border-gray-600  placeholder-gray-400 font-medium text-black  ">
                            <span className="flex items-center">
                                <span className="mr-3 block truncate">{selected.name}</span>
                                { selected.image && (
                                    <img src={selected.image} alt="" className="h-5 w-5 ml-auto  object-cover flex-shrink-0 rounded-full" /> 
                                )

                                }
                                
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </span>
                        </Listbox.Button>
                        <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-neutral-100 placeholder-gray-400 text-white py-2 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {options.map((item) => (
                                    <Listbox.Option
                                        key={item.id}
                                        className={({ active }) =>
                                            classNames(
                                                active ? 'bg-cyan-500 text-white' : 'text-gray-900',
                                                'relative cursor-pointer select-none py-2 pl-3 pr-9'
                                            )
                                        }
                                        value={item}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <div className="flex items-center">
                                                    <span
                                                        className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block text-black truncate')}
                                                    >
                                                        {item.name}
                                                    </span>
                                                    { item.image && (<img src={item.image} alt="" className="h-5 w-5 ml-auto flex-shrink-0 object-cover rounded-full" /> )}
                                                </div>
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </>
            )}
        </Listbox>
    )
}

export default Selector