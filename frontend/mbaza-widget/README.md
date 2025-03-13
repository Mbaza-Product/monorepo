# Mbaza Chatbot Widget

The Mbaza Chatbot Widget is a web-based widget that allows users to interact with different chatbots using multiple languages. This widget is designed to provide information and answer questions related to various topics, such as COVID-19 and general inquiries.

1. ## Deploy Chatbot

1. **Update the HOST in main.js:**

   ```js
   // main.js
   class MbazaChatbot {
     // IMPORTANT: Set the 'HOST' variable to the base URL where the 'main.js' file is hosted.
     // When deploying, update this value with the appropriate host.
     // For example, if your 'main.js' file is hosted at 'https://mbaza-chatbot.netlify.app/js/main.js',
     // set 'HOST' as 'https://mbaza-chatbot.netlify.app'.
     HOST = ""; // Update this with your actual host URL
     // Rest of the code in your main.js file
     // ...
   }
   ```

2. **Include Required Files:**

Ensure you have the necessary files, including the main.js file, in the specified [host](https://example.com)/js/ directory.

2. ## Usage

Once integrated, the Mbaza Chatbot Widget will be available on your website for users to interact with. Users can communicate with chatbots in various languages and receive responses based on the configured APIs.

3. ## Customization
   You can further customize the appearance, behavior, and interactions of the Mbaza Chatbot Widget by modifying the provided JavaScript code and associated CSS styles.

4. ## Chatbot Integration

To integrate the Mbaza Chatbot Widget into your website, follow these steps:

1. **Include the Script and Configuration:**

   Include the following script tag at the end of your HTML file, just before the closing `</body>` tag. Replace `'host'` with the appropriate value for the host of your `main.js` file:

   Customize the chatbots array in the configuration according to your requirements. Each chatbot object should contain:

- `name`: The name of the chatbot.
- `languages`: An array of language objects for the chatbot, each containing:

  - `lang`: The language code (e.g., "Kiny", "Eng", "SWA").
  - `api`: The API endpoint for the chatbot in the specified language.
  - `welcomeMessage`: The welcome message specific to the language.

  1. **Example Configuration:**

  ```html
  <script src="(host)[https://mbaza-chatbot.netlify.app]/js/main.js"></script>
  <script>
    var mbazaChatbot = new MbazaChatbot({
      title: "Bakame Chatbot",
      welcomeMessage: "Welcome, I am Mbaza a multi-tenant chatbot",
      theme: "dark", // Choose from 'blue', 'orange', or 'dark'
      chatbots: [
        {
          name: "covid",
          languages: [
            {
              lang: "Kiny", // supported languages are Kiny, Eng, Swa
              api: "https://rasarw.dev.ln-cloud.mbaza.org/webhooks/rest/webhook",
              welcomeMessage: "Murakaza neza, ndi Bakame, ndabaza covid19",
            },
            {
              lang: "Eng", // supported languages are Kiny, Eng, Swa
              api: "https://rasaen.dev.ln-cloud.mbaza.org/webhooks/rest/webhook",
              welcomeMessage:
                "Welcome, I am Bakame, I answer covid19 questions",
            },
            {
              lang: "SWA", // supported languages are Kiny, Eng, Swa
              api: "https://rasasw.dev.ln-cloud.mbaza.org/webhooks/rest/webhook",
              welcomeMessage:
                "Karibu, mimi ni Bakame, nina jibu maswali ya covid19",
            },
          ],
        },
        {
          name: "bakame",
          languages: [
            {
              lang: "Kiny", // supported languages are Kiny, Eng, Swa
              api: "http://chatbot.mbaza.org:5005/webhooks/rest/webhook",
              welcomeMessage: "Murakaza neza, ndi Bakame, ndabaza covid19",
            },
          ],
        },
      ],
    });
    mbazaChatbot.init();
  </script>
  ```

Remember to replace `'host'` with the actual path to your `main.js` file and customize the instructions according to your implementation and requirements.
