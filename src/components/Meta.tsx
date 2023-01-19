import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';

type IMetaProps = {
  title: string;
  description: string;
  canonical?: string;
  siteName?: string;
};

const Meta = (props: IMetaProps) => {
  const router = useRouter();

  return (
    <>
      <Head>
        <meta charSet='UTF-8' key='charset' />
        <meta
          name='viewport'
          content='width=device-width,initial-scale=1'
          key='viewport'
        />
        <link
          rel='apple-touch-icon'
          href={`${router.basePath}/images/apple-touch-icon.png`}
          key='apple'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href={`${router.basePath}/images/favicon-32x32.png`}
          key='icon32'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href={`${router.basePath}/images/favicon-16x16.png`}
          key='icon16'
        />
        <link
          rel='icon'
          href={`${router.basePath}/favicon.ico`}
          key='favicon'
        />
      </Head>
      <NextSeo
        title={props.title}
        description={props.description}
        canonical={props.canonical}
        openGraph={{
          title: props.title,
          description: props.description,
          url: props.canonical,
          site_name: props.siteName ? props.siteName : 'GenesisDAO',
        }}
      />
    </>
  );
};

export { Meta };
