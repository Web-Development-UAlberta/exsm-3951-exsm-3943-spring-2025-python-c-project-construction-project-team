import { useState } from "react";
import { Address, PersonalInformation } from "../../../types/client_types";
import { AddressSection } from "./components/AddressSectionProps"
import { PersonalInfoSection } from "./components/PersonalInfoSection"
import { graphMe } from "../../../api/identity/graph.types";
import { updateActiveUserInfo } from "../../../api/identity/graph";
import { useMsal } from "@azure/msal-react";


interface PersonalInfoTabProps {
    graphData: graphMe | undefined;
}

const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({ graphData }) => {
    // Personal Information state
    const { instance } = useMsal();
    const updateUser = updateActiveUserInfo(instance);

    const [isEditingPersonal, setIsEditingPersonal] = useState(false);

    const [tempPersonalInfo, setTempPersonalInfo] = useState<PersonalInformation>({
        firstName: graphData?.givenName ?? "",
        lastName: graphData?.surname ?? "",
        email: graphData?.mail ?? "",
        phone: graphData?.mobilePhone ?? "",
    });

    // Address state
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [tempAddress, setTempAddress] = useState<Address>(({
        street: graphData?.streetAddress ?? "",
        city: graphData?.city ?? "",
        province: graphData?.state ?? "",
        postalCode: graphData?.postalCode ?? "",
        country: graphData?.country ?? "",
    }));


    // Personal Information handlers
    const editPersonalInfo = () => {
        setIsEditingPersonal(true);
    };

    const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTempPersonalInfo(prev => ({ ...prev, [name]: value }));
    };

    const savePersonalInfo = async () => {
        setIsEditingPersonal(false);
        try {
            await updateUser.mutateAsync({
                givenName: tempPersonalInfo.firstName,
                surname: tempPersonalInfo.lastName,
                mail: tempPersonalInfo.email,
                mobilePhone: tempPersonalInfo.phone
            });
        } catch (error) {
            console.error("Profile update failed:", error);
        }
    };

    const cancelPersonalEdit = () => {
        setIsEditingPersonal(false);
    };

    // Address handlers
    const editAddress = () => {
        setIsEditingAddress(true);
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTempAddress(prev => ({ ...prev, [name]: value }));
    };

    const saveAddress = async () => {
        setIsEditingAddress(false);
        try {
            await updateUser.mutateAsync({
                streetAddress: tempAddress.street,
                city: tempAddress.city,
                state: tempAddress.province,
                country: tempAddress.country,
                postalCode: tempAddress.postalCode,
            });
        } catch (error) {
            console.error("Address update failed:", error);
        }
    };

    const cancelAddressEdit = () => {
        setIsEditingAddress(false);
    };



    return (
        <>
            <PersonalInfoSection
                isEditing={isEditingPersonal}
                personalInfo={graphData}
                tempPersonalInfo={tempPersonalInfo}
                onEdit={editPersonalInfo}
                onCancel={cancelPersonalEdit}
                onChange={handlePersonalInfoChange}
                onSave={savePersonalInfo}
            />

            <AddressSection
                isEditing={isEditingAddress}
                address={graphData}
                tempAddress={tempAddress}
                onEdit={editAddress}
                onCancel={cancelAddressEdit}
                onChange={handleAddressChange}
                onSave={saveAddress}
            />

        </>
    )
}

export default PersonalInfoTab