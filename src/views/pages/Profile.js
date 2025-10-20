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
    const [profile, setProfile] = useState(() => ({
        userId: JSON.parse(localStorage.getItem('user') || '{}').u_id || '',

        photoUrl: "src/assets/images/avatars/3.jpg",
        photoFile: null,
        aadhaarFileName: "dummy_aadhaar.pdf",
        panFileName: "dummy_pan.pdf",
        // add file holders for document inputs
        aadhaarFile: null,
        panFile: null,
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
    }));

    useEffect(() => {
        console.log("working");
        const userId = JSON.parse(localStorage.getItem('user') || '{}').u_id || '';
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

        // Use profile photo from localStorage instead of fetching from API
        try {
            const userId = JSON.parse(localStorage.getItem('user') || '{}').u_id || '';
            const storageKey = `profile_photo_${userId || 'anon'}`;
            // Try per-user key first
            let storedPhoto = localStorage.getItem(storageKey);
            // If not present, try legacy global key and migrate it to per-user key
            if (!storedPhoto) {
                const legacy = localStorage.getItem('profile_photo');
                if (legacy) {
                    // Normalize legacy before saving: detect data/http/blob or raw base64
                    let normalized = legacy;
                    const isData = normalized.startsWith('data:');
                    const isHttp = /^https?:\/\//i.test(normalized);
                    const isBlob = normalized.startsWith('blob:');
                    if (!isData && !isHttp && !isBlob) {
                        const trimmed = normalized.replace(/^\/+/, '');
                        if (/^9j\//.test(trimmed) || /^9j/.test(trimmed)) {
                            normalized = 'data:image/jpeg;base64,' + trimmed;
                        } else {
                            // default to png if it doesn't look like jpeg
                            normalized = 'data:image/png;base64,' + trimmed;
                        }
                    }
                    try {
                        localStorage.setItem(storageKey, normalized);
                        // Remove legacy global key after successful migration
                        localStorage.removeItem('profile_photo');
                        storedPhoto = normalized;
                      } catch (e) {
                        // If migration fails, fall back to using the raw legacy value without removing it
                        storedPhoto = legacy;
                      }
                }
            }
             if (storedPhoto) {
                 // Normalize different stored formats:
                 // - full data URL (data:image/...) -> use as-is
                 // - absolute/relative URL (http:// or /path or blob:) -> use as-is
                 // - raw base64 fragment (e.g. starting with /9j/4AAQ or 9j/4AAQ) -> prefix with data URL
                 let photoUrl = storedPhoto;
                 const isDataUrl = photoUrl.startsWith('data:');
                 const isHttpUrl = /^https?:\/\//i.test(photoUrl);
                 const isBlobUrl = photoUrl.startsWith('blob:');
                 if (!isDataUrl && !isHttpUrl && !isBlobUrl) {
                     // Remove accidental leading slashes
                     const trimmed = photoUrl.replace(/^\/+/, '');
                     // Heuristic: base64 JPEG often starts with '/9j/' or '9j/' (base64 of JPEG header)
                     if (/^9j\//.test(trimmed) || /^9j/.test(trimmed)) {
                         photoUrl = 'data:image/jpeg;base64,' + trimmed;
                     } else {
                         // If it doesn't look like base64, keep the trimmed value so it resolves as a relative path
                         photoUrl = trimmed;
                     }
                 }
                 setProfile((prev) => ({
                     ...prev,
                     photoUrl,
                 }));
             } else {
                 // keep the default avatar if no photo in localStorage
                 setProfile((prev) => ({ ...prev, photoUrl: 'src/assets/images/avatars/3.jpg' }));
             }
         } catch (e) {
             console.error('Error reading profile photo from localStorage:', e);
             setProfile((prev) => ({ ...prev, photoUrl: 'src/assets/images/avatars/3.jpg' }));
         }

        // NOTE: storage event listener removed. The component now reads profile_photo from localStorage on mount only.

        // cleanup: no storage listener to remove
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
        } else if (name === "aadhaarFile" || name === "panFile") {
            if (files.length > 0) {
                const file = files[0];
                // allow PDFs and common image types for documents
                const allowed = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
                if (!allowed.includes(file.type)) {
                    setErrors((prev) => ({ ...prev, photoFile: "Only PDF/JPG/PNG allowed for documents" }));
                    return;
                }
                setProfile((prev) => ({
                    ...prev,
                    // store file object as well as human-readable filename
                    [name]: file,
                    // map aadhaarFile -> aadhaarFileName, panFile -> panFileName
                    [name === 'aadhaarFile' ? 'aadhaarFileName' : 'panFileName']: file.name,
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
            // determine accept string based on field name
            let accept = "image/jpeg,image/png";
            if (name === 'aadhaarFile' || name === 'panFile') {
                accept = "application/pdf,image/jpeg,image/png";
            }
            return (
                <>
                    <CFormInput
                        type="file"
                        name={name}
                        accept={accept}
                        onChange={handleChange}
                        className="mb-3"
                    />
                    {/* show current filename (value) if present. value may be a string (stored filename) or a File object */}
                    {(() => {
                        const filename = value && typeof value === 'string' ? value : value && value.name ? value.name : null;
                        return filename ? <div className="mb-2"><small>Current: {filename}</small></div> : null;
                    })()}
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
                            {renderField("Aadhaar", profile.aadhaarFileName, "aadhaarFile", "file")}
                            <CFormLabel>PAN Document</CFormLabel>
                            {renderField("PAN", profile.panFileName, "panFile", "file")}
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
