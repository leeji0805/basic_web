    /*
    1. 플레이어와 딜러의 카드 합계가 21을 넘으면 Bust (패배).
    2. 플레이어가 21점을 달성하면 블랙잭 (즉시 승리).
    3. 딜러는 17점 이상일 때 멈춰야 하고, 그 이하일 때는 추가 카드를 뽑아야 함.
    4. 카드 합계가 같은 경우 무승부 (Draw).
    5. 21점을 초과한 쪽이 무조건 패배.*/

    let cardOne = Math.floor(Math.random() * 11) + 1;
    let cardTwo = Math.floor(Math.random() * 11) + 1;
    let cardThree = Math.floor(Math.random() * 11) + 1;
    let cardFour = Math.floor(Math.random() * 11) + 1;

    let sum = cardOne + cardTwo;
    sum += cardThree;
    if (sum === 21) {
        console.log("Blackjack! You win!");
    } else if (sum > 21) {
        console.log("BUST");
    } else {
        console.log(`You have ${sum} points`);
        
    }

    let cardOneBank = Math.floor(Math.random() * 11) + 1;
    let cardTwoBank = Math.floor(Math.random() * 11) + 1;
    let cardThreeBank = Math.floor(Math.random() * 11) + 1;
    let cardFourBank = Math.floor(Math.random() * 11) + 1;

    let bankSum = cardOneBank + cardTwoBank + cardThreeBank + cardFourBank;

    if (bankSum > 21 || sum <= 21 && sum > bankSum) {
        console.log("You win!");
    } else if (sum === bankSum) {
        console.log("Draw");
    } else {
        console.log('Bank wins');
        console.log(`Bank have ${bankSum} points`);
    }
