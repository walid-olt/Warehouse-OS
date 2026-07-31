export type Result<T, E = Error> =
  | [error: E, data: undefined]
  | [error: undefined, data: T];

export async function tryCatch<T, E = Error>(
  promise: Promise<T>,
  errorMapper?: (err: unknown) => E,
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return [undefined, data];
  } catch (error) {
    if (errorMapper) {
      return [errorMapper(error), undefined];
    }

    const normalizedError =
      error instanceof Error ? error : new Error(String(error));

    return [normalizedError as E, undefined];
  }
}
export function tryCatchSync<T, E = Error>(
  fn: () => T,
  errorMapper?: (err: unknown) => E,
): Result<T, E> {
  try {
    return [undefined, fn()];
  } catch (error) {
    if (errorMapper) {
      return [errorMapper(error), undefined];
    }

    const normalizedError =
      error instanceof Error ? error : new Error(String(error));

    return [normalizedError as E, undefined];
  }
}
