import { ActionResponse, ErrorResponse } from "@/types/glabal";
import { RequestError } from "../http-errros";
import handleError from "./error";

interface FetchOptions extends RequestInit {
  timeout?: number;
}

export async function fetchHandler<T>(
  url: string,
  options: FetchOptions = {},
): Promise<ActionResponse<T>> {
  const {
    timeout = 5000,
    headers: customHeaders = {},
    ...restOptions
  } = options;

  // create abort controller
  const controller = new AbortController();

  // create timer that stops the fetch request after the timeout  (5s)
  const timerId = setTimeout(() => controller.abort(), timeout);

  // let us set up our headers
  const headersConfig: HeadersInit = {
    ...customHeaders,
    "Content-Type": "application/json",
    accept: "application/json",
  };

  // config file for all fetch requests
  const config: RequestInit = {
    ...restOptions,
    headers: headersConfig,
    signal: controller.signal,
  };

  try {
    const response = await fetch(url, config);

    // succesfully fetch the data then clear timeout
    clearTimeout(timerId);

    // if there is not data.
    if (!response.ok) {
      throw new RequestError(
        response.status,
        `HTTP error : ${response.statusText}`,
      );
    }

    return response.json();
  } catch (error) {
    console.log(error);
    return handleError("server", error) as ErrorResponse;
  }
}
