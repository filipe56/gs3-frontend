import React, { useRef, useCallback, useEffect, useState } from 'react'
import logo from "../../assets/logo.jpg";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import { Link } from "react-router-dom";
import * as Yup from 'yup';
import { useAuth } from "../../hooks/auth";
import { useToast } from "../../hooks/toast";
import getValidationErros from "../../utils/getValidationErros";
import { FiLogIn, FiMail, FiLock } from "react-icons/fi";
import { Container, Content, AnimationContainer } from './styles';

import Input from "../../components/Input/index";
import Button from "../../components/Button/index";

interface SignInFormData {
  username: string;
  password: string;
}


const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { signIn } = useAuth();
  const { addToast } = useToast();
 

  const handleSubmit = useCallback(async (data: SignInFormData) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        username: Yup.string().required('Usuário é obrigatório'),
        password: Yup.string().required('Senha obrigatório')
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      await signIn({
        username: data.username,
        password: data.password,
      });


    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErros(err);
        formRef.current?.setErrors(errors);
      }
      addToast({
        type: 'error',
        title: 'Error na autenticação',
        description: 'Ocorreu um erro ao fazer login, cheque as credenciais.'
      });
    }
  }, [signIn, addToast]);

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logo} alt="logo" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu Login</h1>
            <Input icon={FiMail} name="username" type="text" placeholder="Nome" />
            <Input icon={FiLock} name="password" type="password" placeholder="Senha" />
            <Button type="submit">Entrar</Button>
          </Form>
        </AnimationContainer>
      </Content>
      {/* <Background /> */}
    </Container>
  );
}

export default SignIn;