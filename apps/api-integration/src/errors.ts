export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const handleApiError = async (response: Response): Promise<never> => {
  const message = await extractErrorMessage(response);
  throw new ApiError(response.status, message);
};

const extractErrorMessage = async (response: Response): Promise<string> => {
  try {
    const data = await response.json();
    return data?.message || response.statusText;
  } catch {
    return response.statusText;
  }
};
