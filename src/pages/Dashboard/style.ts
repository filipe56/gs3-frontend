import styled from 'styled-components';


export const Header = styled.div`
  heigth: 10vh;
  margin: 0 auto;
  text-align: center;
  margin-top: 30px;
  margin-bottom: 60px;
  width: 100%;

  a {
    text-decoration: none;
    color: #fff;
    padding: 10px 150px 10px;
    border: solid 5px #ccc;
    color: #ccc;
    background: #252525;
    font-weight: bold;
    border-radius: 10px;
  }
`;

export const Container = styled.div`
  height: 100vh;
  margin: 0 auto;
  flex-direction: column;
`;

export const ClientList = styled.div`
  background-color: #252525;
  border: 3px solid #ccc;
  border-radius: 5px;
  margin: 30px;
  margin-bottom: 20px;

  h3 {
    margin: 20px 0 10px 160px;
    color: #fff;
  }
  p {
    margin: 10px;
    color: #fff;
  }

  p::after {
    content: '';
    width: 100%;
    height: 1px;
    background-color: #ccc;
    display: block;
    margin-top: 3px;
  }

  button {
    width: 80px;
    margin-left: 350px;
    margin-bottom: 10px;
    border: solid 2px #db1e0d;
    color: #db1e0d;
    background: #252525;
    font-weight: bold;
    padding: 5px 0;
    border-radius: 10px;

    & + button{
      color: #57DB59;
      border: #57DB59 2px solid;
    }
  }


  span{
    display: flex:
    flex-direction: row;
`;
