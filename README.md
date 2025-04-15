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

## Prompts
### Cursor
Create a web app that displays 15 items per page. The page has a "next" and "previous" button  
  
The items have the following properties:  
- "breed" - string; breed of dog  
- "image" - string; url to an image; this can be bull  
  
If "image" is null, use a placeholder image instead.  
  
The UI will be populated from calling an API. The API endpoint is "https://interview-api-olive.vercel.app/api/dogs?page=<ipage_num>", where each API to returns 7 items. In the following format:  
```  
[  
{  
"breed": "string",  
"image": string",  
},  
....  
]  
```  
  
The API may return an error, which should be retried at least once. The error message has the following format:  
```  
{  
"error": "error reason"  
}  
```

-----
Use tailwind CSS

------
There's a CORs issue, not allowing the request to get to the API endpoint. Can you provide some options for fixing this?

----
When loading, I want it to display some animation so I know to wait

----
setup logging with Bunyan in server.js

----

### ChatGPT
The dogs API `/api/dogs?page={num}` returns 7 items per page. My react app displays 15 items per page. I need to calculate the offset to display the dogs per page without re-displaying dogs from previous pages.

