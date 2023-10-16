import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import toNumber from 'lodash/toNumber';

import useNearApp from 'utils/near/useNearApp';
import getErrorMessage from 'utils/getErrorMessage';
<div className="mt-4 flex justify-center">
    <img
        src="https://img.freepik.com/premium-vector/money-transfer-online-payment-send-receive-money-wireless-with-their-phone-phone-with-banking-payment-app-capital-flow-earning-financial-savings-economy-money-online-mobile-phone_662353-741.jpg?w=740"
        alt="Money Transfer"
        className="h-48 w-48 rounded-full"
    />
</div>;

export default function EnhancedNavbar() {
    const { login, logout, getAccountId, getAccountBalance } = useNearApp();
    const account = getAccountId();

    const [balance, setBalance] = useState(0);

    useEffect(() => {
        if (account) {
            getAccountBalance()
                .then(rs => {
                    setBalance(toNumber(rs));
                })
                .catch(error => {
                    toast(getErrorMessage(error), { type: 'error' });
                });
        }
    }, [account, getAccountBalance]);

    return (
        <>
            <nav className="flex items-center justify-between bg-gray-800 px-6 py-3">
                <div className="flex-1">
                    <h1 className="text-2xl font-semibold text-white">ShowMaze-NEAR</h1>
                </div>
                <div className="flex-none space-x-4">
                    {account ? (
                        <a
                            href={`https://explorer.testnet.near.org/accounts/${account}`}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="flex items-center space-x-2 text-gray-300">
                            <p className="text-white">{balance} Ⓝ</p>
                            <button
                                onClick={logout}
                                type="button"
                                className="btn btn-outline btn-warning btn-lg bg-red-500">
                                Logout
                            </button>
                        </a>
                    ) : (
                        <button onClick={login} type="button" className="btn btn-outline btn-warning btn-sm">
                            Connect Near wallet
                        </button>
                    )}
                </div>
            </nav>
        </>
    );
}
