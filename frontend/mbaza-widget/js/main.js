class MbazaChatbot {
  // HOST = "https://mbaza-chatbot.netlify.app";
  HOST = "";
  iconColor = "#F59221";

  constructor(config) {
    this.config = config;
  }

  async init() {
    await this.loadScript(
      "https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.2/axios.min.js"
    );

    this.container = document.createElement("div");
    this.container.id = "mbaza-chatbot-container";
    document.body.appendChild(this.container);

    await this.loadHtml();
    this.loadScriptInBody(`${this.HOST}/js/chatbot.js`);
  }
  async loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  loadScriptInBody(src) {
    const script = document.createElement("script");
    script.src = src;
    document.body.appendChild(script);
  }

  async loadHtml() {
    let theme = "default";

    if (this.config.theme === "dark") {
      // this.iconColor = "#fff";
    } else if (this.config.theme === "blue") {
      this.iconColor = "#673DE6";
    }

    if (["dark", "blue"].includes(this.config.theme)) {
      theme = `${this.config.theme}-theme`;
    }

    const cssResponse = await fetch(`${this.HOST}/styles/${theme}.css`);
    const cssText = await cssResponse.text();
    const cssStyles = cssText;

    const styleElement = document.createElement("style");
    styleElement.appendChild(document.createTextNode(cssStyles));
    document.head.appendChild(styleElement);

    const templateResponse = await fetch(
      `${this.HOST}/templates/chatbot-template.html`
    );
    const templateHtml = await templateResponse.text();

    const replaceTitle = this.replaceAll(
      templateHtml,
      "{{title}}",
      this.config.title || "Mbaza Chatbot"
    );
    const replaceIconColor = this.replaceAll(
      replaceTitle,
      "{{mobileFillIconColor}}",
      this.iconColor
    );

    const replaceHost = this.replaceAll(
      replaceIconColor,
      "{{host}}",
      this.HOST
    );
    this.container.innerHTML = replaceHost;
  }

  replaceAll(str, search, replacement) {
    return str.split(search).join(replacement);
  }
}
