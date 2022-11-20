import Image from 'next/image';

interface CubeIconProps {
  tier: string;
}

function CubeIcon({ tier }: CubeIconProps) {
  return <Image src={`/icons/cube/cube-small-${tier}.svg`} width={27} height={27} alt={`${tier} cube`} />;
}

export default CubeIcon;
