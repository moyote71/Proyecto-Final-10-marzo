import { useState } from "react";

export function useForm({ initialValues, validate, onSubmit }) {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Limpiamos el error si el usuario empezó a escribir y borramos el submit error global
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
        setSubmitError("");
    };

    const setFieldValue = (name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setSubmitError("");
        
        if (validate) {
            const validationErrors = validate(values);
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }
        }
        
        setIsSubmitting(true);
        try {
            await onSubmit(values);
        } catch (error) {
            setSubmitError(error.message || "Ocurrió un error inesperado.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        values,
        errors,
        isSubmitting,
        submitError,
        setSubmitError,
        handleChange,
        handleSubmit,
        setFieldValue
    };
}
