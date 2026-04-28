import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function ShowToggle({ initialShow = false, children }) {
    const [show, setShow] = useState(initialShow);

    const toggle = () => {
        setShow(!show);
    };

    // Kita pass state "show" dan fungsi "toggle" ke dalam children
    return children({ show, toggle });
}
