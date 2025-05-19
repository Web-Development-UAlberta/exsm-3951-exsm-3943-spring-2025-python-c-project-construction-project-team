import { graphMe } from "../../../api/identity/graph.types";

interface PersonalInfoTabProps {
    graphData: graphMe | undefined;
}

const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({ graphData }) => {

    const onClick = () => {
        window.location.href = "https://myaccount.microsoft.com/";
    }


    return (
        <>
            <div className="mb-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="border-bottom w-100 pb-2">Personal Information</h3>
                    <button
                        className="btn btn-sm btn-outline-secondary ms-3"
                        onClick={onClick}
                    >
                        Edit
                    </button>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="fw-bold d-block">First Name</label>
                        <span>{graphData?.givenName}</span>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="fw-bold d-block">Last Name</label>
                        <span>{graphData?.surname}</span>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="fw-bold d-block">Email Address</label>
                        <span>{graphData?.mail}</span>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="fw-bold d-block">Phone Number</label>
                        <span>{graphData?.mobilePhone}</span>
                    </div>
                </div>

            </div>

            <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="border-bottom w-100 pb-2">Address</h3>
                    <button
                        className="btn btn-sm btn-outline-secondary ms-3"
                        onClick={onClick}
                    >
                        Edit
                    </button>
                </div>

                {/* Display address */}

                <div className="p-3 mb-3">
                    <div className="d-flex justify-content-between">
                        <div>
                            <div>{graphData?.streetAddress}</div>
                            <div>{graphData?.city}, {graphData?.state} {graphData?.postalCode}</div>
                            <div>{graphData?.country}</div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default PersonalInfoTab