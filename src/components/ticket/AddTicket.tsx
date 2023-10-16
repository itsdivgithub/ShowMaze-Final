import React from 'react';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import clsx from 'clsx';

import type { Ticket } from 'utils/near/useTicket';

interface TicketFormModalProps {
    open: boolean;
    loading: boolean;
    onSubmit: (newTicket: Ticket) => void;
    onClose: () => void;
}

const ticketSchema = yup
    .object({
        name: yup.string().required(),
        description: yup.string().required(),
        image: yup.string().required(),
        price: yup.number().positive().required(),
        remaining: yup.number().positive().required(),
    })
    .required();

export default function TicketFormModal({ open, loading, onSubmit, onClose }: TicketFormModalProps) {
    const { register, handleSubmit, reset } = useForm<Ticket>({
        mode: 'onChange',
        resolver: yupResolver(ticketSchema),
    });

    const handleFormSubmit = handleSubmit(data => {
        onSubmit(data);
    });

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={() => null}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl">
                <h2 className="mb-4 text-2xl font-semibold">Add New Show Ticket</h2>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="form-control">
                        <label htmlFor="name" className="label">
                            Name
                        </label>
                        <input type="text" className="input input-bordered" id="name" {...register('name')} />
                    </div>
                    <div className="form-control">
                        <label htmlFor="description" className="label">
                            Description
                        </label>
                        <input
                            type="text"
                            className="input input-bordered"
                            id="description"
                            {...register('description')}
                        />
                    </div>
                    <div className="form-control">
                        <label htmlFor="image" className="label">
                            Image
                        </label>
                        <input type="text" className="input input-bordered" id="image" {...register('image')} />
                    </div>
                    <div className="form-control">
                        <label htmlFor="price" className="label">
                            Price
                        </label>
                        <input
                            type="number"
                            className="input input-bordered"
                            id="price"
                            onKeyDown={e => {
                                if (e.key === '-' || e.key === '+') {
                                    e.preventDefault();
                                }
                            }}
                            {...register('price')}
                        />
                    </div>
                    <div className="form-control">
                        <label htmlFor="remaining" className="label">
                            Total
                        </label>
                        <input
                            type="number"
                            className="input input-bordered"
                            id="remaining"
                            onKeyDown={e => {
                                if (e.key === '-' || e.key === '+') {
                                    e.preventDefault();
                                }
                            }}
                            {...register('remaining')}
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={handleClose}
                            type="button"
                            className={clsx('btn btn-secondary', {
                                'btn-disabled': loading,
                            })}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={clsx('btn btn-warning', {
                                'btn-disabled loading': loading,
                            })}>
                            {loading ? 'Loading' : 'Submit'}
                        </button>
                    </div>
                </form>
            </Dialog.Panel>
        </Dialog>
    );
}
