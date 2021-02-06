import React, { useState } from 'react';

const NewTransfer = ({sendTransfer}) => {

    const [transfer, setTransfer] = useState(undefined);

    const updateTransfer = (e, field) => {
        const value = e.target.value;
        setTransfer({...transfer, [field]: value});         // destructure obj to update only relevant fields   
    }

    const handleSubmit = e => {
        e.preventDefault();                                 // prevent form to POST data and do a page reload
        sendTransfer(transfer);
    }

    return (
        <form onSubmit={e => handleSubmit(e)}>
            <label for="amount">Amount</label><br></br>
            <input id="amount" type="number" min="0" onChange={e => updateTransfer(e, 'amount')}></input><br></br>
            <label for="to">To</label><br></br>
            <input id="to" type="text" onChange={e => updateTransfer(e, 'to')}></input><br></br><br></br>
            <button type="submit">Submit</button>
        </form>
    );
}

export default NewTransfer;