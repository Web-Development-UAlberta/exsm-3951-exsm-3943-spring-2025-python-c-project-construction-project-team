import { graphMe } from "../../../api/identity/graph.types";

interface PersonalInfoTabProps {
    graphData: graphMe | undefined;
}

const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({ graphData }) => {

    const onClick = () => {
        window.location.href = "https://myaccount.microsoft.com/";
    }

    return (
        <div className="mb-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Personal Information</h3>
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
                    <span>{graphData?.mobilePhone ?? "N/A"}</span>
                </div>
                <div className="col-md-6 mb-3">
                    <label className="fw-bold d-block">Address</label>
                    <span>{graphData?.streetAddress}</span>
                    <span>{graphData?.city}, {graphData?.state} {graphData?.postalCode} </span>
                    <span>{graphData?.country}</span>
                </div>
            </div>
        </div>
    )
}

export default PersonalInfoTab