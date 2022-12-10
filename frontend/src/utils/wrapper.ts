import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetStaticProps,
  GetStaticPropsContext,
  PreviewData,
} from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ParsedUrlQuery } from 'querystring';
import { QueryClient, dehydrate } from '@tanstack/react-query';

export interface PropsData {
  data: any;
  redirect: {
    trigger: boolean;
    url: string;
  };
}

export function ssrWrapper(
  namespaces: string[],
  callback?: (
    context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>,
    queryClient: QueryClient,
  ) => PropsData | any,
): GetServerSideProps {
  return async (context) => {
    const queryClient = new QueryClient();
    let propsData: PropsData = {
      data: null,
      redirect: {
        trigger: false,
        url: '',
      },
    };

    if (callback) propsData = await callback(context, queryClient);

    if (propsData.redirect.trigger) {
      return {
        redirect: {
          destination: propsData.redirect.url,
          permanent: false,
        },
      };
    }

    return {
      props: {
        ...propsData.data,
        dehydratedState: dehydrate(queryClient),
        ...(await serverSideTranslations(context.locale as string, namespaces)),
      },
    };
  };
}

export function ssgWrapper(
  namespaces: string[],
  callback?: (context: GetStaticPropsContext<ParsedUrlQuery, PreviewData>, queryClient: QueryClient) => PropsData | any,
): GetStaticProps {
  return async (context) => {
    const queryClient = new QueryClient();
    let propsData: PropsData = {
      data: null,
      redirect: {
        trigger: false,
        url: '',
      },
    };

    if (callback) propsData = await callback(context, queryClient);

    if (propsData.redirect.trigger) {
      return {
        redirect: {
          destination: propsData.redirect.url,
          permanent: false,
        },
      };
    }

    return {
      props: {
        ...propsData.data,
        dehydratedState: dehydrate(queryClient),
        ...(await serverSideTranslations(context.locale as string, namespaces)),
      },
    };
  };
}
