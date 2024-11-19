const BASE_URL = 'https://agwyz0r4jg.execute-api.eu-north-1.amazonaws.com';

interface SignupData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface ApiResponse {
  message: string;
  [key: string]: any;
}

const apiRequest = async (
  endpoint: string,
  method: string,
  body: object | null = null
): Promise<ApiResponse> => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : null,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Something went wrong');
  }

  return response.json();
};

// Specific API functions
export const signupUser = (userData: SignupData) =>
  apiRequest('/signup', 'POST', userData);
export const loginUser = (credentials: LoginData) =>
  apiRequest('/login', 'POST', credentials);
