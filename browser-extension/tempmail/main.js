document.addEventListener('DOMContentLoaded', function () {
  const emailAddressElement = document.getElementById('email-address');
  const newAddressButton = document.getElementById('new-address');
  const checkMailButton = document.getElementById('check-mail');
  const mailboxElement = document.getElementById('mailbox');
  const mailContentElement = document.getElementById('mail-content');
  const toggleJsButton = document.getElementById('toggle-js');
  const fakeFaceImage = document.getElementById('fake-face');
  const genFakeFaceButton = document.getElementById('gen-fake-face');
  const saveFakeFaceButton = document.getElementById('save-fake-face');

  fakeFaceImage.style.width = '300px'; // 고정된 가로 크기
  fakeFaceImage.style.height = 'auto'; // 비율 유지
  fakeFaceImage.style.border = '1px solid #ccc'; // 선택 사항: 테두리 추가
  let token = null;
  let accountId = null;

  // Utility: Fetch API Wrapper
  async function apiRequest(url, method = 'GET', headers = {}, body = null) {
    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`API Request Failed: ${error.message}`);
    }
  }

  // Local Storage Handling
  function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  function loadFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
  }

  function clearLocalStorage(key) {
    localStorage.removeItem(key);
  }

  // Convert Blob to Base64
  async function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Load Fake Face Image from Local Storage
  function loadFakeFace() {
    const savedImage = loadFromLocalStorage('fakeFaceImage');
    if (savedImage) {
      fakeFaceImage.src = savedImage; // Set the Base64 image as the source
    }
  }

  // Email Account Management
  async function fetchDomains() {
    const data = await apiRequest('https://api.mail.tm/domains');
    return data?.['hydra:member'][0]?.domain || null;
  }

  async function createAccount() {
    clearLocalStorage('tempMailAccount');
    mailboxElement.innerHTML = '';
    mailContentElement.innerHTML = '';

    const domain = await fetchDomains();
    if (!domain) return;

    const email = `user${Math.floor(Math.random() * 10000)}@${domain}`;
    const password = 'password123';

    const accountData = await apiRequest('https://api.mail.tm/accounts', 'POST', { 'Content-Type': 'application/json' }, { address: email, password });
    if (accountData) {
      token = await getToken(email, password);
      accountId = accountData.id;
      emailAddressElement.value = email;
      saveToLocalStorage('tempMailAccount', { email, token, accountId });
      fetchEmails();
    }
  }

  async function getToken(email, password) {
    const data = await apiRequest('https://api.mail.tm/token', 'POST', { 'Content-Type': 'application/json' }, { address: email, password });
    return data?.token || null;
  }

  async function loadSavedAccount() {
    const savedAccount = loadFromLocalStorage('tempMailAccount');
    if (savedAccount) {
      token = savedAccount.token;
      accountId = savedAccount.accountId;
      emailAddressElement.value = savedAccount.email;
      fetchEmails();
    } else {
      createAccount();
    }

    // Load saved fake face image
    loadFakeFace();
  }

  // Email Handling
  async function fetchEmails() {
    if (!token || !accountId) return;

    const data = await apiRequest(`https://api.mail.tm/messages`, 'GET', { Authorization: `Bearer ${token}` });
    if (data) {
      mailboxElement.innerHTML = '';
      data['hydra:member'].forEach((email) => renderEmailItem(email));
    }
  }

  async function fetchEmailContent(emailId) {
    if (!token || !accountId) return;

    const emailData = await apiRequest(`https://api.mail.tm/messages/${emailId}`, 'GET', { Authorization: `Bearer ${token}` });
    if (emailData) {
      mailContentElement.innerHTML =
        `<h3>Subject: ${emailData.subject}</h3>` +
        `<p>From: ${emailData.from.address}</p>` +
        `<p>${emailData.text}</p>`;
    }
  }

  function renderEmailItem(email) {
    const emailDiv = document.createElement('div');
    emailDiv.textContent = `From: ${email.from.address}, Subject: ${email.subject}`;
    emailDiv.dataset.id = email.id;
    emailDiv.classList.add('email-item');
    mailboxElement.appendChild(emailDiv);

    // Add click event to view email content
    emailDiv.addEventListener('click', () => fetchEmailContent(email.id));
  }

  async function generateFakeFace() {
    try {
      const response = await fetch('https://thispersondoesnotexist.com');
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      const blob = await response.blob(); // Blob 데이터 가져오기

      // Blob 데이터를 Base64로 변환하여 이미지 표시
      const base64Image = await blobToBase64(blob);
      fakeFaceImage.src = base64Image;

      // Blob 데이터를 로컬 스토리지에 저장
      saveToLocalStorage('fakeFaceImage', base64Image);
      // Blob 데이터를 다운로드를 위해 저장
      fakeFaceImage.dataset.downloadUrl = base64Image

    } catch (error) {
      console.error('Failed to generate fake face:', error);
    }
  }

  function saveFakeFace() {
    const downloadUrl = fakeFaceImage.dataset.downloadUrl;
    if (!downloadUrl) {
      alert('먼저 "Generate Fake Face" 버튼을 눌러 이미지를 생성하세요!');
      return;
    }}

    // Load saved fake face from local storage
    function loadSavedFakeFace() {
      const savedImage = loadFromLocalStorage('fakeFaceImage');
      if (savedImage) {
        fakeFaceImage.src = savedImage; // 저장된 Base64 이미지를 설정
      }
    }



    // Event Listeners
    newAddressButton.addEventListener('click', createAccount);

    checkMailButton.addEventListener('click', fetchEmails);

    genFakeFaceButton.addEventListener('click', generateFakeFace);
    saveFakeFaceButton.addEventListener('click',saveFakeFace);

    // Initialize Extension
    loadSavedAccount();
    loadSavedFakeFace();
  });
