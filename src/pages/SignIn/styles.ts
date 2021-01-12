import styled, { keyframes } from 'styled-components';
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
`;

const appearFromLeft = keyframes`
  from {
    opacity: 0,
    transform: translateX(-50px);
  }
  to {
    opacity: 0,
    transform: translateX(0);
  }
`
export const AnimationContainer = styled.div`
  display:flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  animation: ${appearFromLeft} 1s;

 img {
    border-radius: 25px;
    height: 200px;
    width: 200;
    margin-top: 40px;
    margin-bottom: 30px;
  }

  form {
    margin: -20px 0;
    width: 340px;
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
        height: 20px;
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