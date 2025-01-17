import React, { useEffect, useState } from "react";
import { object, string } from "yup";

const validationErrors = {
    fullNameTooShort: "full name must be at least 3 characters",
    fullNameTooLong: "full name must be at most 20 characters",
    sizeIncorrect: "size must be S or M or L",
};

const validationSchema = object({
    fullName: string()
        .min(3, validationErrors.fullNameTooShort)
        .max(20, validationErrors.fullNameTooLong),
    size: string().oneOf(["S", "M", "L"], validationErrors.sizeIncorrect),
});

const toppings = [
    { topping_id: "1", text: "Pepperoni" },
    { topping_id: "2", text: "Green Peppers" },
    { topping_id: "3", text: "Pineapple" },
    { topping_id: "4", text: "Mushrooms" },
    { topping_id: "5", text: "Ham" },
];

export default function Form() {
    const [formValues, setFormValue] = useState({
        fullName: "",
        size: "",
        toppings: [],
    });
    const [apiResponseMessage, setApiResponseMessage] = useState({});

    const [formErrors, setFormErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isValid, setIsValid] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch("http://localhost:9009/api/order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formValues),
        })
            .then(async (response) => {
                let data = await response.json();
                setApiResponseMessage({
                    status: response.ok,
                    message: data.message ?? "Thank you for your order!",
                });
            })
            .catch((error) => {
                console.log(error);
                setApiResponseMessage({
                    status: false,
                    message: "Something went wrong",
                });
            })
            .finally(() => {
                setFormValue({
                    fullName: "",
                    size: "",
                    toppings: []
                })
                setFormErrors("")
            })
    };

    useEffect(() => {
        // Validate only touched fields
        const touchedFields = Object.keys(touched).filter(
            (field) => touched[field]
        );
        if (touchedFields.length > 0) {
            validationSchema
                .validate(formValues, { abortEarly: false })
                .then(() => {
                    setFormErrors({});
                    setIsValid(true);
                })
                .catch((err) => {
                    const errObj = {};
                    err.inner.forEach((error) => {
                        if (touchedFields.includes(error.path)) {
                            errObj[error.path] = error.message;
                        }
                    });
                    setFormErrors(errObj);
                    setIsValid(false);
                });
        }
    }, [formValues, touched]);

    const handleBlur = (field) => {
        setTouched((prev) => ({
            ...prev,
            [field]: true,
        }));
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Order Your Pizza</h2>

            {apiResponseMessage.status && (
                <div className="success">{apiResponseMessage.message}</div>
            )}
            {apiResponseMessage.status == false && (
                <div className="failure">{apiResponseMessage.message}</div>
            )}

            <div className="input-group">
                <div>
                    <label htmlFor="fullName">Full Name</label>
                    <br />
                    <input
                        placeholder="Type full name"
                        id="fullName"
                        value={formValues.fullName}
                        name="fullName"
                        type="text"
                        onInput={(event) => {
                            if (!touched.fullName) {
                                handleBlur("fullName");
                            }
                            setFormValue({
                                ...formValues,
                                fullName: event.target.value,
                            });
                        }}
                    />
                </div>
                {touched.fullName && formErrors.fullName && (
                    <div className="error">{formErrors.fullName}</div>
                )}
            </div>
            <div className="input-group">
                <div>
                    <label htmlFor="size">Size</label>
                    <br />
                    <select
                        id="size"
                        name="size"
                        onChange={(event) => {
                            if (!touched.size) {
                                handleBlur("size");
                            }
                            setFormValue({
                                ...formValues,
                                size: event.target.value,
                            });
                        }}
                    >
                        <option value="">----Choose Size----</option>
                        <option value="S">Small</option>
                        <option value="M">Medium</option>
                        <option value="L">Large</option>
                    </select>
                </div>
                {touched.size && formErrors.size && (
                    <div className="error">{formErrors.size}</div>
                )}
            </div>
            <div className="input-group">
                {toppings.map((topping) => (
                    <label
                        key={topping.topping_id}
                        htmlFor={`topping_${topping.topping_id}`}
                    >
                        <input
                            name={topping.text}
                            type="checkbox"
                            onChange={(event) => {
                                if (event.target.checked) {
                                    if (
                                        !formValues.toppings.includes(
                                            topping.topping_id
                                        )
                                    ) {
                                        setFormValue({
                                            ...formValues,
                                            toppings: [
                                                ...formValues.toppings,
                                                topping.topping_id,
                                            ],
                                        });
                                    }
                                } else {
                                    setFormValue({
                                        ...formValues,
                                        toppings: formValues.toppings.filter(
                                            (value) =>
                                                value !== topping.topping_id
                                        ),
                                    });
                                }
                            }}
                            id={`topping_${topping.topping_id}`}
                        />
                        {topping.text}
                        <br />
                    </label>
                ))}
            </div>
            <input type="submit" disabled={!isValid} />
        </form>
    );
}
