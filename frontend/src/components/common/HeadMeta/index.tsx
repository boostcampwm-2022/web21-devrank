import Head from 'next/head';

interface HeadMetaProps {
  title?: string;
  description?: string;
  image?: string;
}

function HeadMeta({ title, description, image }: HeadMetaProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      <meta name='description' content={description} />
      <meta property='og:title' content={title} />
      <meta property='og:type' content='website' />
      <meta property='og:description' content={description} />
      <meta property='og:site_name' content='Devrank' />
      <meta property='og:image' content={image || 'https://dreamdev.me/og-thumbnail.png'} />
    </Head>
  );
}

export default HeadMeta;
