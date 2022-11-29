import Image from 'next/image';
import { CubeRankType } from '@type/common';

interface CubeIconProps {
  /** 큐브 티어를 설정 */
  tier: CubeRankType;
  /** 큐브 아이콘 사이즈 */
  size?: number;
}

function CubeIcon({ tier, size }: CubeIconProps) {
  return (
    <Image
      src={`/icons/cube/cube-small-${tier}.svg`}
      width={size ? size : 27}
      height={size ? size : 27}
      alt={`${tier} cube`}
    />
  );
}

export default CubeIcon;
