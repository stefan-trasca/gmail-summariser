import { google } from 'googleapis';

export async function getGmailClient(accessToken: string) {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  auth.setCredentials({ access_token: accessToken });
  return google.gmail({ version: 'v1', auth });
}

export async function listEmails(accessToken: string, query = '') {
  const gmail = await getGmailClient(accessToken);
  
  try {
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 100,
      q: `${query} newer_than:30d`, // Only fetch emails from last 30 days
    });

    const messages = response.data.messages || [];
    const emails = await Promise.all(
      messages.map(async (message) => {
        const email = await gmail.users.messages.get({
          userId: 'me',
          id: message.id!,
          format: 'full',
        });

        const headers = email.data.payload?.headers;
        const subject = headers?.find((h) => h.name === 'Subject')?.value || '';
        const from = headers?.find((h) => h.name === 'From')?.value || '';
        const date = headers?.find((h) => h.name === 'Date')?.value || '';

        // Extract email body
        let body = '';
        if (email.data.payload?.parts) {
          const textPart = email.data.payload.parts.find(
            part => part.mimeType === 'text/plain'
          );
          if (textPart?.body?.data) {
            body = Buffer.from(textPart.body.data, 'base64').toString();
          }
        } else if (email.data.payload?.body?.data) {
          body = Buffer.from(email.data.payload.body.data, 'base64').toString();
        }

        return {
          id: email.data.id!,
          subject,
          sender: from.match(/<(.+)>/)?.[1] || from,
          date: new Date(date),
          read: !(email.data.labelIds || []).includes('UNREAD'),
          body,
          tags: [], // We'll implement tag extraction later
        };
      })
    );

    return emails;
  } catch (error) {
    console.error('Error fetching emails:', error);
    throw error;
  }
}