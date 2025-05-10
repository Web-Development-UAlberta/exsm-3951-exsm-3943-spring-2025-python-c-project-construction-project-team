import { createClaimsTable } from '../../utils/claimUtils';

import '../../index.css';
import './authDataDisplay.css';

interface IdTokenDataProps {
    idTokenClaims: Record<string, string[]>;
}

interface TokenClaims {
    [index: number]: [string, string, string];
} 

export const IdTokenData = (props: IdTokenDataProps) => {
    const tokenClaims: TokenClaims = createClaimsTable(props.idTokenClaims);

    const tableRow = Object.keys(tokenClaims).map((key: any) => {
        return (
            <tr key={key}>
                {tokenClaims[key]?.map((claimItem: string) => (
                    <td key={claimItem}>{claimItem}</td>
                ))}
            </tr>
        );
    });
    return (
        <>
            <div className="data-area-div">
                <p>
                    See below the claims in your <strong> ID token </strong>. For more information, visit:{' '}
                    <span>
                        <a href="https://docs.microsoft.com/en-us/azure/active-directory/develop/id-tokens#claims-in-an-id-token">
                            docs.microsoft.com
                        </a>
                    </span>
                </p>
                <div className="claims-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Claim</th>
                                <th>Value</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>{tableRow}</tbody>
                    </table>
                </div>
            </div>
        </>
    );
};