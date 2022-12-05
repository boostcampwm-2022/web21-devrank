import Head from 'next/head';

interface HeadMetaProps {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
}

function HeadMeta({ title, description, url, image }: HeadMetaProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta property='og:title' content={title} />
      <meta property='og:type' content='website' />
      <meta property='og:description' content={description} />
      <meta property='og:site_name' content='Devrank' />
      <meta property='og:url' content={url || 'https://dreamdev.me'} />
      <meta property='og:image' content={image || 'https://dreamdev.me/og-thumbnail.png'} />
    </Head>
  );
}

export default HeadMeta;
