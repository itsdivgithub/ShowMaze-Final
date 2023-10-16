import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { toast } from 'react-toastify';

import Layout from 'components/layout';
import TicketCard from 'components/ticket/TicketCard';

import { ROUTERS } from 'routers';
import AddTicket from 'components/ticket/AddTicket';
import useNearApp from 'utils/near/useNearApp';
import useTicket, { type Ticket } from 'utils/near/useTicket';
import getErrorMessage from 'utils/getErrorMessage';

const Home: NextPageProps = () => {
    const { login, getAccountId } = useNearApp();
    const { getTickets, buyTicket, initialTicket } = useTicket();
    const account = getAccountId();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [openAddTicket, setOpenAddTicket] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchTickets = useCallback(async () => {
        if (account) {
            setTickets(await getTickets());
        }
    }, [account, getTickets]);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const handleBuyTicket = useCallback(
        async ({ id, price }: Pick<Ticket, 'id' | 'price'>) => {
            try {
                await buyTicket({ id, price });

                fetchTickets();
            } catch (error) {
                toast(getErrorMessage(error), { type: 'error' });
            }
        },
        [buyTicket, fetchTickets],
    );

    const handleOpenAddTicketModal = useCallback(() => {
        setOpenAddTicket(true);
    }, []);

    const handleCloseAddTicketModal = useCallback(() => {
        setOpenAddTicket(false);
    }, []);

    const handleSubmitAddTicket = useCallback(
        async (newTicket: Ticket) => {
            try {
                setLoading(true);

                await initialTicket(newTicket);

                toast('Add ticket success', { type: 'success' });
                setOpenAddTicket(false);
                fetchTickets();
            } catch (error) {
                toast(getErrorMessage(error), { type: 'error' });
            } finally {
                setLoading(false);
            }
        },
        [fetchTickets, initialTicket],
    );

    return (
        <>
            <Head>
                <title>{ROUTERS.HOME.title}</title>
            </Head>

            <div className="bg-accent hero min-h-full">
                <div className="img hero min-h-screen">
                    <img src="/culture.png" alt="image"></img>
                </div>
                <div className="hero-content flex flex-col">
                    <h1 style={{ fontSize: '4rem', fontWeight: 'bold' }}>Welcome to ShowMaze-IndiaXNear</h1>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>Your best Indain cultural shows booking partner.</p>

                    {account ? (
                        <>
                            <button
                                onClick={handleOpenAddTicketModal}
                                type="button"
                                className="btn btn-warning btn-active btn-lg">
                                Create Tickets Here
                            </button>

                            <div className="grid grid-cols-2 gap-2">
                                {tickets.map(ticket => (
                                    <TicketCard
                                        key={ticket.id}
                                        ticket={ticket}
                                        onBuyTicket={() => handleBuyTicket({ id: ticket.id, price: ticket.price })}
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <button onClick={login} type="button" className="btn btn-warning btn-active btn-lg">
                            Connect Near Wallet
                        </button>
                    )}
                </div>
            </div>

            <AddTicket
                open={openAddTicket}
                onSubmit={handleSubmitAddTicket}
                onClose={handleCloseAddTicketModal}
                loading={loading}
            />
        </>
    );
};

Home.Layout = Layout;

export default Home;
