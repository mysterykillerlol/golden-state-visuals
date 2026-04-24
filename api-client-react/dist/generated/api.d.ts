import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { AddGalleryImagesBody, AdminStats, Article, AuthUser, CreateArticleBody, CreateGalleryBody, CreateGameBody, CreatePostBody, ErrorResponse, Gallery, Game, GameDetail, HealthStatus, HomeFeatured, ListArticlesParams, ListGalleriesParams, ListPostsParams, LoginRequest, MeResponse, Ok, Post, UpdateArticleBody, UpdateGalleryBody, UpdateGameBody, UpdatePostBody } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Admin login
 */
export declare const getLoginUrl: () => string;
export declare const login: (loginRequest: LoginRequest, options?: RequestInit) => Promise<AuthUser>;
export declare const getLoginMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
        data: BodyType<LoginRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
    data: BodyType<LoginRequest>;
}, TContext>;
export type LoginMutationResult = NonNullable<Awaited<ReturnType<typeof login>>>;
export type LoginMutationBody = BodyType<LoginRequest>;
export type LoginMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Admin login
 */
export declare const useLogin: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
        data: BodyType<LoginRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof login>>, TError, {
    data: BodyType<LoginRequest>;
}, TContext>;
/**
 * @summary Admin logout
 */
export declare const getLogoutUrl: () => string;
export declare const logout: (options?: RequestInit) => Promise<Ok>;
export declare const getLogoutMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
export type LogoutMutationResult = NonNullable<Awaited<ReturnType<typeof logout>>>;
export type LogoutMutationError = ErrorType<unknown>;
/**
 * @summary Admin logout
 */
export declare const useLogout: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
/**
 * @summary Current admin session
 */
export declare const getGetMeUrl: () => string;
export declare const getMe: (options?: RequestInit) => Promise<MeResponse>;
export declare const getGetMeQueryKey: () => readonly ["/api/auth/me"];
export declare const getGetMeQueryOptions: <TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMeQueryResult = NonNullable<Awaited<ReturnType<typeof getMe>>>;
export type GetMeQueryError = ErrorType<unknown>;
/**
 * @summary Current admin session
 */
export declare function useGetMe<TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List articles
 */
export declare const getListArticlesUrl: (params?: ListArticlesParams) => string;
export declare const listArticles: (params?: ListArticlesParams, options?: RequestInit) => Promise<Article[]>;
export declare const getListArticlesQueryKey: (params?: ListArticlesParams) => readonly ["/api/articles", ...ListArticlesParams[]];
export declare const getListArticlesQueryOptions: <TData = Awaited<ReturnType<typeof listArticles>>, TError = ErrorType<unknown>>(params?: ListArticlesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listArticles>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listArticles>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListArticlesQueryResult = NonNullable<Awaited<ReturnType<typeof listArticles>>>;
export type ListArticlesQueryError = ErrorType<unknown>;
/**
 * @summary List articles
 */
export declare function useListArticles<TData = Awaited<ReturnType<typeof listArticles>>, TError = ErrorType<unknown>>(params?: ListArticlesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listArticles>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create article
 */
export declare const getCreateArticleUrl: () => string;
export declare const createArticle: (createArticleBody: CreateArticleBody, options?: RequestInit) => Promise<Article>;
export declare const getCreateArticleMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createArticle>>, TError, {
        data: BodyType<CreateArticleBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createArticle>>, TError, {
    data: BodyType<CreateArticleBody>;
}, TContext>;
export type CreateArticleMutationResult = NonNullable<Awaited<ReturnType<typeof createArticle>>>;
export type CreateArticleMutationBody = BodyType<CreateArticleBody>;
export type CreateArticleMutationError = ErrorType<unknown>;
/**
 * @summary Create article
 */
export declare const useCreateArticle: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createArticle>>, TError, {
        data: BodyType<CreateArticleBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createArticle>>, TError, {
    data: BodyType<CreateArticleBody>;
}, TContext>;
export declare const getGetArticleUrl: (id: number) => string;
export declare const getArticle: (id: number, options?: RequestInit) => Promise<Article>;
export declare const getGetArticleQueryKey: (id: number) => readonly [`/api/articles/${number}`];
export declare const getGetArticleQueryOptions: <TData = Awaited<ReturnType<typeof getArticle>>, TError = ErrorType<ErrorResponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getArticle>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getArticle>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetArticleQueryResult = NonNullable<Awaited<ReturnType<typeof getArticle>>>;
export type GetArticleQueryError = ErrorType<ErrorResponse>;
export declare function useGetArticle<TData = Awaited<ReturnType<typeof getArticle>>, TError = ErrorType<ErrorResponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getArticle>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateArticleUrl: (id: number) => string;
export declare const updateArticle: (id: number, updateArticleBody: UpdateArticleBody, options?: RequestInit) => Promise<Article>;
export declare const getUpdateArticleMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateArticle>>, TError, {
        id: number;
        data: BodyType<UpdateArticleBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateArticle>>, TError, {
    id: number;
    data: BodyType<UpdateArticleBody>;
}, TContext>;
export type UpdateArticleMutationResult = NonNullable<Awaited<ReturnType<typeof updateArticle>>>;
export type UpdateArticleMutationBody = BodyType<UpdateArticleBody>;
export type UpdateArticleMutationError = ErrorType<unknown>;
export declare const useUpdateArticle: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateArticle>>, TError, {
        id: number;
        data: BodyType<UpdateArticleBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateArticle>>, TError, {
    id: number;
    data: BodyType<UpdateArticleBody>;
}, TContext>;
export declare const getDeleteArticleUrl: (id: number) => string;
export declare const deleteArticle: (id: number, options?: RequestInit) => Promise<Ok>;
export declare const getDeleteArticleMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteArticle>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteArticle>>, TError, {
    id: number;
}, TContext>;
export type DeleteArticleMutationResult = NonNullable<Awaited<ReturnType<typeof deleteArticle>>>;
export type DeleteArticleMutationError = ErrorType<unknown>;
export declare const useDeleteArticle: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteArticle>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteArticle>>, TError, {
    id: number;
}, TContext>;
export declare const getListGamesUrl: () => string;
export declare const listGames: (options?: RequestInit) => Promise<Game[]>;
export declare const getListGamesQueryKey: () => readonly ["/api/games"];
export declare const getListGamesQueryOptions: <TData = Awaited<ReturnType<typeof listGames>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listGames>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listGames>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListGamesQueryResult = NonNullable<Awaited<ReturnType<typeof listGames>>>;
export type ListGamesQueryError = ErrorType<unknown>;
export declare function useListGames<TData = Awaited<ReturnType<typeof listGames>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listGames>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateGameUrl: () => string;
export declare const createGame: (createGameBody: CreateGameBody, options?: RequestInit) => Promise<Game>;
export declare const getCreateGameMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createGame>>, TError, {
        data: BodyType<CreateGameBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createGame>>, TError, {
    data: BodyType<CreateGameBody>;
}, TContext>;
export type CreateGameMutationResult = NonNullable<Awaited<ReturnType<typeof createGame>>>;
export type CreateGameMutationBody = BodyType<CreateGameBody>;
export type CreateGameMutationError = ErrorType<unknown>;
export declare const useCreateGame: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createGame>>, TError, {
        data: BodyType<CreateGameBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createGame>>, TError, {
    data: BodyType<CreateGameBody>;
}, TContext>;
export declare const getGetGameUrl: (id: number) => string;
export declare const getGame: (id: number, options?: RequestInit) => Promise<GameDetail>;
export declare const getGetGameQueryKey: (id: number) => readonly [`/api/games/${number}`];
export declare const getGetGameQueryOptions: <TData = Awaited<ReturnType<typeof getGame>>, TError = ErrorType<ErrorResponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getGame>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getGame>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetGameQueryResult = NonNullable<Awaited<ReturnType<typeof getGame>>>;
export type GetGameQueryError = ErrorType<ErrorResponse>;
export declare function useGetGame<TData = Awaited<ReturnType<typeof getGame>>, TError = ErrorType<ErrorResponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getGame>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateGameUrl: (id: number) => string;
export declare const updateGame: (id: number, updateGameBody: UpdateGameBody, options?: RequestInit) => Promise<Game>;
export declare const getUpdateGameMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateGame>>, TError, {
        id: number;
        data: BodyType<UpdateGameBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateGame>>, TError, {
    id: number;
    data: BodyType<UpdateGameBody>;
}, TContext>;
export type UpdateGameMutationResult = NonNullable<Awaited<ReturnType<typeof updateGame>>>;
export type UpdateGameMutationBody = BodyType<UpdateGameBody>;
export type UpdateGameMutationError = ErrorType<unknown>;
export declare const useUpdateGame: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateGame>>, TError, {
        id: number;
        data: BodyType<UpdateGameBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateGame>>, TError, {
    id: number;
    data: BodyType<UpdateGameBody>;
}, TContext>;
export declare const getDeleteGameUrl: (id: number) => string;
export declare const deleteGame: (id: number, options?: RequestInit) => Promise<Ok>;
export declare const getDeleteGameMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteGame>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteGame>>, TError, {
    id: number;
}, TContext>;
export type DeleteGameMutationResult = NonNullable<Awaited<ReturnType<typeof deleteGame>>>;
export type DeleteGameMutationError = ErrorType<unknown>;
export declare const useDeleteGame: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteGame>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteGame>>, TError, {
    id: number;
}, TContext>;
export declare const getListGalleriesUrl: (params?: ListGalleriesParams) => string;
export declare const listGalleries: (params?: ListGalleriesParams, options?: RequestInit) => Promise<Gallery[]>;
export declare const getListGalleriesQueryKey: (params?: ListGalleriesParams) => readonly ["/api/galleries", ...ListGalleriesParams[]];
export declare const getListGalleriesQueryOptions: <TData = Awaited<ReturnType<typeof listGalleries>>, TError = ErrorType<unknown>>(params?: ListGalleriesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listGalleries>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listGalleries>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListGalleriesQueryResult = NonNullable<Awaited<ReturnType<typeof listGalleries>>>;
export type ListGalleriesQueryError = ErrorType<unknown>;
export declare function useListGalleries<TData = Awaited<ReturnType<typeof listGalleries>>, TError = ErrorType<unknown>>(params?: ListGalleriesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listGalleries>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateGalleryUrl: () => string;
export declare const createGallery: (createGalleryBody: CreateGalleryBody, options?: RequestInit) => Promise<Gallery>;
export declare const getCreateGalleryMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createGallery>>, TError, {
        data: BodyType<CreateGalleryBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createGallery>>, TError, {
    data: BodyType<CreateGalleryBody>;
}, TContext>;
export type CreateGalleryMutationResult = NonNullable<Awaited<ReturnType<typeof createGallery>>>;
export type CreateGalleryMutationBody = BodyType<CreateGalleryBody>;
export type CreateGalleryMutationError = ErrorType<unknown>;
export declare const useCreateGallery: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createGallery>>, TError, {
        data: BodyType<CreateGalleryBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createGallery>>, TError, {
    data: BodyType<CreateGalleryBody>;
}, TContext>;
export declare const getGetGalleryUrl: (id: number) => string;
export declare const getGallery: (id: number, options?: RequestInit) => Promise<Gallery>;
export declare const getGetGalleryQueryKey: (id: number) => readonly [`/api/galleries/${number}`];
export declare const getGetGalleryQueryOptions: <TData = Awaited<ReturnType<typeof getGallery>>, TError = ErrorType<ErrorResponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getGallery>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getGallery>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetGalleryQueryResult = NonNullable<Awaited<ReturnType<typeof getGallery>>>;
export type GetGalleryQueryError = ErrorType<ErrorResponse>;
export declare function useGetGallery<TData = Awaited<ReturnType<typeof getGallery>>, TError = ErrorType<ErrorResponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getGallery>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateGalleryUrl: (id: number) => string;
export declare const updateGallery: (id: number, updateGalleryBody: UpdateGalleryBody, options?: RequestInit) => Promise<Gallery>;
export declare const getUpdateGalleryMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateGallery>>, TError, {
        id: number;
        data: BodyType<UpdateGalleryBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateGallery>>, TError, {
    id: number;
    data: BodyType<UpdateGalleryBody>;
}, TContext>;
export type UpdateGalleryMutationResult = NonNullable<Awaited<ReturnType<typeof updateGallery>>>;
export type UpdateGalleryMutationBody = BodyType<UpdateGalleryBody>;
export type UpdateGalleryMutationError = ErrorType<unknown>;
export declare const useUpdateGallery: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateGallery>>, TError, {
        id: number;
        data: BodyType<UpdateGalleryBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateGallery>>, TError, {
    id: number;
    data: BodyType<UpdateGalleryBody>;
}, TContext>;
export declare const getDeleteGalleryUrl: (id: number) => string;
export declare const deleteGallery: (id: number, options?: RequestInit) => Promise<Ok>;
export declare const getDeleteGalleryMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteGallery>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteGallery>>, TError, {
    id: number;
}, TContext>;
export type DeleteGalleryMutationResult = NonNullable<Awaited<ReturnType<typeof deleteGallery>>>;
export type DeleteGalleryMutationError = ErrorType<unknown>;
export declare const useDeleteGallery: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteGallery>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteGallery>>, TError, {
    id: number;
}, TContext>;
export declare const getAddGalleryImagesUrl: (id: number) => string;
export declare const addGalleryImages: (id: number, addGalleryImagesBody: AddGalleryImagesBody, options?: RequestInit) => Promise<Gallery>;
export declare const getAddGalleryImagesMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addGalleryImages>>, TError, {
        id: number;
        data: BodyType<AddGalleryImagesBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof addGalleryImages>>, TError, {
    id: number;
    data: BodyType<AddGalleryImagesBody>;
}, TContext>;
export type AddGalleryImagesMutationResult = NonNullable<Awaited<ReturnType<typeof addGalleryImages>>>;
export type AddGalleryImagesMutationBody = BodyType<AddGalleryImagesBody>;
export type AddGalleryImagesMutationError = ErrorType<unknown>;
export declare const useAddGalleryImages: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addGalleryImages>>, TError, {
        id: number;
        data: BodyType<AddGalleryImagesBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof addGalleryImages>>, TError, {
    id: number;
    data: BodyType<AddGalleryImagesBody>;
}, TContext>;
export declare const getDeleteGalleryImageUrl: (id: number, imageId: number) => string;
export declare const deleteGalleryImage: (id: number, imageId: number, options?: RequestInit) => Promise<Gallery>;
export declare const getDeleteGalleryImageMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteGalleryImage>>, TError, {
        id: number;
        imageId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteGalleryImage>>, TError, {
    id: number;
    imageId: number;
}, TContext>;
export type DeleteGalleryImageMutationResult = NonNullable<Awaited<ReturnType<typeof deleteGalleryImage>>>;
export type DeleteGalleryImageMutationError = ErrorType<unknown>;
export declare const useDeleteGalleryImage: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteGalleryImage>>, TError, {
        id: number;
        imageId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteGalleryImage>>, TError, {
    id: number;
    imageId: number;
}, TContext>;
export declare const getListPostsUrl: (params?: ListPostsParams) => string;
export declare const listPosts: (params?: ListPostsParams, options?: RequestInit) => Promise<Post[]>;
export declare const getListPostsQueryKey: (params?: ListPostsParams) => readonly ["/api/posts", ...ListPostsParams[]];
export declare const getListPostsQueryOptions: <TData = Awaited<ReturnType<typeof listPosts>>, TError = ErrorType<unknown>>(params?: ListPostsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPosts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listPosts>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListPostsQueryResult = NonNullable<Awaited<ReturnType<typeof listPosts>>>;
export type ListPostsQueryError = ErrorType<unknown>;
export declare function useListPosts<TData = Awaited<ReturnType<typeof listPosts>>, TError = ErrorType<unknown>>(params?: ListPostsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPosts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreatePostUrl: () => string;
export declare const createPost: (createPostBody: CreatePostBody, options?: RequestInit) => Promise<Post>;
export declare const getCreatePostMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createPost>>, TError, {
        data: BodyType<CreatePostBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createPost>>, TError, {
    data: BodyType<CreatePostBody>;
}, TContext>;
export type CreatePostMutationResult = NonNullable<Awaited<ReturnType<typeof createPost>>>;
export type CreatePostMutationBody = BodyType<CreatePostBody>;
export type CreatePostMutationError = ErrorType<unknown>;
export declare const useCreatePost: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createPost>>, TError, {
        data: BodyType<CreatePostBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createPost>>, TError, {
    data: BodyType<CreatePostBody>;
}, TContext>;
export declare const getGetPostUrl: (id: number) => string;
export declare const getPost: (id: number, options?: RequestInit) => Promise<Post>;
export declare const getGetPostQueryKey: (id: number) => readonly [`/api/posts/${number}`];
export declare const getGetPostQueryOptions: <TData = Awaited<ReturnType<typeof getPost>>, TError = ErrorType<ErrorResponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPost>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getPost>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetPostQueryResult = NonNullable<Awaited<ReturnType<typeof getPost>>>;
export type GetPostQueryError = ErrorType<ErrorResponse>;
export declare function useGetPost<TData = Awaited<ReturnType<typeof getPost>>, TError = ErrorType<ErrorResponse>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPost>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdatePostUrl: (id: number) => string;
export declare const updatePost: (id: number, updatePostBody: UpdatePostBody, options?: RequestInit) => Promise<Post>;
export declare const getUpdatePostMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updatePost>>, TError, {
        id: number;
        data: BodyType<UpdatePostBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updatePost>>, TError, {
    id: number;
    data: BodyType<UpdatePostBody>;
}, TContext>;
export type UpdatePostMutationResult = NonNullable<Awaited<ReturnType<typeof updatePost>>>;
export type UpdatePostMutationBody = BodyType<UpdatePostBody>;
export type UpdatePostMutationError = ErrorType<unknown>;
export declare const useUpdatePost: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updatePost>>, TError, {
        id: number;
        data: BodyType<UpdatePostBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updatePost>>, TError, {
    id: number;
    data: BodyType<UpdatePostBody>;
}, TContext>;
export declare const getDeletePostUrl: (id: number) => string;
export declare const deletePost: (id: number, options?: RequestInit) => Promise<Ok>;
export declare const getDeletePostMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deletePost>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deletePost>>, TError, {
    id: number;
}, TContext>;
export type DeletePostMutationResult = NonNullable<Awaited<ReturnType<typeof deletePost>>>;
export type DeletePostMutationError = ErrorType<unknown>;
export declare const useDeletePost: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deletePost>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deletePost>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary Aggregate counts and recent activity for the admin dashboard
 */
export declare const getGetAdminStatsUrl: () => string;
export declare const getAdminStats: (options?: RequestInit) => Promise<AdminStats>;
export declare const getGetAdminStatsQueryKey: () => readonly ["/api/admin/stats"];
export declare const getGetAdminStatsQueryOptions: <TData = Awaited<ReturnType<typeof getAdminStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAdminStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAdminStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getAdminStats>>>;
export type GetAdminStatsQueryError = ErrorType<unknown>;
/**
 * @summary Aggregate counts and recent activity for the admin dashboard
 */
export declare function useGetAdminStats<TData = Awaited<ReturnType<typeof getAdminStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Homepage curated content
 */
export declare const getGetHomeFeaturedUrl: () => string;
export declare const getHomeFeatured: (options?: RequestInit) => Promise<HomeFeatured>;
export declare const getGetHomeFeaturedQueryKey: () => readonly ["/api/home/featured"];
export declare const getGetHomeFeaturedQueryOptions: <TData = Awaited<ReturnType<typeof getHomeFeatured>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getHomeFeatured>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getHomeFeatured>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetHomeFeaturedQueryResult = NonNullable<Awaited<ReturnType<typeof getHomeFeatured>>>;
export type GetHomeFeaturedQueryError = ErrorType<unknown>;
/**
 * @summary Homepage curated content
 */
export declare function useGetHomeFeatured<TData = Awaited<ReturnType<typeof getHomeFeatured>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getHomeFeatured>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map