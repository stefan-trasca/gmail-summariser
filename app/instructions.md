# Project overview
Your goal is to build a next.js app that allows users to connect to their Gmail and easily summarize key aspects of their emails(that user decides) from their mailbox and summarize them in a nice table.
You will be using Next.js 14, shadcn, tailwind and Lucid icon. Make sure to not use Next.js 15.

# Core functionality
## 1. Connect to the users email address using Gmail API
- Have a connect button that will allow users to connect to their email address
- Once connected, the app should be able to fetch the emails from the inbox
- There should be a visible error message if the connection fails
- There should be a visible success message if the connection is successful
- after user connects, display his user photo, email address a green succes checkmark
- on hover, display a way to disconnect the user

## 2. Display the emails in a nice UI
- The app should be able to display the emails in a nice UI
- The app should be able to display the subject, date, sender, and the summary of the email
- display latest 15 emails
- make it clear whether the email has been read or not
- have pagination
- have a search bar
- above the table, display the top 10 most common senders together with count of emails

## 3. Form that allows user to enter email addresses, 1 by one or in bulk 
- Users should be able to enter a single email address or a bulk list of email addresses
- Form should verify that the email addresses are valid
- Once email address has been added and verified as valid format, it should be displayed differently in the UI to show that it has been added
- There should be a visible error message if the email address is invalid
- There should be a max limit of 20 email addresses


## 3. Email retrieval
- After the user has clicked on the connect button and the connection is successful the app should be able to retrieve emails from the inbox
- There should be a loading screen while the emails are being fetched
- There should be a visible error message if the emails are not being fetched
- There should be a visible success message if the emails are being fetched
- The app should only retrieve the emails from the given email addresses given by the user
- The app should only retrieve the emails from the past 30 days

## 4. Data parsing
- take the email content of each email and parse it into a JSON object that contains the following information:
- subject
- date
- sender
- body 

## 5. Harmonize common aspects of the emails from those particular addresses and offer as tags
- Use OpenAI structured output to find common tags
- use gpt 4o and zod for defining data structure
- create a prompt andask it to find a maximum of 10 common tags between the emails
- strictly follow OpenAI documentation as code implementation example
- if there are more than 10 tags, ask it to find the top 10
- if there are less than 10 tags it feels strongly about there can be less than 10 tags but more than 3
- show the common tags in the UI

## 6. ALlow users to select the tags or add more tags
- allow user to toggle the tags
- allow user to add more tags

## 7. Create structured data for each email
- use OpenAI structured output to define the data structure
- use gpt 4o and zod for defining data structure
- create a prompt and ask it to extract for each email the information pertaining only to each of the selected tags in a structured output
- most of the information should be extracted from the email body but some of the tagged aspects could be extracted from other metadata available in the email
- the output should be a JSON object that contains the following information:
- tag 1
- tag 2
- tag 3
- tag 4
- tag 5
- tag 6
- tag 7
- tag 8
- tag 9
- tag 10

-  within each tag the info should be concise but if there are exact informations those ex. IBAN, URLs , Addresses, Phone, those should be displayed as they are


## 8. Build a timeline table that shows in a structured manner the table subject, date, sender, and each of the selected tags
- Sort the table by sender, nesting multiple emails from the same sender
- Secondary sort by date
- Tertiary sort by subject
- Add a search bar that allows users to search for specific emails
- Add the selected tags to the table as columns
- add the structured data to the table as rows


# Gmail Summarizer - Setup Instructions

## Prerequisites
- Node.js installed
- Google Cloud Console project with Gmail API enabled

## Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Ensure the Gmail API is enabled for your project
3. Verify the following redirect URI is added to your OAuth consent screen:
   ```
   http://localhost:3000/api/auth/callback
   ```

## Running the Application

1. Navigate to the project directory:
   ```bash
   cd gmail-summarizer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit:
   ```
   http://localhost:3000
   ```

5. Click "Connect Gmail" to authenticate and view your emails

## Troubleshooting
- If you see authentication errors, verify that the redirect URI is correctly configured in Google Cloud Console
- Make sure all environment variables are properly set in the `.env` file
- Clear your browser cookies if you experience authentication issues

# Doc

## OpenAI structured output example
import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const openai = new OpenAI();

const ResearchPaperExtraction = z.object({
  title: z.string(),
  authors: z.array(z.string()),
  abstract: z.string(),
  keywords: z.array(z.string()),
});

const completion = await openai.beta.chat.completions.parse({
  model: "gpt-4o-2024-08-06",
  messages: [
    { role: "system", content: "You are an expert at structured data extraction. You will be given unstructured text from a research paper and should convert it into the given structure." },
    { role: "user", content: "..." },
  ],
  response_format: zodResponseFormat(ResearchPaperExtraction, "research_paper_extraction"),
});

const research_paper = completion.choices[0].message.parsed; 

# Important implementation details

## 0. Adding logs
- Always add server side logs to your code so we can debug any potential issues

## 1. Project setup
- All new components should go in /components at the root (not in the app folder) and be named like
example-component.tsx unless otherwise specified
- All new pages go in /app
- Use the Next.js 14 app router
- All data fetching should be done in a server component and pass the data down as props
- Client components (useState, hooks, etc) require that 'use client' is set at the top of the file

## 2. Server-Side API Calls:
- All interactions with external APIs (e.g., Reddit, OpenAI) should be performed server-side.^ Pull up for |
- Create dedicated API routes in the 'pages/api directory for each external API int
- Client-side components should fetch data through these API routes, not directly fi

## 3. Environment Variables:
- Store all sensitive information (API keys, credentials) in environment variables.
- Use a ''env. local' file for local development and ensure it's listed in ' gitigno
- For production, set environment variables in the deployment platform (e.g., Verce
- Access environment variables only in server-side code or API routes.

## 4. Error Handling and Logging:
- Implement comprehensive error handling in both client-side components and server-side API routes
- Log errors on the server-side for debugging purposes. Case study: Build F
- Display user-friendly error messages on the client-side. 

## 5. Type Safety:
- Use TypeScript interfaces for all data structures, especially API responses.
- Avoid using 'any type; instead, define proper types for all variables and function parameters.

## 6. API Client Initialization:
• Initialize API clients (e.g., Snoowrap for Reddit, OpenAI) in server-side code only.
- Implement checks to ensure API clients are properly initialized before use.

## 7. Data Fetching in Components:
- Use React hooks (e-g., 'useEffect) for data fetching in client-side components.
- Implement loading states and error handling for all data fetching operations.

## 8. Next.js Configuration:
- Utilize 'next.config.mjs' for environment-specific configurations.
- Use the 'env property in 'next.config.mjs' to make environment variables available to the application.

## 9. CORS and API houtes:
- Use Next.js API routes to avoid CORS issues when interacting with external APIs.
- Implement proper request validation in API routes.

## 10. Component Structure:
- Separate concerns between client and server components.
- Use server components for initial data fetching and pass data as props to client components.

## 11. Security:
- Never expose API keys, credentials, or other sensitive information in the client-side code.
