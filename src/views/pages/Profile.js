import React, { useEffect, useState } from "react";
import {
    CCard,
    CCardBody,
    CContainer,
    CRow,
    CCol,
    CForm,
    CFormInput,
    CFormLabel,
    CFormSelect,
    CButton,
} from "@coreui/react";

export default function UserProfile() {
    const [profile, setProfile] = useState({
        userId: localStorage.getItem('user_id'),

        photoUrl: "src/assets/images/avatars/3.jpg",
        photoFile: null,
        aadhaarFileName: "dummy_aadhaar.pdf",
        panFileName: "dummy_pan.pdf",
        firstName: '',
        lastName: '',
        fatherName: '',
        spouseName: '',
        dob: '',
        age: '',
        gender: '',
        email: '',
        phone: '',
        occupation: '',
        workExperience: '',
        language: 'English',
        maritalStatus: '',
        education: '',
        designation: '',
        nomineeName: '',
        nomineeRelation: '',
        nomineeContact: '',
        bankName: '',
        branchName: '',
        accountNumber: '',
        ifsc: '',
        permanentAddress: '',
        presentAddress: '',
        referenceagent: '',
        agentteam: '',
    });

    useEffect(() => {
        console.log("working");
        const userId = ${JSON.parse(localStorage.getItem('user') || '{}').u_id || ''};
        console.log("User ID in profile:", userId);
        if (!userId) return;

        // Fetch user data
        const apiBaseUrl = globalThis.apiBaseUrl;
        console.log("API Base URLin profile:", apiBaseUrl);
        fetch(`${apiBaseUrl}/users/${userId}`)
            .then((response) => response.json())
            .then((data) => {
                setProfile((prev) => ({
                    ...prev,
                    firstName: data.first_name || '',
                    lastName: data.last_name || '',
                    fatherName: data.father_name || '',
                    dob: data.dob || '',
                    gender: data.gender || '',
                    email: data.email || '',
                    phone: data.mobile || '',
                    occupation: data.role || '',
                    workExperience: data.work_experience || '',
                    language: 'English',
                    maritalStatus: data.marital_status || '',
                    education: data.education || '',
                    designation: data.designation || '',
                    nomineeName: data.nominiee || '',
                    nomineeRelation: data.relationship || '',
                    nomineeContact: data.nominee_mobile || '',
                    bankName: data.bank_name || '',
                    branchName: data.branch || '',
                    accountNumber: data.account_number || '',
                    ifsc: data.ifsc_code || '',
                    permanentAddress: data.address || '',
                    presentAddress: data.address || '',
                    referenceagent: data.reference_agent || '',
                    agentteam: data.agent_team || '',
                }));
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
            });

        // Fetch profile photo
        const photoUrl = `${apiBaseUrl}/photo?u_id=${userId}`;
        fetch(photoUrl)
            .then((response) => response.blob())
            .then((imageBlob) => {
                const imageObjectURL = URL.createObjectURL(imageBlob);
                setProfile((prev) => ({
                    ...prev,
                    photoUrl: imageObjectURL,
                }));
            })
            .catch((error) => {
                console.error('Error fetching profile photo:', error);
                // Fallback to default avatar if photo fetch fails
                setProfile((prev) => ({
                    ...prev,
                    photoUrl: 'src/assets/images/avatars/3.jpg',
                }));
            });
    }, []);

    const [errors, setErrors] = useState({ email: "", phone: "", photoFile: "" });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "photoFile") {
            if (files.length > 0) {
                const file = files[0];
                if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
                    setErrors((prev) => ({ ...prev, photoFile: "Only JPG/PNG allowed" }));
                    return;
                }
                setProfile((prev) => ({
                    ...prev,
                    photoFile: file,
                    photoUrl: URL.createObjectURL(file),
                }));
                setErrors((prev) => ({ ...prev, photoFile: "" }));
            }
        } else {
            setProfile((prev) => ({ ...prev, [name]: value }));
        }
    };

    const validate = () => {
        let newErrors = { email: "", phone: "", photoFile: "" };
        if (!/^[0-9]{10}$/.test(profile.phone)) newErrors.phone = "Enter 10 digit phone number";
        if (profile.email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(profile.email))
            newErrors.email = "Invalid email";
        setErrors(newErrors);
        return !newErrors.email && !newErrors.phone && !newErrors.photoFile;
    };

    const handleSubmit = () => {
        if (!validate()) return;
        alert("Profile updated successfully");
    };

    const renderField = (label, value, name, type = "text", options = []) => {
        if (type === "select") {
            return (
                <CFormSelect name={name} value={value} onChange={handleChange} className="mb-3">
                    <option value="">Select {label}</option>
                    {options.map((opt, idx) => (
                        <option key={idx} value={opt}>
                            {opt}
                        </option>
                    ))}
                </CFormSelect>
            );
        }
        if (type === "file") {
            return (
                <>
                    <CFormInput
                        type="file"
                        name={name}
                        accept="image/jpeg,image/png"
                        onChange={handleChange}
                        className="mb-3"
                    />
                    {errors.photoFile && <small className="text-danger">{errors.photoFile}</small>}
                </>
            );
        }
        return (
            <CFormInput
                name={name}
                value={value}
                onChange={handleChange}
                readOnly={type === "readonly"}
                className="mb-3"
            />
        );
    };

    return (
        <div className="bg-white min-vh-100 py-5">
            <CContainer>
                <CRow className="justify-content-center mb-5">
                    <CCol md={12} className="text-center">
                        {profile.photoUrl ? (
                            <img
                                src={profile.photoUrl}
                                alt="Profile"
                                className="rounded-circle shadow-sm mb-3"
                                width={150}
                                height={150}
                            />
                        ) : (
                            <div className="rounded-circle shadow-sm mb-3 bg-secondary d-inline-flex align-items-center justify-content-center"
                                style={{ width: 150, height: 150 }}>
                                <span className="text-white">Loading...</span>
                            </div>
                        )}
                        <div className="fw-bold fs-5">User ID: {profile.userId}</div>
                    </CCol>
                </CRow>

                <CRow className="justify-content-center">
                    <CCol lg={8}>
                        {/* Personal Details */}
                        <CCard className="shadow-sm rounded-4 p-4 mb-4 bg-light">
                            <h5 className="text-primary mb-4">Personal Details</h5>
                            <CFormLabel>First Name</CFormLabel>
                            {renderField("First Name", profile.firstName, "firstName")}
                            <CFormLabel>Last Name</CFormLabel>
                            {renderField("Last Name", profile.lastName, "lastName")}
                            <CFormLabel>Father Name</CFormLabel>
                            {renderField("Father Name", profile.fatherName, "fatherName")}
                            <CFormLabel>Spouse Name</CFormLabel>
                            {renderField("Spouse Name", profile.spouseName, "spouseName")}
                            <CFormLabel>Date of Birth</CFormLabel>
                            {renderField("DOB", profile.dob, "dob", "date")}
                            <CFormLabel>Age</CFormLabel>
                            {renderField("Age", profile.age, "age", "readonly")}
                            <CFormLabel>Gender</CFormLabel>
                            {renderField("Gender", profile.gender, "gender", "select", ["Male", "Female"])}
                            <CFormLabel>Email</CFormLabel>
                            {renderField("Email", profile.email, "email")}
                            {errors.email && <small className="text-danger">{errors.email}</small>}
                            <CFormLabel>Phone</CFormLabel>
                            {renderField("Phone", profile.phone, "phone")}
                            {errors.phone && <small className="text-danger">{errors.phone}</small>}
                            <CFormLabel>Occupation</CFormLabel>
                            {renderField("Occupation", profile.occupation, "occupation")}
                            <CFormLabel>Work Experience</CFormLabel>
                            {renderField("Work Experience", profile.workExperience, "workExperience")}
                            <CFormLabel>Language</CFormLabel>
                            {renderField("Language", profile.language, "language", "select", ["English", "Telugu", "Hindi"])}
                            <CFormLabel>Marital Status</CFormLabel>
                            {renderField("Marital Status", profile.maritalStatus, "maritalStatus", "select", ["Married", "Unmarried"])}
                            <CFormLabel>Education</CFormLabel>
                            {renderField("Education", profile.education, "education")}
                            <CFormLabel>Designation</CFormLabel>
                            {renderField("Designation", profile.designation, "designation")}
                            <CFormLabel>Permanent Address</CFormLabel>
                            {renderField("Permanent Address", profile.permanentAddress, "permanentAddress")}
                            <CFormLabel>Present Address</CFormLabel>
                            {renderField("Present Address", profile.presentAddress, "presentAddress")}
                        </CCard>

                        {/* Bank Details */}
                        <CCard className="shadow-sm rounded-4 p-4 mb-4 bg-light">
                            <h5 className="text-primary mb-4">Bank Details</h5>
                            <CFormLabel>Bank Name</CFormLabel>
                            {renderField("Bank Name", profile.bankName, "bankName")}
                            <CFormLabel>Branch Name</CFormLabel>
                            {renderField("Branch Name", profile.branchName, "branchName")}
                            <CFormLabel>Account Number</CFormLabel>
                            {renderField("Account Number", profile.accountNumber, "accountNumber")}
                            <CFormLabel>IFSC</CFormLabel>
                            {renderField("IFSC", profile.ifsc, "ifsc")}
                        </CCard>

                        {/* Nominee Details */}
                        <CCard className="shadow-sm rounded-4 p-4 mb-4 bg-light">
                            <h5 className="text-primary mb-4">Nominee Details</h5>
                            <CFormLabel>Nominee Name</CFormLabel>
                            {renderField("Nominee Name", profile.nomineeName, "nomineeName")}
                            <CFormLabel>Relation</CFormLabel>
                            {renderField("Relation", profile.nomineeRelation, "nomineeRelation")}
                            <CFormLabel>Contact</CFormLabel>
                            {renderField("Contact", profile.nomineeContact, "nomineeContact")}
                        </CCard>

                        <CCard className="shadow-sm rounded-4 p-4 mb-4 bg-light">
                            <h5 className="text-primary mb-4">Reference Details</h5>
                            <CFormLabel>Reference Agent</CFormLabel>
                            {renderField("Reference Agent", profile.referenceagent, "referenceagent")}
                            <CFormLabel>Agent Team</CFormLabel>
                            {renderField("Agent Team", profile.agentteam, "agentteam")}
                        </CCard>

                        {/* Documents */}
                        <CCard className="shadow-sm rounded-4 p-4 mb-5 bg-light">
                            <h5 className="text-primary mb-4">Documents</h5>
                            <CFormLabel>Photo (JPG/PNG)</CFormLabel>
                            {renderField("Photo", profile.photoFile, "photoFile", "file")}
                            <CFormLabel>Aadhaar Document</CFormLabel>
                            {renderField("Aadhaar", profile.aadhaarFileName, "aadhaarFileName", "readonly")}
                            <CFormLabel>PAN Document</CFormLabel>
                            {renderField("PAN", profile.panFileName, "panFileName", "readonly")}
                        </CCard>

                        <div className="d-flex justify-content-center mb-5">
                            <CButton color="success" size="lg" onClick={handleSubmit}>
                                Save Changes
                            </CButton>
                        </div>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    );
}
