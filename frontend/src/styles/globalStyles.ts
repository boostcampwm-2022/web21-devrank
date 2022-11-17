import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const GlobalStyles = createGlobalStyle` 
    ${reset}

    a {
        text-decoration: none;
        color: inherit;
    }

    button, input{
        cursor: pointer;
        font-family: inherit;
    }

    body {
        background-color: ${({ theme }) => theme.colors.black1};
    }

    * {
        color: ${({ theme }) => theme.colors.text};
        box-sizing: border-box;
    }
`;

export default GlobalStyles;
