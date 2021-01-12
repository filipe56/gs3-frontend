import React, { MouseEvent, useState, useEffect } from 'react';
import logo from "../../assets/logo.jpg";
import { ClientList, Header, Container } from './style';
import api from '../../services/api';
import { Address, PhoneItems, EmailItems } from '../../utils/interfaces';
import { useHistory } from "react-router-dom";

interface RequestData {
  id: number;
  name: string;
  emails: EmailItems;
  cpf: string;
  address: Address;
  phones: PhoneItems;
}

interface user {
  accountTypes: string[];
}

type RequestDataItems = Array<RequestData>;

const Dashboard: React.FC = () => {
const history = useHistory();
const [data, setData] = useState([] as RequestDataItems);
const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user: user = JSON.parse(localStorage.getItem('@gs3:user') || '{}');
    if (user && user.accountTypes[0] === "ADMIN") {
      setIsAdmin(true)
    }
    fetchData();
  }, [setData]);
  console.log(data);


  async function handleDelete(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    const id = event.currentTarget.getAttribute('value');
    try {
      await api.delete(`/clients/${id}`);
      fetchData()
    } catch (error) {
      if (error.response.status === 403) {
        handleLogOut();
      }
      alert('Só administradores podem deletar usúarios');
    }
  }


  async function handleLogOut() {
    window.localStorage.removeItem('@gs3:user');
    window.localStorage.removeItem('@gs3:token');
    history.push('/');
  }

  async function fetchData() {
    try {
      const response = await api.get('/clients');
      setData(response.data);  
    } catch (error) {
      if (error.response.status === 403) {
        handleLogOut();
      }
    }
  }

  function handleClick() {
    history.push('/signup');
  }

  const type = (phoneType: string) =>{
    switch (phoneType) {
      case  "MOBILE_NUMBER":
        return "Celular"
      case  "RESIDENTIAL_NUMBER":
        return "Telefone Residêncial"
      case  "WORKING_NUMBER":
        return "Telefone do Trabalho"
    }
  }

  async function handleUpdate(event: RequestData) {
    history.push('/signup', {client: event});
  }

  return (
    <>
      <Container>

        <Header>
          <a href="">Clientes</a>
          {isAdmin && <a href="" onClick={handleClick}>
            Adicionar cliente
          </a>}
          <a href="" onClick={handleLogOut}>
            Log-out
          </a>
          
        </Header>

        {data.map(client => (
          <ClientList key={client.id}>
            <p>
              <b>Nome: </b>&nbsp;&nbsp;&nbsp;&nbsp;
              {client.name}
              &nbsp;&nbsp;&nbsp;&nbsp; <b>CPF: </b>&nbsp;
              {client.cpf}
            </p>
            {client.emails.map(email => (
              <div key={email}>
                <p>
                  <b>Email: </b>&nbsp;&nbsp;&nbsp;&nbsp;
                  {email}
                </p>
              </div>
            ))}
            {client.phones.map(phone => (
              <div key={phone.number}>
                <p>
                  <b>{phone.phoneType && type(`${phone.phoneType}`)}:&nbsp;&nbsp;&nbsp;&nbsp;  </b> ({phone.ddd}) {phone.number}
                </p>
              </div>
            ))}
            <p>
              <b>CEP: </b>
              {client.address.zipCode}&nbsp;&nbsp;&nbsp;&nbsp;
              <b>UF: </b> {client.address.uf} &nbsp;&nbsp;&nbsp;&nbsp;
              <b>  Cidade: </b> {client.address.district}  &nbsp;&nbsp;&nbsp;&nbsp;
              <b>Bairro: </b> {client.address.city }&nbsp;&nbsp;&nbsp;&nbsp;
            </p>
            <p>
              <b>Logradouro: </b>&nbsp;&nbsp;&nbsp;&nbsp;
              {client.address.street}
            </p>
            {client.address.complement ? (
              <p>
                <b>Complemento: </b>
                {client.address.complement}
              </p>
            ) : null}
            {isAdmin && <span>

              <button type="button" onClick={handleDelete} value={client.id}>
                Excluir
              </button>
              <button type="button" onClick={() => handleUpdate(client)}>
                Editar
              </button>
            </span>}
          </ClientList>
        ))}
      </Container>
    </>
  );
};

export default Dashboard;
