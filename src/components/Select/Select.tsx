import React, { useRef, useEffect } from "react";
import { useField } from "@unform/core";
import { Container, Error, SelectComponent } from "./styles";
import { FiAlertCircle } from 'react-icons/fi'


import  {
  OptionTypeBase,
  Props as ReactSelectProps
} from "react-select";

interface Props extends ReactSelectProps {
  name: string;
}

const Select: React.FC<Props> = ({ name, value, ...rest }) => {
  const { fieldName, defaultValue, registerField, error } = useField(name);

  const selectRef = useRef(null);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: selectRef.current,
      getValue: (ref: any) => {
        if (rest.isMulti) {
          if (!ref?.state?.value) {
            return [];
          }
          return ref.state.value.map((option: OptionTypeBase) => option.value);
        } else {
          if (!ref?.state?.value) {
            return "";
          }
          if (Array.isArray(ref?.state?.value)) {
            return ref?.state?.value[0]?.value;
          }
          return ref?.state?.value?.value;
        }
      },
      setValue: (ref: any, value: any) => { ref.select.setValue(value); },
    });
  }, [fieldName, registerField, rest.isMulti]);

  return (
    <Container isErrored={!!error} >
      <SelectComponent ref={selectRef} defaultValue={defaultValue} value={value} {...rest} />
      {error &&
        <Error title={error}>
          <FiAlertCircle color="#C53030" size={20} />
        </Error>}
    </Container>);
};

export default Select;
