import 'styled-components';
import { ColorsTypes, CommonTypes, FontSizeTypes, FontWeightTypes } from '@styles/theme';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: ColorsTypes;
    fontSize: FontSizeTypes;
    fontWeight: FontWeightTypes;
    common: CommonTypes;
  }
}
