import React, { memo, useMemo } from 'react';
import { formatNearAmount } from 'near-api-js/lib/utils/format';
import clsx from 'clsx';
import toNumber from 'lodash/toNumber';
import toString from 'lodash/toString';
import truncate from 'lodash/truncate';

import type { Ticket } from 'utils/near/useTicket';

interface TicketCardProps {
    ticket: Ticket;
    onBuyTicket: () => void;
}

function TicketCard({ ticket, onBuyTicket }: TicketCardProps) {
    const price = useMemo(() => formatNearAmount(toString(ticket.price), 2), [ticket.price]);
    const remaining = useMemo(() => toNumber(ticket.remaining), [ticket.remaining]);
    const sold = useMemo(() => toNumber(ticket.sold), [ticket.sold]);

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-lg">
            <div className="relative">
                <img src={ticket.image} className="h-56 w-full object-cover" alt="ticket_img" />
                <div className="absolute right-2 top-2 rounded-md border-black bg-white px-2 py-1">
                    <span className="text-black">Sold: {sold}</span>
                </div>
            </div>
            <div className="bg-accent p-4">
                <h2 className="text-lg font-semibold">{truncate(ticket.name, { length: 30 })}</h2>
                <p className="mt-2 text-black">{truncate(ticket.description, { length: 80 })}</p>
                <div className="mt-2 flex items-center justify-between">
                    <p className={clsx('text-black', { 'line-through': !remaining })}>
                        Cost: <span className="font-semibold">{price} Ⓝ</span>
                    </p>
                    <br />
                    <p className="text-sm">{remaining > 0 ? `${remaining} tickets left` : 'Sold out'}</p>
                </div>
                <div className="mt-4">
                    <button
                        onClick={onBuyTicket}
                        className={clsx(
                            'w-full rounded-md bg-yellow-600 px-4 py-2 font-semibold text-white focus:outline-none',
                            {
                                'cursor-not-allowed opacity-50': !remaining,
                            },
                        )}
                        disabled={!remaining}>
                        Grab Ticket
                    </button>
                </div>
            </div>
        </div>
    );
}

export default memo(TicketCard);
