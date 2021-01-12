import React, { ButtonHTMLAttributes } from 'react'
import { Container } from "./style";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

const Button: React.FC<ButtonProps> = ({ children, ...rest }) => (
  <Container {...rest} type="submit">
    {children}
  </Container>
);


export default Button