/**
 * API Configuration
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const API_ENDPOINTS = {
  // Routes
  ROUTES: "/api/routes",
  ROUTE_BASELINE: (routeId: string) => `/api/routes/${routeId}/baseline`,
  ROUTE_COMPARISON: "/api/routes/comparison",

  // Compliance
  COMPUTE_CB: "/api/compliance/cb",
  ADJUSTED_CB: "/api/compliance/adjusted-cb",
  CB_ALL: "/api/compliance/cb-all",

  // Banking
  BANK_SURPLUS: "/api/banking/bank",
  APPLY_SURPLUS: "/api/banking/apply",
  BANKING_RECORDS: "/api/banking/records",

  // Pooling
  POOLS: "/api/pools",
} as const;

/**
 * API Error class
 */
export class ApiError extends Error {
  constructor(public status: number, message: string, public data?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Generic API fetch wrapper with error handling
 */
export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  console.log("[apiFetch] Request:", {
    url,
    method: options?.method || "GET",
    body: options?.body,
    headers: options?.headers,
  });

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    console.log(
      "[apiFetch] Response status:",
      response.status,
      response.statusText
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("[apiFetch] Error response:", errorData);
      throw new ApiError(
        response.status,
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        errorData
      );
    }

    const data = await response.json();
    console.log("[apiFetch] Success response:", data);
    return data;
  } catch (error) {
    console.error("[apiFetch] Exception caught:", error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, `Network error: ${(error as Error).message}`);
  }
}
