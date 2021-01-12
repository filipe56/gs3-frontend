import styled from 'styled-components';
import { shade } from "polished";

export const Container = styled.div`
  height:100vh;
  display: flex;
  align-items: stretch;
`;

export const Content = styled.div`
  display:flex;
  flex-direction: column;
  align-items: center;
  place-content: center;
  width: 100%;
  /* max-width: 700px; */

  img {
    border-radius: 25px;
    height: 150px;
    width: 150px;
    margin-top: 600px;
  }

  form {
    margin: 60px 0;
    width: 80%;
    text-align: center;
  }
    h1 {
      margin-bottom: 24px;
    }

    a {
      color: #F4EDE8;
      display: block;
      margin-top: 24px;
      text-decoration: none;
      transition: color 0.2s;
      &:hover {
        color: ${shade(0.2, '#F4EDE8')}
      }
    }
    > a {
      color: #F4EDE8;
      display: block;
      margin-top: 24px;
      text-decoration: none;
      transition: color 0.2s;
      display: flex;
      align-items: center;

      svg {
        margin-right: 16px;
      }

      &:hover {
        color: ${shade(0.2, '#F4EDE8')}
      }
    }
`;

export const Background = styled.div`
  flex:1;
  background-size: cover;
`;
