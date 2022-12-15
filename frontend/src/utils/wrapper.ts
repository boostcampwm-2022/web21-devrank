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

interface Redirectable {
  url: string;
}

function isErrorRedirectable(error: unknown): error is Redirectable {
  return typeof error === 'object' && Object.prototype.hasOwnProperty.call(error, 'url');
}

export function ssrWrapper<T>(
  namespaces: string[],
  callback?: (context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>, queryClient: QueryClient) => Promise<T>,
): GetServerSideProps {
  return async (context) => {
    try {
      const queryClient = new QueryClient();
      let propsData: T | undefined;

      if (callback) {
        propsData = await callback(context, queryClient);
      }

      return {
        props: {
          ...propsData,
          dehydratedState: dehydrate(queryClient),
          ...(await serverSideTranslations(context.locale as string, namespaces)),
        },
      };
    } catch (error) {
      if (isErrorRedirectable(error)) {
        return {
          redirect: {
            destination: error.url,
            permanent: false,
          },
        };
      }

      return Promise.reject(error);
    }
  };
}

export function ssgWrapper<T>(
  namespaces: string[],
  callback?: (context: GetStaticPropsContext<ParsedUrlQuery, PreviewData>, queryClient: QueryClient) => Promise<T>,
): GetStaticProps {
  return async (context) => {
    try {
      const queryClient = new QueryClient();
      let propsData: T | undefined;

      if (callback) {
        propsData = await callback(context, queryClient);
      }

      return {
        props: {
          ...propsData,
          dehydratedState: dehydrate(queryClient),
          ...(await serverSideTranslations(context.locale as string, namespaces)),
        },
      };
    } catch (error) {
      if (isErrorRedirectable(error)) {
        return {
          redirect: {
            destination: error.url,
            permanent: false,
          },
        };
      }

      return Promise.reject(error);
    }
  };
}
