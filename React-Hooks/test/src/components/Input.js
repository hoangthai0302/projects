import React from 'react';

import useInput from '../hooks/useInput';
const Input = (props) => {
    const input = useInput(props.value);

    return <input  {...props} {...input} />
}

export default Input;