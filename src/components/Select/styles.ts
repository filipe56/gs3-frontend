import styled, { css } from "styled-components";
import Tooltip from "../Tooltip";
import ReactSelect from "react-select";

interface ContainerProps {
  isErrored: boolean;
}

export const Container = styled.div<ContainerProps>`
      background: #232129;
      border-radius: 10px;
      border: 2px solid #232129;
      padding: 16px;
      width: 100%;
      color: #666360;

     display: flex;
     align-items: center;

     & + div {
        margin-top: 8px;
      }

      ${(props) => props.isErrored && css`
        border-color: #C53030;
      `}
`;

export const SelectComponent = styled(ReactSelect)`
background: transparent;
        flex: 1;
        border: 0;
        color: #fff;
        
        &::placeholder{
          color: #666360
        }
  
`;
export const Error = styled(Tooltip)`
  height: 20px;
  margin-left: 16px;
  
  svg{
    margin: 0;
  }

  span {
    background: #C53030;
    color: #fff;
      
    &::before {
      border-color: #C53030 transparent;
    }
  }
`