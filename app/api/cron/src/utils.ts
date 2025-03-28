import type { Issue, IssueCode } from "./types";

export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Process a batch of items with a specified processor function and batch size
 * @param items Items to process
 * @param processorFn Function to process each item
 * @param batchSize Number of items to process in parallel
 * @param delayMs Delay between batches in milliseconds
 * @returns Processed items
 */
export async function batchWithDelay<T, R>(
  items: T[],
  processorFn: (item: T) => Promise<R>,
  { batchSize, delayMs }: { batchSize: number; delayMs: number },
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const processedBatch = await Promise.all(
      batch.map((item) => processorFn(item)),
    );
    results.push(...processedBatch);

    // Add a small delay between batches
    if (i + batchSize < items.length) {
      await wait(delayMs);
    }
  }

  return results;
}

/**
 * Wraps a function that returns a Promise<Response> or a Response in a try-catch block.
 * If the function throws an error, it returns a Response with the error message.
 * Otherwise, it returns the Response from the function.
 */
export async function apiResponse(
  fn: () => Promise<Response> | Response,
): Promise<Response> {
  try {
    return await fn();
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export const make_error = <T extends Record<string, unknown>>(error: {
  message: string;
  code: IssueCode;
  more: T;
}) => {
  return {
    error: {
      ...error,
      with: <U extends Record<string, unknown>>(obj: U) => {
        return {
          ...error,
          more: { ...error.more, ...obj },
          toString: function () {
            return JSON.stringify(this);
          },
        };
      },
      toString: function () {
        return JSON.stringify(this);
      },
    },
    data: null,
  };
};

export const make_data = <T>(data: T) => {
  return {
    data,
    error: null,
  };
};

export type Result<T> =
  | {
      data: T;
      error: null;
    }
  | {
      data: null;
      error: Issue;
    };
