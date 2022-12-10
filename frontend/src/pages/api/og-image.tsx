import { NextRequest } from 'next/server';
import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'experimental-edge',
};

const font = fetch(new URL('../../../public/fonts/line-seed-kr-regular.woff', import.meta.url)).then((res) =>
  res.arrayBuffer(),
);

export default async function handler(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const username = searchParams.get('username');
  const image = searchParams.get('image') as string;
  const tier = searchParams.get('tier');
  const fontData = await font;

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          background: '#27282D',
          width: '100%',
          height: '100%',
        }}
      >
        <img
          src={decodeURI(image)}
          style={{
            width: '630px',
            height: '630px',
          }}
        />
        <div
          style={{
            display: 'flex',
            width: '570px',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <img
              src='https://dreamdev.me/icons/devrank-logo.svg'
              style={{
                width: '400px',
                height: '80px',
                marginBottom: '30px',
              }}
            />
            <img
              src={`https://dreamdev.me/icons/cube/cube-small-${tier}.svg`}
              style={{
                width: '180px',
                height: '160px',
              }}
            />
            <div
              style={{
                fontSize: 90,
                color: '#FBFBFB',
              }}
            >
              {username}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'LINESeedSansKR',
          data: fontData,
          style: 'normal',
        },
      ],
    },
  );
}
