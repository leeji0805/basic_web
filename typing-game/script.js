

const quotes = [
    'When you have eliminated the impossible, whatever remains, however improbable, must be the truth.',
    'There is nothing more deceptive than an obvious fact.',
    'I ought to know by this time that when a fact appears to be opposed to a long train of deductions it invariably proves to be capable of bearing some other interpretation.',
    'I never make exceptions. An exception disproves the rule.',
    'What one man can invent another can discover.',
    'Nothing clears up a case so much as stating it to another person.',
    'Education never ends, Watson. It is a series of lessons, with the greatest for the last.',
];
let words = [];
let wordIndex = 0;
let startTime = Date.now();

const quoteElement = document.getElementById('quote');
const messageElement = document.getElementById('message');
const typedValueElement = document.getElementById('typed-value');
const modal = document.querySelector(".modal")
const modalMessage = document.getElementById('modal-message');
const closeButton = document.getElementById('modal-close'); 

typedValueElement.addEventListener('input', () => {
    const currentWord = words[wordIndex];
    const typedValue = typedValueElement.value;

    if (typedValue === currentWord && wordIndex === words.length - 1) {
        const elapsedTime = new Date().getTime() - startTime;
        typedValueElement.disabled = true;
        document.getElementById('modal-close').disabled = false;
        modal.style.display = 'block';
        modalMessage.innerText = `CONGRATULATIONS! You finished in ${elapsedTime / 1000} seconds.`;
        document.getElementById('start').disabled = false;
        
        // Save highest score using localStorage
        const highestScore = localStorage.getItem('highestScore');
        if (!highestScore || elapsedTime < highestScore) {
            localStorage.setItem('highestScore', elapsedTime);
        }
        
    } else if (typedValue.endsWith(' ') && typedValue.trim() === currentWord) { //
        typedValueElement.value = '';

        wordIndex++;
        typedValueElement.value = words[wordIndex]
        for (const wordElement of quoteElement.childNodes) {
            wordElement.className = '';
        }

        quoteElement.childNodes[wordIndex].className = 'highlight';
    } else if (currentWord.startsWith(typedValue)) {
        typedValueElement.className = '';
    } else {
        typedValueElement.className = 'error';
    }
});

document.getElementById('modal-close').addEventListener('click', () => {
    modal.style.display = 'none';
    document.getElementById('start').disabled = false;
});

document.getElementById('start').addEventListener('click', () => {
    
    typedValueElement.disabled = false; // 입력 필드 활성화
    const quoteIndex = Math.floor(Math.random() * quotes.length); // 무작위 인덱스 생성
    const quote = quotes[quoteIndex]; // 무작위 인덱스 값으로 인용문 선택
    words = quote.split(' '); // 공백 문자를 기준으로 words 배열에 저장
    wordIndex = 0; // 초기화
    const spanWords = words.map(function (word) { return `<span>${word} </span>` });
    // span 태그로 감싼 후 배열에 저장
    quoteElement.innerHTML = spanWords.join(''); // 하나의 문자열로 결합 및 설정
    quoteElement.childNodes[0].className = 'highlight'; // 첫번째 단어 강조
    modalMessage.innerText = ''; // 메시지 요소 초기화
    typedValueElement.value = ''; //입력 필드 초기화
    typedValueElement.focus(); // 포커스 설정
    startTime = new Date().getTime(); // 타이핑 시작 시간 기록 
    document.getElementById('start').disabled = true; // 시작 버튼 비활성화
    removeEventListener('click', () => { });
});


