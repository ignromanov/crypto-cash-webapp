import axios from "axios";

const handleApiError = (error: unknown) => {
  console.error(error);

  let errorMessage =
    error instanceof Error ? error.message : "An API error occurred.";

  if (axios.isAxiosError(error) && error.response) {
    errorMessage = error.response.data.message;
  }

  return errorMessage;
};

export { handleApiError };
