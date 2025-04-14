# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## To Run the App
The app will run React and Express concurrently
1. `pnpm install`
2. `npm run dev`

## Reasoning
- Trying to make an API call directly from the React app will result in a CORS error. To resolve this issue, I used Express as a forward proxy to the dog API endpoint. Because I don't have access to the API, I can't disable CORS.
- Since the API can fail, I used a retry policy to handle errors from the API. A low retry count is used to prevent retry storms.
- I added placeholders if the API (after retries) returns an error so we don't mess up the indexing for the dogs. It also provides a more consistent experience for the user, so that way they don't see gaps with missing items on a page or dogs they wouldn't have seen otherwise if the API haven't failed.
    - For example, with zero-indexing, the 15th dog from the API shouldn't be displayed on the first page, but rather the second page. If the first two API pages failed to load, but the third API page succeeded, it will display dogs with indices 14 to 20, which provides an inconsistent view to the user
- Hardcode upper page limit to 12 pages, since API goes up to page 25. Each API page has 7 items, so ceil(25 * 7 / 15) = 12 total web pages are needed.

## Follow-ups
- Write unit tests for client logic with Jest
- Write integration tests for UI logic with Selenium
- Add retry logic to proxy server and throttling the client

