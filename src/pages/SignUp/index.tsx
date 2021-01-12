import React, { useCallback, useRef, useState, useEffect } from "react";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import Select from "../../components/Select/Select";
import { FiMail, FiUser } from "react-icons/fi";
import logo from "../../assets/logo.jpg";

import * as Yup from "yup";
import getValidationErros from '../../utils/getValidationErros'
import api from "../../services/api";
import { useToast } from '../../hooks/toast'
import { Container, Content } from "./styles";

import Input from "../../components/Input/index";
import Button from "../../components/Button/index";
import { useHistory, useLocation } from "react-router-dom";
import { uf, districts } from "../../utils/constants";
import { apiCep } from "../../services/external/apiExternal";
import VMasker from "vanilla-masker";
import { UserData } from "../interface/interface";
import { Address, PhoneItemsEdit, EmailItems,  } from '../../utils/interfaces';

interface IUF {
  value: string;
  label: string;
  id?: string;
}

interface IDistrict {
  value: string;
  label: string;
  id?: string;
  idUf?: string;
}

interface Client {
  id: number;
  name: string;
  emails: EmailItems;
  cpf: string;
  address: Address;
  phones: PhoneItemsEdit;
}

interface EditClient {
  client: Client;
}


export default function SignUp() {
  const formRef = useRef<FormHandles>(null);
  const location = useLocation<EditClient>();

  const selectRef = useRef(null);
  const selectRefState = useRef(null);
  const { addToast } = useToast();
  const history = useHistory();
  let client: Client;
  let idPhone: number;
  let idPhoneWork: number;
  let idCell: number;
  const [listUF, setListUF] = useState<IUF[]>();
  const [address, setAddrees] = useState('');
  const [listDistrict, setListDistrict] = useState<IDistrict[]>();
  const [cepValue, setCepValue] = useState('');
  const [city, setCity] = useState('');
  const [cpfValue, setCpfValue] = useState('');
  const [cellValue, setCellValue] = useState('');
  const [phoneHomeValue, setPhoneHomeValue] = useState('');
  const [phoneWorkValue, setPhoneWorkValue] = useState('');
  

  function onCepChange(event: React.FormEvent<HTMLInputElement>) {
    event.preventDefault();
    const value = event.currentTarget.value;
    var formatted = VMasker.toPattern(value, "99.999-999");
    setCepValue(formatted);
  }

  function onCellChange(event: React.FormEvent<HTMLInputElement>) {
    event.preventDefault();
    var formatted = maskPhone(event.currentTarget.value);
    setCellValue(formatted);
  }

  function onPhoneWork(event: React.FormEvent<HTMLInputElement>) {
    event.preventDefault();
    var formatted = maskPhone(event.currentTarget.value);
    setPhoneWorkValue(formatted);
  }

  
  function onPhoneHomeChange(event: React.FormEvent<HTMLInputElement>) {
    event.preventDefault();
    var formatted = maskPhone(event.currentTarget.value, true);
    setPhoneHomeValue(formatted);
  }

  function maskPhone(number: string, home: boolean = false) {
    if (home) {
      return VMasker.toPattern(number, "(99) 9999-9999");
    }
    if (number.length <= 14) {
      return  VMasker.toPattern(number, "(99) 9999-9999");
    } 
    return VMasker.toPattern(number, "(99) 99999-9999");
  }

  function onCpfChange(event: React.FormEvent<HTMLInputElement>) {
    event.preventDefault();
    const value = event.currentTarget.value;
    var formatted = VMasker.toPattern(value, "999.999.999-99");
    setCpfValue(formatted);
  }

  function mountPhone(ddd: string, number: string, phoneType: string, id: number) {
    switch (phoneType) {
      case  "MOBILE_NUMBER":
        idCell = id
        setCellValue(`(${ddd}) ${number}`)
        break;
      case  "RESIDENTIAL_NUMBER":
        idPhone = id
        setPhoneHomeValue(`(${ddd}) ${number}`)
        break;
      case  "WORKING_NUMBER":
        idPhoneWork = id
        setPhoneWorkValue(`(${ddd}) ${number}`)
        break;
    }
  }

  function getPhoneInfo(phone: string, type: number) {
    let ddd = phone.substring(1,3);
    let number;
    if (phone.length <= 14) {
      number = phone.substring(5,14)
    } else {
      number = phone.substring(5,15)
    }
    switch (type) {
      case 1:
        return {
          ddd,
          number,
          phoneType: "MOBILE_NUMBER"
        }
      case 2:
        return {
          ddd,
          number,
          phoneType: "RESIDENTIAL_NUMBER"
        }
      case 3:
       return {
          ddd,
          number,
          phoneType: "WORKING_NUMBER"
        }         
      default:
        break;
    }
  }

  const editUser = (client: Client) => {
    formRef.current?.setFieldValue('name', client.name);
        formRef.current?.setFieldValue('email', client.emails[0]);
    if (client.emails[1]) {
      formRef.current?.setFieldValue('emailSecond', client.emails[1]);  
    }
    setCpfValue(client.cpf)
    setAddrees(client.address.street)
    setCepValue(VMasker.toPattern(client.address.zipCode, "99.999-999"))
    setCity(client.address.city)
    let idUF: string;

    uf.forEach(element => {
      if (element.Sigla === client.address.uf) {
        idUF = element.ID
        formRef.current?.setFieldValue('uf', { label: element.Sigla, value: element.Sigla, id: element.ID });
      }
    });
    let listDistrict:IDistrict[] = [];
    districts.forEach(async element => {
      if (element.Estado === idUF) {
        listDistrict.push({ id: element.ID, value: element.Nome, label: element.Nome, idUf: element.Estado })
      }
      if (element.Nome === client.address.district) {
        await formRef.current?.setFieldValue('district', { label: element.Nome, value: element.Nome, id: element.ID });
      }
    });


    client.phones.forEach(element => {
      mountPhone(element.ddd, element.number, element.phoneType, element.id);
    });

  }
  
  useEffect(() => {
  
  if (location.state) {
    client = location.state.client;
    editUser(location.state.client)
  }

  const ufs : IUF[] = []
    uf.forEach(element => {
      ufs.push({ value: element.Sigla, label: element.Nome, id: element.ID })
    });
    setListUF(ufs);
  }, []);

  const handleSubmit = useCallback(async (data: UserData) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        name: Yup.string()
          .required('por favor preencha este campo')
          .min(3, 'Mínimo de 3 caracteres')
          .max(100, 'Limite máximo de 100 caracteres')
          .matches(
            /[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ0-9 ]+$/,
            'Apenas letras e espaços',
          ),
        email: Yup.string()
          .required('Por favor preencha este campo')
          .email('Digite um email válido'),
        maskedCpf: Yup.string()
          .required('Por favor preencha este campo')
          .matches(
            /^([0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2})$/,
            'formato válido: xxx.xxx.xxx-xx',
          )
          .min(
            14,
            'O cpf deve conter 14 caracteres contando números e separadores',
          )
          .max(
            14,
            'O cpf deve conter 14 caracteres contando números e separadores',
          ),
          zipCode: Yup.string()
          .required('Por favor preencha este campo')
          .matches(/^([0-9]{2}\.[0-9]{3}\-[0-9]{3})$/, 'formato: 99.999-999'),
          emailSecond: Yup.string().email('Digite um e-mail válido'),
          address: Yup.string()
          .required('Por favor preencha este campo')
          .matches(
            /[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ0-9 ]+$/,
            'Apenas letras e espaços',
          ),
          uf: Yup.string()
            .required()
            .min(2)
            .max(2)
            .matches(
              /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/,
              'Selecione um item',
            ),
          district: Yup.string()
            .required('Por favor preencha este campo')
            .matches(
              /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/,
              'Selecione um item',
            ),
          city: Yup.string()
            .required('Por favor preencha este campo')
            .matches(
              /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/,
              'Apenas letras e espaços',
            ),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      const params = mountParams(data)
    
      if (client) {
        await api.put(`/clients/${client.id}`, params)
      } else {
        await api.post('/clients', params)
      }

      history.push('/');

      addToast({
        type: 'success',
        title: 'Cadastro realizado!',
        description: ''
      })
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErros(err);

        formRef.current?.setErrors(errors);
        return;
      }

      addToast({
        type: 'error',
        title: 'Erro na cadastro',
        description: 'Ocorreu um error ao fazer cadastro, tente novamente.',
      });
    }
  }, [addToast, history]);

  const handleChange = async (uf? : IUF) => {    
    if (uf) {
      const listDistrict: IDistrict[] = [];
      districts.forEach(element => {
        if (uf?.id === element.Estado) {
          listDistrict.push({id: element.ID, value: element.Nome, label: element.Nome, idUf: element.Estado })
        }
      });
      setListDistrict(listDistrict)
    } 
  }


    const colourStyles = {
      option: () => {
        return {
          color: 'black',
        };
      }
  }

  const onChangeCity = (value: string) => {
    setCity(value)
  }

  const handleCepBlur = async () => {
    let zipCode = cepValue.split('-', 3).join('');
     zipCode = zipCode.split('.', 2).join('');
     try {
      const response = await apiCep.get(`${zipCode}/json/`);
      setAddrees(response.data.logradouro)
      let idUF:string;
      uf.forEach(async element => {
        if (element.Sigla === response.data.uf ) {
         idUF = element.ID
          await formRef.current?.setFieldValue('uf', { label: element.Sigla, value: element.Sigla, id: element.ID });
        }
      });
      let listDistrict:IDistrict[] = [];
      districts.forEach(async element => {
        if (element.Estado === idUF) {
          listDistrict.push({ id: element.ID, value: element.Nome, label: element.Nome, idUf: element.Estado })
        }
        if (element.Nome === response.data.localidade) {
          await formRef.current?.setFieldValue('district', { label: element.Nome, value: element.Nome, id: element.ID });
        }
      });
     

      setListDistrict(listDistrict);
      setCity(response.data.bairro)
      
     } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErros(err);

        formRef.current?.setErrors(errors);
        return;
      }

      addToast({
        type: 'error',
        title: 'Erro na buca do cep',
        description: 'Ocorreu um error ao fazer a busca pelo cep.',
      });
     }
  }

  const mountParams = (data: UserData) => {
    let cellPhone;
    let phone;
    let phoneWork;
    let phones = [];
      if (!data.phone && !data.cellphone && !data.phoneWork) {
        addToast({
          type: 'error',
          title: 'Erro na cadastro',
          description: 'Informe pelo menos um número de contato',
        });
        return;
      } else {
        phone = idPhone ? {...getPhoneInfo(data.phone, 2), id: idPhone} : data.phone && getPhoneInfo(data.phone, 2)
        phoneWork = idPhoneWork ? {...getPhoneInfo(data.phoneWork, 3), id: idPhoneWork} : data.phoneWork && getPhoneInfo(data.phoneWork, 3)
        cellPhone = idCell ? {...getPhoneInfo(data.cellphone, 1), id: idCell} : data.cellphone && getPhoneInfo(data.cellphone, 1)
      }
      
      if (phone) {
        phones.push(phone)
      }

      if (phoneWork) {
        phones.push(phoneWork)
      }

      if (cellPhone) {
        phones.push(cellPhone)
      }
      
      const emails = [data.email]
      if (data.emailSecond) {
        emails.push(data.emailSecond)
      }
      if (client) {
        return {
          "id": client.id,
          "name": data.name,
          "cpf": data.maskedCpf,
          "phones": phones,
          "address": {
            "id": client.address.id,
            "street": data.address,
            "uf": data.uf,
            "city": data.city,
            "district": data.district,
            "zipCode": data.zipCode,
            "complement": data.complement
          },
          "emails": emails
      }
      }
      const params = 
        {
          "name": data.name,
          "cpf": data.maskedCpf,
          "phones": phones,
          "address": {
            "street": data.address,
            "uf": data.uf,
            "city": data.city,
            "district": data.district,
            "zipCode": data.zipCode,
            "complement": data.complement
          },
          "emails": emails
      }

    return params;
  }

    return (
    <Container>
      <Content>
        <img src={logo} alt="gs3" />
        
        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Faça o cadastro</h1>
          <Input 
          icon={FiUser} 
          name="name" 
          type="text" 
          placeholder="Nome" 
          />
          <Input 
          icon={FiMail} 
          name="email" 
          type="text" 
          placeholder="E-mail" 
          />
          <Input 
          icon={FiMail} 
          name="emailSecond" 
          type="text" 
          placeholder="E-mail Sencundário" 
          />
          <Input 
          icon={FiUser} 
          name="zipCode" 
          type="text" 
          placeholder="CEP"  
          value={cepValue}             
          onBlur={handleCepBlur} 
          onChange={onCepChange}
          />
          <Input
          type="text"
          placeholder="CPF apenas números*"
          name="maskedCpf"
          maxLength={14}
          value={cpfValue}
          onChange={onCpfChange}
          />
          <Input 
          icon={FiMail} 
          name="address" 
          type="text" 
          placeholder="Endereço" 
          value={address}
          />
          <Select
          name="uf"
          ref={selectRef}
          styles={colourStyles} 
          placeholder="Estados" 
          options={listUF} 
          onChange={(value) => {
            handleChange(value || undefined)
          }}    
          />
           <Select
           name='district'
           ref={selectRefState}
           styles={colourStyles} 
           placeholder="Cidade" 
           options={listDistrict} 
           />
          <Input 
          icon={FiUser} 
          value={city}             
          name="city" 
          type="text" 
          placeholder="Bairro" 
          onChange={(value) => onChangeCity(value.currentTarget.value)}
          />
          <Input 
          icon={FiUser} 
          name="phone" 
          type="text" 
          placeholder="Telefone de casa" 
          value={phoneHomeValue}             
          onChange={onPhoneHomeChange}
          />
          <Input 
          icon={FiUser} 
          name="cellphone" 
          type="text" 
          placeholder="Celular" 
          value={cellValue}             
          onChange={onCellChange}
          />
          <Input 
          icon={FiUser} 
          name="phoneWork" 
          type="text" 
          placeholder="Telefone do trabalho" 
          value={phoneWorkValue}             
          onChange={onPhoneWork}
          />

          <Input icon={FiUser} name="complement" type="text" placeholder="Complemento" />
          <Button type="submit">Cadastrar</Button>
        </Form>
      
      </Content>
      {/* <Background /> */}
    </Container>
  );
};
