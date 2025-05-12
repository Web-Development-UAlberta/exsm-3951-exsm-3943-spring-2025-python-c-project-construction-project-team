import { useState } from "react";
import { Address, PersonalInformation } from "../../../types/client_types";
import { AddressSection } from "./components/AddressSectionProps"
import { PersonalInfoSection } from "./components/PersonalInfoSection"

const PersonalInfoTab = () => {
    // Personal Information state
    const [isEditingPersonal, setIsEditingPersonal] = useState(false);
    const [personalInfo, setPersonalInfo] = useState<PersonalInformation>({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@gmail.com',
        phone: '123-456-7890'
    });
    const [tempPersonalInfo, setTempPersonalInfo] = useState<PersonalInformation>({ ...personalInfo });

    // Address state
    const [address, setAddress] = useState<Address>({
        fullName: 'John Doe',
        street: '99 Maple St',
        city: 'Calgary',
        province: 'Alberta',
        postalCode: 'Q1Q 0P0',
        country: 'Canada'
    });
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [tempAddress, setTempAddress] = useState<Address>({ ...address });


    // Personal Information handlers
    const editPersonalInfo = () => {
        setTempPersonalInfo({ ...personalInfo });
        setIsEditingPersonal(true);
    };

    const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTempPersonalInfo(prev => ({ ...prev, [name]: value }));
    };

    const savePersonalInfo = () => {
        setPersonalInfo(tempPersonalInfo);
        setIsEditingPersonal(false);
    };

    const cancelPersonalEdit = () => {
        setIsEditingPersonal(false);
    };

    // Address handlers
    const editAddress = () => {
        setTempAddress({ ...address });
        setIsEditingAddress(true);
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTempAddress(prev => ({ ...prev, [name]: value }));
    };

    const saveAddress = () => {
        setAddress(tempAddress);
        setIsEditingAddress(false);
    };

    const cancelAddressEdit = () => {
        setIsEditingAddress(false);
    };



    return (
        <>
            <PersonalInfoSection
                isEditing={isEditingPersonal}
                personalInfo={personalInfo}
                tempPersonalInfo={tempPersonalInfo}
                onEdit={editPersonalInfo}
                onCancel={cancelPersonalEdit}
                onChange={handlePersonalInfoChange}
                onSave={savePersonalInfo}
            />

            <AddressSection
                isEditing={isEditingAddress}
                address={address}
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