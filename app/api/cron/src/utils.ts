export const wait = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

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
  { batchSize, delayMs }: { batchSize: number; delayMs: number }
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const processedBatch = await Promise.all(
      batch.map(item => processorFn(item))
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
export function apiResponse(
  fn: () => Promise<Response> | Response
): Promise<Response> | Response {
  try {
    return fn();
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
