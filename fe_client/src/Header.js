import React from 'react';

const Header = ({approvers, quorum}) => {
    return (
        <header>
            <ul>
                <li>Accounts: {approvers.join(', ')}</li>
                <li>quorum: {quorum}</li>
            </ul>
        </header>
    );
}

export default Header;