import React from 'react';

function TransferList ({transfers, approveTransfer}) {
    return (
        <>
        <h2>Transfers List</h2>
        <table>
            <thead><tr>
                <td>Id</td>
                <td>Amount</td>
                <td>To</td>
                <td>Approvals</td>
                <td>Sent</td>
            </tr></thead>
            <tbody>
                {transfers.map(transfer => {
                    const btnState = transfer.approvals >= 2 ? "disabled" : "";
                    return(
                    <tr key={transfer.id}>
                        <td>{transfer.id}</td>
                        <td>{transfer.amount}</td>
                        <td>{transfer.to}</td>
                        <td>
                            {transfer.approvals}
                            <button onClick={() => approveTransfer(transfer.id)} className={btnState}>
                                Approve
                            </button>
                        </td>
                        <td>{transfer.sent ? 'yes' : 'no'}</td>
                    </tr>
                    );
                })}
            </tbody>
        </table>
        </>
    )
}

export default TransferList;