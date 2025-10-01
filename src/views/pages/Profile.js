import React, { useState, useEffect } from "react"
import {
    CCard,
    CCardBody,
    CCol,
    CContainer,
    CRow,
    CForm,
    CFormInput,
    CFormLabel,
    CInputGroup,
    CInputGroupText,
    CButton,
} from "@coreui/react"
import { cilUser, cilPhone, cilEnvelopeOpen } from "@coreui/icons"
import CIcon from "@coreui/icons-react"

export default function UserProfile() {
    const [profile, setProfile] = useState({
        name: "John Doe", // sample, ideally from API
        email: "johndoe@example.com",
        phone: "9876543210",
        photoUrl: "https://via.placeholder.com/150", // sample avatar
        photoFile: null,
    })

    const [errors, setErrors] = useState({ email: "", phone: "", photoFile: "" })

    const handleChange = (e) => {
        const { name, value, files } = e.target

        if (name === "photoFile") {
            if (files.length > 0) {
                const file = files[0]
                if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
                    setErrors((prev) => ({ ...prev, photoFile: "Only JPG/PNG allowed" }))
                    return
                }
                setProfile((prev) => ({
                    ...prev,
                    photoFile: file,
                    photoUrl: URL.createObjectURL(file),
                }))
                setErrors((prev) => ({ ...prev, photoFile: "" }))
            }
        } else {
            setProfile((prev) => ({ ...prev, [name]: value }))
        }
    }

    const validate = () => {
        let newErrors = { email: "", phone: "", photoFile: "" }

        if (!/^[0-9]{10}$/.test(profile.phone))
            newErrors.phone = "Enter 10 digit phone number"
        if (
            profile.email &&
            !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(profile.email)
        )
            newErrors.email = "Invalid email"

        setErrors(newErrors)
        return !newErrors.email && !newErrors.phone && !newErrors.photoFile
    }

    const handleSubmit = async () => {
        if (!validate()) return

        try {
            const formData = new FormData()
            formData.append("email", profile.email)
            formData.append("phone", profile.phone)
            if (profile.photoFile) formData.append("photo", profile.photoFile)

            const response = await fetch("https://api.qbits4dev.com/user/update", {
                method: "POST",
                body: formData,
            })

            const result = await response.json()
            if (response.ok) {
                alert("Profile updated successfully!")
            } else {
                alert(result.message || "Update failed")
            }
        } catch (err) {
            alert("Network error, please try again.")
        }
    }

    return (
        <div>

            <div className="bg-light min-vh-100 d-flex flex-row align-items-center py-5">
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol md={10} lg={6}>
                            <CCard className="shadow-sm rounded-4">
                                <CCardBody className="p-5">
                                    <h2 className="mb-4 text-primary fw-bold">My Profile</h2>
                                    <div className="text-center mb-4">
                                        <img
                                            src={profile.photoUrl}
                                            alt="Profile"
                                            className="rounded-circle shadow-sm"
                                            width={120}
                                            height={120}
                                        />
                                    </div>
                                    <CForm>
                                        {/* Full Name (read-only) */}
                                        <CInputGroup className="mb-3">
                                            <CInputGroupText>
                                                <CIcon icon={cilUser} />
                                            </CInputGroupText>
                                            <CFormInput value={profile.name} readOnly />
                                        </CInputGroup>

                                        {/* Email */}
                                        <CInputGroup className="mb-3">
                                            <CInputGroupText>
                                                <CIcon icon={cilEnvelopeOpen} />
                                            </CInputGroupText>
                                            <CFormInput
                                                name="email"
                                                placeholder="Email"
                                                value={profile.email}
                                                onChange={handleChange}
                                                invalid={!!errors.email}
                                            />
                                        </CInputGroup>
                                        {errors.email && (
                                            <small className="text-danger">{errors.email}</small>
                                        )}

                                        {/* Phone */}
                                        <CInputGroup className="mb-3">
                                            <CInputGroupText>
                                                <CIcon icon={cilPhone} />
                                            </CInputGroupText>
                                            <CFormInput
                                                name="phone"
                                                placeholder="Phone"
                                                value={profile.phone}
                                                maxLength={10}
                                                onChange={handleChange}
                                                invalid={!!errors.phone}
                                            />
                                        </CInputGroup>
                                        {errors.phone && (
                                            <small className="text-danger">{errors.phone}</small>
                                        )}

                                        {/* Photo Upload */}
                                        <div className="mb-3">
                                            <CFormLabel>Change Profile Photo (JPG/PNG)</CFormLabel>
                                            <CFormInput
                                                type="file"
                                                name="photoFile"
                                                accept="image/jpeg,image/png"
                                                onChange={handleChange}
                                            />
                                            {errors.photoFile && (
                                                <small className="text-danger">{errors.photoFile}</small>
                                            )}
                                        </div>

                                        <div className="d-flex justify-content-end mt-3">
                                            <CButton color="success" onClick={handleSubmit}>
                                                Save Changes
                                            </CButton>
                                        </div>
                                    </CForm>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                </CContainer>
            </div>
        </div>
    )
}
