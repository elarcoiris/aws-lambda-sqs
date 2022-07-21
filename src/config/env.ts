const { env } = process;

export const getNodeEnv = (): string => {
    return env.NODE_ENV ?? 'dev';
}