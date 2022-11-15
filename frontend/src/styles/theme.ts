import { DefaultTheme } from 'styled-components';

const colors = {
  text: '#FBFBFB',
  logo: '#D9D9BF',
  gray1: '#4F5660',
  gray2: '#D3D7DB',
  gray3: '#EBEDEF',
  gray4: '#E3E5E8',
  gray5: '#D7D7D7',
  black1: '#27282D',
  black2: '#2D2727',
  black3: '#31313C',
  black4: '#1F2025',
  black5: '#313135',
  yellow1: '#FBF1C8',
  yellow2: '#FFE375',
  yellow3: '#DFB613',
  yellow4: '#8F750F',
  green1: '#7ED97E',
  green2: '#3AC63A',
  green3: '#329832',
  green4: '#0D660D',
  mint1: '#9DE2E6',
  mint2: '#35D7E0',
  mint3: '#088B92',
  mint4: '#00575C',
  blue1: '#B4CCFA',
  blue2: '#558EF8',
  blue3: '#3C65B3',
  blue4: '#174573',
  purple1: '#E8C1FA',
  purple2: '#C455F9',
  purple3: '#8102C1',
  purple4: '#561A72',
  orange1: '#F6BEA4',
  orange2: '#F3753A',
  orange3: '#CA4405',
  orange4: '#872C02',
  red1: '#F3AFC3',
  red2: '#F65988',
  red3: '#F60B51',
  red4: '#8B032C',
};

const fontSize = {
  xl: 32 + 'px',
  lg: 24 + 'px',
  md: 16 + 'px',
  sm: 14 + 'px',
  xs: 12 + 'px',
};

const fontWeight = {
  thin: '100',
  light: '300',
  regular: '400',
  medium: '500',
  bold: '700',
  black: '900',
};

const common = {
  flexRow: `
    display: flex;`,
  flexColumn: `
    display: flex;
    flex-direction: column;`,
  flexCenter: `
    display:flex;
    justify-content:center;
    align-items:center;`,
  flexCenterColumn: `
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;`,
  flexSpaceBetween: `
    display:flex;
    justify-content:space-between;
    align-items:center;`,
  flexSpaceBetweenColumn: `
    display:flex;
    flex-direction:column;
    justify-content:space-between;
    align-items:center;`,
  boxShadow: `
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25),
    `,
};

export type ColorsTypes = typeof colors;
export type FontSizeTypes = typeof fontSize;
export type FontWeightTypes = typeof fontWeight;
export type CommonTypes = typeof common;

const theme: DefaultTheme = {
  colors,
  fontSize,
  fontWeight,
  common,
};

export default theme;
