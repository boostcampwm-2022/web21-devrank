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
import axiosInstance from '@utils/axiosInstance';

interface Redirectable {
  url: string;
}

function isErrorRedirectable(error: unknown): error is Redirectable {
  return typeof error === 'object' && Object.prototype.hasOwnProperty.call(error, 'url');
}

export function ssrWrapper(
  namespaces: string[],
  callback?: (
    context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>,
    queryClient: QueryClient,
  ) => Promise<object | void>,
): GetServerSideProps {
  return async (context) => {
    axiosInstance.defaults.headers.common['X-Forwarded-For'] = context.req.headers['X-Forwarded-For'];
    axiosInstance.defaults.headers.common['x-forwarded-for'] = context.req.headers['x-forwarded-for'];

    try {
      const queryClient = new QueryClient();
      let propsData: object | void;

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

export function ssgWrapper(
  namespaces: string[],
  callback?: (
    context: GetStaticPropsContext<ParsedUrlQuery, PreviewData>,
    queryClient: QueryClient,
  ) => Promise<object | void>,
): GetStaticProps {
  return async (context) => {
    try {
      const queryClient = new QueryClient();
      let propsData: object | void;

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
