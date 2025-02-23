export const wait = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 5
): Promise<Response> {
  let retryCount = 0;
  let lastError: Error | null = null;

  while (retryCount < maxRetries) {
    try {
      const res = await fetch(url, options);

      // If we hit rate limit, wait and retry
      if (res.status === 429) {
        const retryAfter = res.headers.get("Retry-After");
        const waitTime = retryAfter
          ? parseInt(retryAfter) * 1000
          : Math.pow(2, retryCount) * 1000;
        console.log(
          `Rate limited, waiting ${waitTime}ms before retry ${
            retryCount + 1
          }/${maxRetries}`
        );
        await wait(waitTime);
        retryCount++;
        continue;
      }

      return res;
    } catch (error) {
      lastError = error as Error;
      const waitTime = Math.pow(2, retryCount) * 1000;
      console.log(
        `Request failed, waiting ${waitTime}ms before retry ${
          retryCount + 1
        }/${maxRetries}`
      );
      await wait(waitTime);
      retryCount++;
    }
  }

  throw lastError || new Error("Max retries reached");
}
