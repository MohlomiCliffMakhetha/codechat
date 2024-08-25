
const textMessageInput = document.getElementById('text-message');
const textMessageQuillInput = document.getElementById('ql_text-message');
const bubble = document.querySelector('.bubble');
const zero_md = document.getElementById("md-edit");
const app = document.getElementById('md-edit');
const unichat = document.getElementById('unichat');
const sendButton = document.querySelector('.button_send');
const emojiButton = document.querySelector('.button_emoji');
const emojiPicker = document.querySelector('emoji-picker');
const backgroundElement = document.querySelector('.primary_element_main')
var isMine = true;
var emojiPickerActive = false;

const imageUrls = [
  'https://i.pinimg.com/originals/a9/48/f3/a948f3e93a260422fd5e88c0c05cfdaf.jpg',
  'https://www.nationsonline.org/gallery/Madagascar/Allee-des-Baobabs-Madagascar.jpg',
  'https://images.pling.com/img/00/00/59/97/06/1598212/5712fd1882d91474ff8d2f344e38880eba19e708192b6ca99fc5d4dee0dc2b23dd78.jpg',
  'https://cdn.wallpapersafari.com/3/2/E9GDSA.jpg',
  'https://www.bradtguides.com/wp-content/uploads/2020/04/Mozambique.jpg'
];
preloadImages(imageUrls)
  .then((images) => {
    changeBackgroundImage();
  })
  .catch((error) => {
    console.error(error);
  });

var quill = new Quill('#ql_text-message', {
  modules: {
    toolbar: [
      [{ 'size': [] }], [{ 'font': [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'super' }, { 'script': 'sub' }],
      [{ 'header': '1' }, { 'header': '2' }, 'blockquote', 'code-block'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['direction', { 'align': [] }],
      ['link', 'image', 'video', 'formula'],
      ['clean']
    ]
  },
  placeholder: '✏️',
  theme: 'snow'
});

quill.on('text-change', function (delta, oldDelta, source) {
  if (source === 'user') {
    const katexHtmlSpan = textMessageQuillInput.querySelector('.katex-html[aria-hidden="true"]');
    if (katexHtmlSpan) {
      katexHtmlSpan.parentNode.removeChild(katexHtmlSpan);
    }
  }
});


setInterval(changeBackgroundImage, 300000);

document.addEventListener("DOMContentLoaded", function () {

  textMessageInput.addEventListener('input', () => {
    handletextMessageInputInput();
  });

  textMessageInput.addEventListener('blur', () => {
    handletextMessageInputBlur();
  });

  function handletextMessageInputInput() {
    app.style.display = "flex";
    app.setAttribute('src', 'data:text/markdown,' + encodeURIComponent(smiles(vexflow(textMessageInput.value)).replace(/\n/g, '  \n')));
    const renderer = new marked.Renderer();
    renderer.code = function (code, lang) {
      return lang === 'mermaid'
        ? `<div class="mermaid">${code.replace(/  \n/g, '\n')}</div>`
        : `<pre><code>${code}</code></pre>`;
    };
    app.render({ renderer })
    app.scrollTop = app.scrollHeight;
    emojiPicker.style.display = 'none';
    bubble.style.display = 'block';
  }
});


function handletextMessageInputBlur() {
  bubble.style.display = "none"
}

function mermaidRender(app) {
  const renderer = new marked.Renderer();
  renderer.code = function (code, lang) {
    return lang === 'mermaid'
      ? `<div class="mermaid">${code.replace(/  \n/g, '\n')}</div>`
      : `<pre><code>${code}</code></pre>`;
  };
  app.render({ renderer })
}


function smiles(value) {
  value = value.replace(/  \n/g, '\n');
  const options = {
    htmlTags: true
  };

  const pattern = /```smiles([\s\S]*?)```/g;

  let currentIndex = 0;
  let output = '';

  function replaceCallback(match, p1, offset) {
    const html = window.markdownToHTML(match, options);
    output += value.substring(currentIndex, offset);
    output += html + '\n';
    currentIndex = offset + match.length;
    return match;
  }

  value.replace(pattern, replaceCallback);

  if (currentIndex < value.length) {
    output += value.substring(currentIndex);
  }

  return output;
}

function vexflow(value) {
  value = value.replace(/  \n/g, '\n');

  const pattern = /```vexflow([\s\S]*?)```/g;

  let currentIndex = 0;
  let newOutput = '';
  const output = document.createElement('div');

  function replaceCallback(match, p1, offset) {
    const html = match.replace(/```vexflow/g, '').replace(/```/g, '');
    const VF = vextab.Vex.Flow
    const renderer = new VF.Renderer(output, VF.Renderer.Backends.SVG);
    const artist = new vextab.Artist(10, 10, 750, { scale: 0.8 });
    const tab = new vextab.VexTab(artist);
    tab.parse(html);
    artist.render(renderer);
    newOutput += value.substring(currentIndex, offset);
    newOutput += output.innerHTML + '\n';
    output.innerHTML = '';
    currentIndex = offset + match.length;
    return match;
  }

  value.replace(pattern, replaceCallback);

  if (currentIndex < value.length) {
    newOutput += value.substring(currentIndex);
  }
  return newOutput;
}

document.getElementById('chat__form').addEventListener('submit', function (e) {
  e.preventDefault();
  submitForm() 
});

document.addEventListener('keydown', function (event) {
  if (event.ctrlKey && event.key === 'Enter') {
    submitForm();
  }
});

function submitForm() {
  var message = '';
  var computedStyle = window.getComputedStyle(textMessageQuillInput);
  var magic_displayValue = computedStyle.getPropertyValue('display');
  if (magic_displayValue === 'none') {
    message = textMessageInput.value;
    if (message.length === 0) return 0;
    textMessageInput.value = '';
    zero_md.style.display = "none"
  } else {
    message = textMessageQuillInput.innerHTML;
    var tempContainer = document.createElement("div");
    tempContainer.innerHTML = message;
    var firstDiv = tempContainer.querySelector("div.ql-editor");
    firstDiv.setAttribute("contenteditable", "false");
    firstDiv.style.padding = "0";
    firstDiv.style.margin = "0";
    firstDiv.style.lineHeight = '1';
    message = firstDiv.outerHTML;
    if (message === '<div class="ql-editor ql-blank" data-gramm="false" contenteditable="false" data-placeholder="✏️" style="padding: 0px; margin: 0px; line-height: 1;"><p><br></p></div>') return 0;
    quill.setText('');
  }
  emojiPicker.style.display = 'none'
  toolbar.style.display = 'none';
  const date = new Date().toString().substring(0, 24);
  const code = getURLParameter('code');
  const role = getURLParameter('role');
  const userID = getURLParameter('userID');

  const data = {
    code: code,
    role: role,
    userID: userID,
    msg: message,
    timeStamp: date,
  };

  fetch('https://codechat.co.za/DBinbox.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(responseData => {
      console.log(responseData);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  const unichat = document.getElementById('unichat');
  const newMessage = document.createElement('li');
  //newMessage.className = 'message mine';
  if (isMine) {
    newMessage.className = 'message mine';
  } else {
    newMessage.className = 'message';
  }
  //isMine = !isMine; 
  newMessage.dataset.timestamp = date;
  const randomHexID = [...Array(16)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
  newMessage.innerHTML = `
     <div class="contents">
     <span class="date_mine">${">_ " + userID}</span><hr>
       <zero-md id=${randomHexID} no-shadow manual-render></zero-md>
       <span class="date_mine">${date}</span>
     </div>
   `;
  unichat.appendChild(newMessage);
  const app = document.getElementById(randomHexID);
  app.setAttribute('src', 'data:text/markdown,' + encodeURIComponent(smiles(vexflow(message)).replace(/\n/g, '  \n')));
  const renderer = new marked.Renderer()
  renderer.code = function (code, lang) {
    return lang === 'mermaid'
      ? `<div class="mermaid">${code.replace(/  \n/g, '\n')}</div>`
      : `<pre><code>${code}</code></pre>`
  }
  app.render({ renderer })

  unichat.scrollTop += unichat.scrollHeight;

}

function fetchNewMessages() {
  const code = getURLParameter('code');
  const email = getURLParameter('userID');

  const data = {
    code: code,
    email: email,
  };

  fetch('https://codechat.co.za/DBrequests.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      updateConversation(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  mermaid.init()
}
setInterval(fetchNewMessages,5000);

function updateConversation(data) {
  const unichat = document.getElementById('unichat');
  const userID = getURLParameter('userID');
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return;
    }
  }

  if (!Array.isArray(data)) {
    console.error('Invalid data format:', data);
    return;
  }

  data.forEach(message => {
    const formattedTimestamp = message.timeStamp;
    const existingMessage = unichat.querySelector(`[data-timestamp="${formattedTimestamp}"]`);

    if (!existingMessage) {
      document.title = '🫧 CΘDΣ CHΔT';
      const audio = new Audio('https://codechat.co.za/pop.mp3');
      audio.play();
      const newMessage = document.createElement('li');
      newMessage.className = userID === message.userID ? 'message mine' : 'message';
      newMessage.dataset.timestamp = formattedTimestamp;
      const randomHexID = [...Array(16)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      newMessage.innerHTML = `
        <div class="contents">
          <span class="date_mine">${">_ " + message.userID}</span><hr>
          <zero-md id=${randomHexID} no-shadow manual-render></zero-md>
          <span class="date_mine">${formattedTimestamp}</span>
        </div>
      `;
      unichat.appendChild(newMessage);
      const app = document.getElementById(randomHexID);
      app.setAttribute('src', 'data:text/markdown,' + encodeURIComponent(smiles(vexflow(message.msg)).replace(/\n/g, '  \n')));
      const renderer = new marked.Renderer();
      renderer.code = function (code, lang) {
        return lang === 'mermaid'
          ? `<div class="mermaid">${code.replace(/  \n/g, '\n')}</div>`
          : `<pre><code>${code}</code></pre>`;
      };
      app.render({ renderer })
      unichat.scrollTop = unichat.scrollHeight;
    }
  });
}

function resetTitle() {
  document.title = 'CΘDΣ CHΔT';
}
window.addEventListener('focus', resetTitle);


function getURLParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  const results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

var toolbar = document.querySelector('.ql-toolbar');
function magic() {
  textMessageInput.style.display = 'none';
  textMessageQuillInput.style.display = 'block';
  toolbar.style.display = 'block';
  emojiPicker.style.display = 'none'
}
function toggleToolbar() {
  if (toolbar.style.display === 'none') {
    magic()
  } else {
    textMessageQuillInput.style.display = 'none';
    textMessageInput.style.display = 'block';
    toolbar.style.display = 'none';
  }
}

var btn_magic = document.getElementById('btn_magic');
btn_magic.addEventListener('click', toggleToolbar);

emojiButton.addEventListener('click', () => {
  emojiPicker.style.display = emojiPicker.style.display === 'none' ? 'block' : 'none';
  toolbar.style.display = 'none';
});

emojiPicker.addEventListener('emoji-click', (event) => {
  const emoji = event.detail.unicode;
  textMessageInput.focus()
  const selectionStart = textMessageInput.selectionStart;
  const selectionEnd = textMessageInput.selectionEnd;
  document.execCommand("insertText", false, emoji);
  const newPosition = selectionStart + emoji.length;
  textMessageInput.setSelectionRange(newPosition, newPosition);
  textMessageInput.dispatchEvent(new Event('input'));
  emojiPicker.style.display = 'block';
  bubble.style.display = 'none';
});


sendButton.addEventListener('click', function () {
  sendMessage();
});

document.addEventListener('keydown', function (event) {
  if (event.ctrlKey && event.key === 'Enter') {
    sendMessage();
  }
});

function changeBackgroundImage() {

  const randomIndex = Math.floor(Math.random() * imageUrls.length);
  backgroundElement.style.backgroundImage = `url(${imageUrls[randomIndex]})`;
}

function preloadImages(imageUrls) {
  const images = {};
  const promises = [];

  imageUrls.forEach((imageUrl, index) => {
    const imagePromise = new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imageUrl;

      img.onload = () => {
        images[index] = img;
        resolve();
      };

      img.onerror = () => {
        reject(new Error(`Failed to load image: ${imageUrl}`));
      };
    });

    promises.push(imagePromise);
  });

  return Promise.all(promises).then(() => images);
}

