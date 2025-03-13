console.log("hello i'm Bakame, your guy");

const chatbot = document.querySelector(".chatbot");
const bakame = document.querySelector("#bakame");
const bakameSaba = document.querySelector("#bakameSaba");
const bakameType = document.querySelector("#bakameType");
const bakameSend = document.querySelector("#bakameSend");
const bakameMic = document.querySelector("#bakameMic");
const initialContent = document.querySelector(".initialText");
const bakameRecording = document.querySelector("#bakameRecording");
const bakameCancel = document.querySelector("#bakameCancel");
const bakamePause = document.querySelector("#bakamePause");
const bakameAudio = document.querySelector("#bakameAudio");

const timerLabel = document.getElementById("timerLabel");
const content = document.querySelector(".content");
const chatContent = document.querySelector(".chatTextContent");
const chatResponse = document.querySelector(".chatTextResponse");
const bakameMobile = document.querySelector("#bakameMobile");
const smallDev = document.querySelector(".smallDev");
const bakameContent = document.querySelector(".content");
const bakameLang = document.querySelector("#bakameLanguage");
// const bakameLangMini = document.querySelector("#bakameLanguageMini");
const bakameApiSelect = document.querySelector("#bakameApi");

// this function will receive the request data
// it should create  the request div and its children included and return it

const btnMaximizer = document.querySelector("#btn-maximizer");
const btnMinimizer = document.querySelector("#btn-minimizer");
const flagDisplay = document.querySelector("#flagDisplay");

const supportedLanguages = ["eng", "kiny", "fre", "swa"];

const scrollToBottom = () => {
  bakameContent.scrollTo({
    top: bakameContent.scrollHeight,
    behavior: "smooth",
  });
};

const changeFlag = () => {
  if (supportedLanguages.includes(bakameLang.value?.toLowerCase())) {
    flagDisplay.style["display"] = "block";
    flagDisplay.style["background-image"] = `url(${
      mbazaChatbot.HOST
    }/images/flags/${bakameLang.value.toLowerCase()}.png)`;
  } else {
    flagDisplay.style["display"] = "none";
  }
};

btnMaximizer.addEventListener("click", () => {
  content.style["height"] = "70vh";
  const isLargeScreen = window.matchMedia("(min-width: 768px)").matches;
  if (isLargeScreen) {
    chatbot.style["width"] = "50%";
  }
});

btnMinimizer.addEventListener("click", () => {
  chatbot.style["display"] = "none";
  smallDev.style["display"] = "block";
  content.style["height"] = "40vh";
  const isLargeScreen = window.matchMedia("(min-width: 768px)").matches;
  if (isLargeScreen) {
    chatbot.style["width"] = "30%";
  }
});

function createDomRequestTree(req) {
  let chatTextContent = document.createElement("div");
  chatTextContent.setAttribute("class", "chatTextContent");
  const questionsContent = document.createElement("p");
  questionsContent.setAttribute("class", "questionsContent");
  questionsContent.innerHTML = req;
  chatTextContent.appendChild(questionsContent);

  return chatTextContent;
}

const set_BAKAME_API = () => {
  let selectedService = bakameApiSelect.value;
  let selectedFlag = bakameLang.value;

  if (!selectedService || !selectedFlag) {
    return null;
  }

  const foundChatbot = mbazaChatbot.config.chatbots.find(
    (chatbot) => chatbot.name === selectedService
  );
  if (!foundChatbot) {
    return null;
  }

  const foundLanguage = foundChatbot.languages.find(
    (language) => language.lang === selectedFlag
  );

  if (!foundLanguage) {
    return null;
  }

  return foundLanguage;
};
var recorder = null;
var timerCounter = null;
var bakameApi = null;
const mins10 = 600000;

const userGenerator = () => {
  return `user${Date.now()}`;
};

// user CRUD
const setUser = () => {
  let user = userGenerator();
  window.localStorage.setItem("mbazaUser", user);
};
const deleteUser = () => {
  window.localStorage.setItem("mbazaUser", "nouser");
};
const getUser = () => {
  let user = window.localStorage.getItem("mbazaUser");
  return user;
};

// default function to run
(() => {
  setUser();
  console.log("user", userGenerator());
})();

let wait10mins = window.setInterval(() => {
  deleteUser();
  setUser();
  // console.log("user", userGenerator());
}, mins10);

// setting up languages
bakameLang.addEventListener("change", function () {
  const selectedValue = bakameLang.value;
  changePlaceholder(selectedValue);
  const apiWelcomeMessage = set_BAKAME_API()?.welcomeMessage;

  if (apiWelcomeMessage) {
    initialContent.innerHTML = apiWelcomeMessage;
  }
  changeFlag();
});
bakameApiSelect.addEventListener("change", function () {
  const selectedValue = bakameApiSelect.value;
  let languages = bakameApiSelect.getAttribute("languages");

  const selectedOption = bakameApiSelect.options[bakameApiSelect.selectedIndex];
  const attributeValue = selectedOption.getAttribute("languages");
  // console.log(attributeValue);

  let toSend = attributeValue.split(",");
  console.log(
    "seledcted...",
    selectedValue,
    bakameApiSelect,
    attributeValue,
    toSend
  );
  setLanguagesFromConfigs(toSend);

  const apiWelcomeMessage = set_BAKAME_API()?.welcomeMessage;
  if (apiWelcomeMessage) {
    initialContent.innerHTML = apiWelcomeMessage;
  }
  changeFlag();
  
});

const changePlaceholder = (lang = bakameLang.value) => {
  const language = lang?.toLowerCase();
  let placeholder = "Write your text ...";
  if (language === "kiny") {
    placeholder = "Andika hano umbaze..";
  } else if (language === "fre") {
    placeholder = "Ecrivez votre texte ...";
  } else if (language === "swa") {
    placeholder = "Andika hapa ujumbe wako ...";
  }
  bakameType.placeholder = placeholder;
};

const bakameClean = () => {
  bakame.style["display"] = "none";
  bakameSend.style["display"] = "none";
  bakameRecording.style["display"] = "none";
  timerLabel.textContent = "";
};

const bakameCleanRecorder = () => {
  timerLabel.textContent = "";
  clearInterval(timerCounter);
};

const recordAudio = () =>
  new Promise(async (resolve) => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    mediaRecorder.addEventListener("dataavailable", (event) => {
      audioChunks.push(event.data);
    });

    const start = () => mediaRecorder.start();

    const stop = () =>
      new Promise((resolve) => {
        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/mpeg" });
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          const play = () => audio.play();
          resolve({ audioBlob, audioUrl, play });
        });
        mediaRecorder.stop();
      });
    resolve({ start, stop });
  });

const stopRecoder = async () => {
  const audio = await recorder.stop();
  // audio.play();
  console.log(audio);
  timerLabel.textContent = "";
  return audio;
};

const bakameRecordCount = async () => {
  let startTime = new Date().getTime();
  (async () => {
    recorder = await recordAudio();
    recorder.start();
  })();

  timerCounter = setInterval(function () {
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - startTime;

    // Calculate minutes and seconds from time difference
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    // Add leading zero to seconds if necessary
    const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

    // Update the timer label
    timerLabel.textContent = `${minutes}:${formattedSeconds}`;
  }, 1000);
};

bakameClean();

const regexInputValidataion = (input) => {
  let regexB = /^(?:\b[^\W\d_aeiou]{17,}\b|\b[^\W\d_aeiou]+\b(?=\W|$))/gi;
  const isMatch = regexB.test(input);

  console.log(isMatch);
  console.log(input.length);
};

// in any given sentence it should check and match only
// if it is a sentence made up of 1 word and composed of more than 16 characters
// or if in the whole sentence there's no any vowel, or words of that sentence has no vowels
// otherwise it should return false

// catch the whole input and match if it is only made of consonants,
// if it is more than 16 characters long in 1 word
// if it is
const foldUp = () => {
  console.log("foldUp");
  bakame.style["display"] = "block";
  bakameSaba.style["display"] = "none";
};
const foldDown = () => {
  console.log("foldDown");
  bakame.style["display"] = "none";
  bakameSaba.style["display"] = "block";
};

// Event listeners

bakameType.addEventListener("focus", () => {
  console.log("input focused");
  foldUp();
});

bakameType.addEventListener("input", () => {
  if (bakameType.value === "") {
    bakameMic.style["display"] = "block";
    bakameSend.style["display"] = "none";
  }
  if (bakameType.value !== "") {
    bakameMic.style["display"] = "none";
    bakameSend.style["display"] = "block";
  }
});

bakameType.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    regexInputValidataion(bakameType.value);
    console.log("Return key pressed!", bakameType.value);
    rasaApi(bakameType.value);
    bakameType.value = "";
  }
});

bakameMic.addEventListener("click", (event) => {
  event.preventDefault();
  foldUp();
  bakameMic.style["display"] = "none";
  bakameSaba.style["display"] = "none";
  bakameType.style["display"] = "none";
  bakameRecording.style["display"] = "flex";
});

bakameSend.addEventListener("click", (event) => {
  event.preventDefault();
  if (!bakameType.value?.trim()) {
    return;
  }
  regexInputValidataion(bakameType.value);

  rasaApi(bakameType.value);
  bakameType.value = "";
});

bakameMic.addEventListener("click", (event) => {
  event.preventDefault();
  console.log("Mic clicked");
  bakameRecordCount();
});

bakameCancel.addEventListener("click", (event) => {
  event.preventDefault();
  console.log("cancel clicked");
  foldUp();
  bakameMic.style["display"] = "block";
  bakameSaba.style["display"] = "none";
  bakameType.style["display"] = "block";
  bakameRecording.style["display"] = "none";
  stopRecoder();
  bakameCleanRecorder();
});

bakameAudio.addEventListener("click", async (event) => {
  event.preventDefault();
  const audio = await stopRecoder();
  bakameMic.style["display"] = "block";
  bakameSaba.style["display"] = "none";
  bakameType.style["display"] = "block";
  bakameRecording.style["display"] = "none";

  const data = new FormData();
  data.append("audio_bytes", audio.audioBlob);
  const { data: res } = await axios.post('http://deepspeech-stt.mbaza.local/transcribe', data, {
    headers: {
      'Content-Type': 'multipart/form-data', // Important to specify the correct content type
    }
  });
  bakameCleanRecorder();
  if (res.text) {
    rasaApi(res.text, "", true);
  }
});

bakameMobile.addEventListener("click", () => {
  chatbot.style["display"] = "block";
  smallDev.style["display"] = "none";
});

// calling the api

const rasaApi = (query, msg = "", isAudio = false) => {
  let rasaURL = set_BAKAME_API()?.api;
  if (!rasaURL) {
    console.log("No rasa url found");
    return;
  }
  let user = getUser();
  let reqData = {
    sender: user,
    message: query,
  };
  let treeContent = msg != "" ? msg : query;
  let divReq = createDomRequestTree(treeContent);
  bakameContent.appendChild(divReq);
  scrollToBottom();

  const sendRequest = async () => {
    const { data: res } = await axios.post(rasaURL, reqData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const sendButtonRequest = (title, pld) => {
      console.log("called ", title, pld);
      rasaApi(pld, title);
    };

    // Responses
    let allResponse = "";
    let divButtons = createDiv(); // this div will hold the buttons

    // Function to play each audio in sequence
    const playAudioSequentially = async (responses) => {
      for (let i = 0; i < responses.length; i++) {
        const response = responses[i];
        const text = response.text || "";

        let buttons = response.buttons || [];

        // Handle buttons if they exist
        buttons.length && buttons.map((btn) => {
          let button = document.createElement("button");
          button.setAttribute("class", "BakameBtn");
          button.addEventListener("click", (event) => {
            event.preventDefault();
            console.log("btn clickedddd");
            sendButtonRequest(btn.title, btn.payload);
          });
          button.innerHTML = btn.title;
          divButtons.appendChild(button);
        });

        // Add the response text to the HTML
        allResponse += `
          <p class="questionsContent">
          ${response.text}
          </p>`;
        let divRes = createDomResponseTree(response.text);
        if (response.buttons) {
          divRes.appendChild(divButtons);
        }

        if (isAudio) {
          await playAudio(text); // Wait for each audio to finish before playing the next one
        }
      }
    };

    // Play the audio messages sequentially
    await playAudioSequentially(res);

    console.log("--->", res);
  };

  sendRequest();
};

// Function to fetch and play audio
const playAudio = async (text) => {
  try {
    const { data: audioRes } = await axios.post('http://deepspeech-tts.mbaza.local/generate', {
      text
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'arraybuffer'
    });

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const buffer = await audioContext.decodeAudioData(audioRes);
    const audioSource = audioContext.createBufferSource();
    audioSource.buffer = buffer;
    audioSource.connect(audioContext.destination);

    // Play the audio and return a promise that resolves when it's done
    return new Promise((resolve) => {
      audioSource.start();
      audioSource.onended = () => resolve(); // Resolves the promise when the audio ends
    });
  } catch (error) {
    console.error("Error playing audio:", error);
  }
};


const createDiv = () => {
  let div = document.createElement("div");
  return div;
};

//this function will receive the response object
// it should create the response div and its children included and return it
const createDomResponseTree = (res) => {
  let chatTextResponse = document.createElement("div");
  chatTextResponse.setAttribute("class", "chatTextResponse");
  const questionsContent = document.createElement("p");
  questionsContent.setAttribute("class", "questionsContent");
  questionsContent.innerHTML = res;
  chatTextResponse.appendChild(questionsContent);

  bakameContent.appendChild(chatTextResponse);

  bakameContent.scrollTo({
    top: bakameContent.scrollHeight,
    behavior: "smooth",
  });

  return chatTextResponse;
};

if (mbazaChatbot.config.welcomeMessage) {
  initialContent.innerHTML = mbazaChatbot.config.welcomeMessage;
}

if(mbazaChatbot.config.useAudio) {
  document.getElementById("formSections").style = "display: block";
}

// this function recieves a ["Kiny","Eng"]
const setLanguagesFromConfigs = (lang) => {
  let options = "";
  lang.forEach((item, idx) => {
    options += `<option value="${item}">${item.toUpperCase()}</option>`;
  });
  bakameLang.innerHTML = options;
  bakameLang.selectedIndex = 0;
};

const readConfigs = () => {
  let chatbots = mbazaChatbot.config.chatbots;
  chatbots.map((chatbot, idx) => {
    let lang = chatbot.languages.map((l) => l.lang);
    console.log("converted...", lang);
    let option = document.createElement("option");
    option.setAttribute("value", chatbot.name);
    option.setAttribute("languages", lang);
    option.innerHTML = chatbot.name;
    bakameApiSelect.appendChild(option);
    if (idx == 0) {
      bakameApiSelect.selectedIndex = 0;
      option.setAttribute("selected", true);
      setLanguagesFromConfigs(lang);
    }
  });
  console.log(chatbots);
};

// read configs
readConfigs();
changeFlag();
changePlaceholder();

// todo:
// - ⚡️ change the header of the select boxes (rounded, borders/outlines)
// - ⚡️ test the api
// - integrate the api
// - minimize
// - maximize
// - ⚡️ remove the record button
// - config files
// - cancel/reset the interactions
// - thiming (defining compatible colors,)
// - ⚡️ fix the sizing issues
// - customize the intro title
// - have the link for "mbaza"
