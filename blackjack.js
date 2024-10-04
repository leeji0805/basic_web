while(true){
    /*
1. 플레이어와 딜러의 카드 합계가 21을 넘으면 Bust (패배).
2. 플레이어가 21점을 달성하면 블랙잭 (즉시 승리).
3. 딜러는 17점 이상일 때 멈춰야 하고, 그 이하일 때는 추가 카드를 뽑아야 함.
4. 카드 합계가 같은 경우 무승부 (Draw).
5. 21점을 초과한 쪽이 무조건 패배.*/

// 플레이어와 은행의 카드 배열 초기화
let playerCards = [];
let bankCards = [];

// 플레이어와 은행이 한 장씩 뽑는 카드
let playerCard1 = 10;
let bankCard1 = 7;
let playerCard2 = 11;
let bankCard2 = 5;

//처음 두 장의 카드
playerCards.push(playerCard1);
bankCards.push(bankCard1);

// 두 번째 카드 추가
playerCards.push(playerCard2);
bankCards.push(bankCard2);

// 현재 카드 합산
let playerSum = playerCard1 + playerCard2;
let bankSum = bankCard1 + bankCard2;

// 카드 배열 출력
console.log("Player's cards: ", playerCards);
console.log("Bank's cards: ", bankCards);

// 플레이어 카드 합계 확인
if (playerSum === 21) {
    console.log("Blackjack! You win!");
    break;
} else if (playerSum > 21) {
    console.log("BUST");
    break;
    
} else {
    console.log(`Player has ${playerSum} points`);
    console.log(`Bank has ${bankSum} points`);
}

// 은행이 17 미만이면 추가 카드 뽑기
if (bankSum < 17) {
    let bankCard3 = 7; // 세 번째 카드 (랜덤한 값으로 대체 가능)
    let playerCard3 = 7;
    playerCards.push(playerCard3);
    bankCards.push(bankCard3);
    playerSum += playerCard3;
    bankSum += bankCard3;
}

// 은행 카드 배열 출력
console.log("Updated Player's cards: ", playerCards);
console.log("Updated Bank's cards: ", bankCards);
console.log(`Player's sum is: ${playerSum}`);
console.log(`Bank's sum is: ${bankSum}`);

// 승리 조건 확인
if (bankSum > 21 || (playerSum <= 21 && playerSum > bankSum)) {
    console.log("Player wins!");
    break;
} else if (playerSum > 21) {
    console.log("BUST");
    break;
}
else if (playerSum === bankSum) {
    console.log("Draw");
    break;
} else {
    console.log('Bank wins');
    break;
}

}