export interface GoogleFormDetails {
  formId: string;
  info: {
    title: string;
    description?: string;
    documentTitle?: string;
  };
  items?: GoogleFormItem[];
  responderUri?: string;
}

export interface GoogleFormItem {
  itemId: string;
  title?: string;
  description?: string;
  questionItem?: {
    question: {
      questionId: string;
      required?: boolean;
      choiceQuestion?: {
        type: "RADIO" | "CHECKBOX" | "DROP_DOWN";
        options: { value: string }[];
      };
    };
  };
}

export interface GoogleFormResponse {
  responseId: string;
  createTime: string;
  lastSubmittedTime: string;
  answers?: {
    [questionId: string]: {
      questionId: string;
      textAnswers: {
        answers: { value: string }[];
      };
    };
  };
}

/**
 * Creates a brand new Google Form for styling and size consultation using the Google Forms API.
 */
export async function createGoogleForm(accessToken: string, title: string): Promise<GoogleFormDetails> {
  const response = await fetch("https://forms.googleapis.com/v1/forms", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      info: {
        title: title,
        documentTitle: title,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Forms Create failed: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

/**
 * Retrieves full question details for a single Google Form.
 */
export async function getGoogleFormDetails(formId: string, accessToken: string): Promise<GoogleFormDetails> {
  const response = await fetch(`https://forms.googleapis.com/v1/forms/${formId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to load Google Form details for ${formId}: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

/**
 * Lists details of submissions/responses for a Google Form.
 */
export async function getGoogleFormResponses(formId: string, accessToken: string): Promise<GoogleFormResponse[]> {
  const response = await fetch(`https://forms.googleapis.com/v1/forms/${formId}/responses`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to load responses for Google Form ${formId}: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.responses || [];
}
