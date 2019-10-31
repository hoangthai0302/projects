import { useState, useCallback } from "react";

const useInputNumber = () => {
    const [value, setValue] = useState("");
    const onChange = useCallback((event) => {
        const value = event.target.value;
        if(!isNaN(value)) {
            setValue(event.target.value)
        }
    }, []);

    return { value, onChange };
};
export default useInputNumber;