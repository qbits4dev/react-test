import {React} from 'react';
import {CHeader,CContainer} from '@coreui/react';

export default function HeaderInvoice() {
    return(
        <CHeader className="mb-4" position="sticky">
            <CContainer fluid>
                <h3>Invoice</h3>
            </CContainer>
        </CHeader>
    )
}