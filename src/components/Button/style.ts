import styled from "styled-components";
import { shade } from "polished";



export const Container = styled.button`
    background: #124F70;
    height: 56px;
    border-radius: 10px;
    border: 0;
    padding: 0 16px;
    color: white;//#124F70;;
    width: 100%;
    font-weight: 500;
    margin-top: 16px;
    transition: background-color 0.2s;

    &:hover{
      background: ${shade(0.2, '#312e38')}
    }
`;