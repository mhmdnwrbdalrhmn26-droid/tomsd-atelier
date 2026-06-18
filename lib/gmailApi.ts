export interface GmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  subject?: string;
  from?: string;
  to?: string;
  date?: string;
  body?: string;
}

/**
 * Base64url encode a string
 */
export const base64urlEncode = (str: string): string => {
  // Use UTF-8 safe btoa
  const utf8Bytes = new TextEncoder().encode(str);
  const binaryStr = Array.from(utf8Bytes, (byte) => String.fromCharCode(byte)).join("");
  const base64 = btoa(binaryStr);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

/**
 * Lists the user's latest 10 Gmail messages. Optional query "q" to filter messages.
 */
export async function listGmailMessages(accessToken: string, q?: string): Promise<GmailMessage[]> {
  try {
    let url = "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10";
    if (q) {
      url += `&q=${encodeURIComponent(q)}`;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gmail API List failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    if (!data.messages || data.messages.length === 0) {
      return [];
    }

    // Fetch details for each message
    const detailPromises = data.messages.map((msg: { id: string }) => 
      getGmailMessageDetail(msg.id, accessToken)
    );

    return await Promise.all(detailPromises);
  } catch (error) {
    console.error("Error listing Gmail messages:", error);
    throw error;
  }
}

/**
 * Retrieves full details for a single message.
 */
export async function getGmailMessageDetail(id: string, accessToken: string): Promise<GmailMessage> {
  const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=full`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Gmail API Get Message failed for ID ${id}: ${response.status}`);
  }

  const data = await response.json();
  
  // Extract custom headers
  const headers = data.payload?.headers || [];
  const subjectHeader = headers.find((h: any) => h.name.toLowerCase() === "subject")?.value || "بدون عنوان / No Subject";
  const fromHeader = headers.find((h: any) => h.name.toLowerCase() === "from")?.value || "غير معروف / Unknown";
  const toHeader = headers.find((h: any) => h.name.toLowerCase() === "to")?.value || "";
  const dateHeader = headers.find((h: any) => h.name.toLowerCase() === "date")?.value || "";

  // Helper to extract body text from parts
  let bodyText = "";
  if (data.payload?.body?.data) {
    bodyText = decodeBodyData(data.payload.body.data);
  } else if (data.payload?.parts) {
    bodyText = findTextBodyInParts(data.payload.parts);
  }

  return {
    id: data.id,
    threadId: data.threadId,
    snippet: data.snippet || "",
    subject: subjectHeader,
    from: fromHeader,
    to: toHeader,
    date: dateHeader,
    body: bodyText || data.snippet || "لا يوجد نص داخل الرسالة.",
  };
}

/**
 * Helper to recursively search and extract text content from message payload parts
 */
function findTextBodyInParts(parts: any[]): string {
  for (const part of parts) {
    if (part.mimeType === "text/plain" && part.body?.data) {
      return decodeBodyData(part.body.data);
    } else if (part.mimeType === "text/html" && part.body?.data) {
      // Return HTML as text if needed, or fallback
      return decodeBodyData(part.body.data);
    } else if (part.parts) {
      const subValue = findTextBodyInParts(part.parts);
      if (subValue) return subValue;
    }
  }
  return "";
}

/**
 * Decodes Gmail base64url-encoded body content
 */
function decodeBodyData(data: string): string {
  try {
    const base64 = data.replace(/-/g, "+").replace(/_/g, "/");
    const binaryStr = atob(base64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch (err) {
    console.error("Error decoding email body:", err);
    return "";
  }
}

/**
 * Sends a secure email on behalf of the user using Gmail API Send.
 */
export async function sendGmailMessage(
  accessToken: string,
  to: string,
  subject: string,
  contentHtml: string
): Promise<{ id: string; threadId: string }> {
  try {
    // Construct the email MIME standard format
    const rfcMessage = [
      `To: ${to}`,
      "Content-Type: text/html; charset=utf-8",
      "MIME-Version: 1.0",
      `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
      "",
      contentHtml
    ].join("\r\n");

    const rawBase64Url = base64urlEncode(rfcMessage);

    const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        raw: rawBase64Url,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gmail API Send failed: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending email via Gmail API:", error);
    throw error;
  }
}
