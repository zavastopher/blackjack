import house from './house.js';

let totalBet = 0;
document.getElementById('balance').innerText = await house.getBalance();

const values = ['','A','2','3','4','5','6','7','8','9','10','J','Q','K'];
const suits = ['\u2660','\u2663','\u2666','\u2665'];

var seats = [0,0,0,0,0];
var lastBet = [0,0,0,0,0];

var bets = [1, 5, 10, 20, 50, 100, 1000];
var bet = 2;
updateBet();

var cards;
var dealerCard;
var shownCard;

document.getElementById('home').addEventListener('click', function() {
    window.location.href = '/';
});

resetTable();



function card(suit, value) {
    this.suit = suit;
    this.value = value;
}
function makeCard(c) {
    const card = document.createElement("card-body");
    const upper = document.createElement("card-upper");
    const lower = document.createElement("card-lower");
    var suit = suits[c.suit];
    var value = getValue(c);
    upper.innerText = value + '\n' + suit;
    lower.innerText = value + '\n' + suit;
    card.append(upper);
    card.append(lower);

    var face;
    if (c.value == 1) {
        face = document.createElement("ace");
        face.innerText = suit;
    } else if (c.value > 10) {
        face = document.createElement("face-card");
        face.innerText = value;
    } else {
        face = document.createElement("number");
        var number = '';
        for (var i = 0; i < value; i++) {
            number += suit;
        }
        face.innerText = number;
    }
    card.append(face)

    return card;
}
function evaluateCard(c) {
    if (c.querySelector('ace')) {
        return 1;
    } else if (c.querySelector('face-card')) {
        return 10;
    } else {
        return c.querySelector('card-upper').innerText.slice(0,-1);
    }
}
function emtpyCard() {
    const card = document.createElement("card-body");
    return card;
}

function getScore(cs) {
    var score = 0;
    var aces = 0;
    cs.querySelectorAll('card-body').forEach((c) => {
        var val = eval(evaluateCard(c));
        if (val == 1) {
            aces++;
            score += 11;
        } else {
            score += val;
        }
        while (score > 21 && aces != 0) {
            score -= 10;
            aces--;
        }
    });
    return score;
}
function getValue(c) {
    return values[c.value];
}

function getNextCards() {

    if (!cards) {
        cards = document.querySelector('#player-table > .seat > .hand > .cards');
    } else {
        var seat = cards.parentElement.parentElement;

        if (cards.parentElement.nextElementSibling) {
            cards = cards.parentElement.nextElementSibling.querySelector('.cards');
        } else {
            while (seat.nextElementSibling) {
                if (seat.nextElementSibling.querySelector('.hand > .cards')) {
                    cards = seat.nextElementSibling.querySelector('.hand > .cards');
                    break;
                } else {
                    seat = seat.nextElementSibling;
                }
            }
            if (!seat.nextElementSibling) {
                return -1;
            }
        }
    }
    let score = getScore(cards);
    if (score === 21 && cards.querySelectorAll('card-body').length === 2) {
        let temp = cards;
        stand();
        temp.setAttribute("style", "background-color:yellow;");
    } else {
        document.getElementById('current-score').innerText = getScore(cards);
        cards.setAttribute("style", "background-color:blue;");
    }
}
function dealerPlay() {
    let dealerCards = document.querySelector('#dealer-table > .hand > .cards');
    const blank = document.querySelectorAll('#dealer-table > .hand > .cards > card-body')[0];
    const real = document.querySelectorAll('#dealer-table > .hand > .cards > card-body')[1];
    dealerCards.removeChild(blank);
    dealerCards.removeChild(real);
    addCard(dealerCard, dealerCards);
    addCard(real, dealerCards);

    dealerCards = document.querySelector('#dealer-table > .hand > .cards');
    const score = document.getElementById('dealer-score');
    score.innerText = getScore(dealerCards);
    dealerCards.parentElement.insertBefore(score, dealerCards.parentElement.childNodes[0]);

    cards = dealerCards;

    while(getScore(dealerCards) < 17) {
        hit();
    }

    endGame(getScore(dealerCards));
}
async function endGame(dealerScore) {

    document.getElementById('main-controls').setAttribute("style", "display:none");

    let winnings = 0;
    cards = document.querySelector('#player-table > .seat > .hand > .cards');
    cards.setAttribute("style", "background-color:blue;");
    do {
        let playerScore = getScore(cards);
        let playerBet = eval(cards.parentElement.querySelector('button').innerText);
        if (playerScore > 21) {
            cards.setAttribute("style", "background-color:red;");
        } else if (playerScore < dealerScore && dealerScore <= 21) {
            cards.setAttribute("style", "background-color:red;");
        } else if (playerScore === dealerScore) {
            cards.setAttribute("style", "background-color:orange;");
            winnings += playerBet;
        } else if (playerScore === 21 && cards.querySelectorAll('card-body').length === 2) {
            cards.setAttribute("style", "background-color:yellow;");
            winnings += playerBet * 2.5;
        } else {
            cards.setAttribute("style", "background-color:green;");
            winnings += playerBet * 2;
        }
    } while (getNextCards() !== -1);

    const winningBanner = document.createElement("div");
    winningBanner.classList.add("center-banner");
    let profit = winnings - totalBet;
    winningBanner.innerText = winnings - totalBet;

    if (profit > 0) {
        winningBanner.classList.add("green");
    } else if (profit < 0) {
        winningBanner.classList.add("red");
    } else {
        winningBanner.classList.add("orange");
        winningBanner.innerText = "Push";
    }

    document.getElementById('bet-label').innerText = "total won";
    document.getElementById('total-bet').innerText = winnings;

    
    document.getElementById('player-table').appendChild(winningBanner);

    setTimeout(()=> resetTable(), 3000);

    document.getElementById('balance').innerText = await house.updateBalance(winnings);

    console.log("current count: " + house.getCount());
}
function addCard(card, hand) {
    hand.append(card);
    setTimeout(()=> card.classList.add("animate"), 1);
}




document.querySelector('#main-controls > #hit').addEventListener("click", () => {

    if (house.evaluate(shownCard, cards, "hit")) {
        let indicator = cards.parentElement.querySelector('.indicator');
        indicator.innerText = "✓";
        indicator.classList.add("g");
        indicator.classList.remove("r");
    } else {
        let indicator = cards.parentElement.querySelector('.indicator');
        indicator.innerText = "⨯";
        indicator.classList.add("r");
        indicator.classList.remove("g");
    }

    hit();
});
function hit(doubleFlag) {
    const c = makeCard(house.deal());
    addCard(c, cards);

    let score = getScore(cards);
    if (score > 21) {
        cards.parentElement.querySelector('.score').innerText = 'x';
        stand();
    } else if (doubleFlag) {
        cards.parentElement.querySelector('.score').innerText = score;
        document.getElementById('current-score').innerText = getScore(cards);
        stand();
    } else {
        cards.parentElement.querySelector('.score').innerText = score;
        document.getElementById('current-score').innerText = getScore(cards);
        if (score === 21) {
            stand();
        }
    }
}

document.querySelector('#main-controls > #stand').addEventListener("click", () => {

    if (house.evaluate(shownCard, cards, "stand")) {
        let indicator = cards.parentElement.querySelector('.indicator');
        indicator.innerText = "✓";
        indicator.classList.add("g");
        indicator.classList.remove("r");
    } else {
        let indicator = cards.parentElement.querySelector('.indicator');
        indicator.innerText = "⨯";
        indicator.classList.add("r");
        indicator.classList.remove("g");
    }

    stand();
});
function stand() {

    cards.setAttribute("style", "background-color:white;");
    if (getNextCards() === -1) {
        dealerPlay();
    }
}

document.querySelector('#main-controls > #double').addEventListener("click", () => {
    double();
});
async function double() {
    if (cards.querySelectorAll('card-body').length != 2) {
        return;
    }

    let increase = eval(cards.parentElement.querySelector('button').innerText);

    if (increase > await house.getBalance()) {
        window.alert("Insufficient Balance");
        return;
    }

    if (house.evaluate(shownCard, cards, "double")) {
        let indicator = cards.parentElement.querySelector('.indicator');
        indicator.innerText = "✓";
        indicator.classList.add("g");
    } else {
        let indicator = cards.parentElement.querySelector('.indicator');
        indicator.innerText = "⨯";
        indicator.classList.add("r");
    }

    totalBet += increase;
    document.getElementById('balance').innerText = await house.updateBalance(-1 * increase);

    document.getElementById('total-bet').innerText = totalBet;

    cards.parentElement.querySelector('button').innerText = increase * 2;
    colorValue(cards.parentElement.querySelector('button'));
    hit(true);
}

document.querySelector('#main-controls > #split').addEventListener("click", () => {
    split();
});
async function split() {
    if (cards.querySelectorAll('card-body').length != 2 || evaluateCard(cards.querySelectorAll('card-body')[1]) !== evaluateCard(cards.querySelectorAll('card-body')[0])) {
        return;
    }

    let increase = eval(cards.parentElement.querySelector('button').innerText);

    if (increase > await house.getBalance()) {
        window.alert("Insufficient Balance");
        return;
    }

    if (house.evaluate(shownCard, cards, "split")) {
        let indicator = cards.parentElement.querySelector('.indicator');
        indicator.innerText = "✓";
        indicator.classList.add("g");
        indicator.classList.remove("r");
    } else {
        let indicator = cards.parentElement.querySelector('.indicator');
        indicator.innerText = "⨯";
        indicator.classList.add("r");
        indicator.classList.remove("g");
    }

    const card = cards.querySelectorAll('card-body')[1];
    cards.removeChild(card);
    cards.parentElement.querySelector('.score').innerText = getScore(cards);

    var seat = cards.parentElement.parentElement;
    const hand = document.createElement("div");
    hand.setAttribute("class", "hand");
    const chip = document.createElement("button");
    chip.setAttribute("class", "chip");
    chip.innerText = increase;

    totalBet += increase;
    document.getElementById('balance').innerText = await house.updateBalance(-1 * increase);

    document.getElementById('total-bet').innerText = totalBet;


    colorValue(chip);
    chip.disabled = true;
    const newCards = document.createElement("div");
    newCards.setAttribute("class", "cards");

    hit();
    addCard(card, newCards);
    addCard(makeCard(house.deal()), newCards);

    

    hand.append(newCards);
    hand.append(chip);
    const score = document.createElement("div");
    score.setAttribute("class", "score");
    score.innerText = getScore(newCards);
    hand.insertBefore(score, hand.childNodes[0]);

    const indicator = document.createElement("div");
    indicator.classList.add('indicator');
    const temp = cards.parentElement.querySelector('.indicator');
    if (temp.innerText === "⨯") {
        indicator.innerText = "⨯";
        indicator.classList.add("r");
        indicator.classList.remove("g");
    } else {
        indicator.innerText = "✓";
        indicator.classList.add("g");
        indicator.classList.remove("r");
    }
    hand.appendChild(indicator);

    seat.append(hand);
}









document.getElementById('decrease').addEventListener("click", () => {
    if (bet !== 0) {
        bet--;
        updateBet();
        colorValue(document.getElementById('current-bet'));
    } else {
        return;
    }
});
document.getElementById('increase').addEventListener("click", () => {
    if (bet !== 6) {
        bet++;
        updateBet();
        colorValue(document.getElementById('current-bet'));
    } else {
        return;
    }
});

document.getElementById("deal").addEventListener("click", () => {
    dealTable();
});

function dealTable() {

    document.getElementById('bet-controls').setAttribute("style", "display:none");
    document.getElementById('main-controls').setAttribute("style", "display:flex");
    document.getElementById('deal').setAttribute("style", "display:none");

    document.body.removeChild(document.getElementById('betCount'));

    let flag = true;
    seats.forEach((i) => {
        if (i > 0) {
            flag = false;
        }
    });
    if (flag) {
        resetTable();
        return;
    }
    const table = document.getElementById("player-table");
    var i = 0;
    document.querySelectorAll('#player-table > .seat > .hand').forEach((hand) => {
        if (seats[i] != 0) {
            const cs = document.createElement("div");
            cs.setAttribute("class", "cards");                    
            hand.insertBefore(cs, hand.childNodes[0]);

            const indicator = document.createElement("div");
            indicator.classList.add('indicator');
            hand.appendChild(indicator);
        } else {
            hand.parentElement.removeChild(hand);
        }
        i++;
    });

    for (var n = 0; n < 2; n++) {

        

        document.querySelectorAll('#player-table > .seat > .hand > .cards').forEach((cards) => {
            const c = makeCard(house.deal());
            addCard(c, cards);
        });
        if (n === 0) {
            dealerCard = makeCard(house.deal());
            addCard(emtpyCard(), document.querySelector('#dealer-table > .hand > .cards'));
        } else {
            shownCard = makeCard(house.deal());
            addCard(shownCard, document.querySelector('#dealer-table > .hand > .cards'));
            var shownScore = evaluateCard(shownCard);
            document.getElementById('dealer-score').innerText = shownScore;
            if (shownScore === 1) {
                // OPEN INSURANCE (?)
                shownScore = 11;
                document.getElementById('dealer-score').innerText = shownScore;
                if (evaluateCard(dealerCard) === 10) {
                    document.getElementById('dealer-score').innerText = 21;
                    dealerPlay();
                }
            } else if (shownScore === 10) {
                if (evaluateCard(dealerCard) === 1) {
                    document.getElementById('dealer-score').innerText = 21;
                    dealerPlay();
                }
            }
        }
        
    }

    document.querySelectorAll('.table > .seat > .hand > button').forEach((button) => {
        button.disabled = true;
    });

    seats = [0,0,0,0,0];

    document.querySelectorAll('#player-table > .seat > .hand > .cards').forEach((cs) => {
        const score = document.createElement("div");
        score.setAttribute("class", "score");
        score.innerText = getScore(cs);
        if (getScore(cs) === 21) {
            cs.setAttribute("style", "background-color:yellow;");
        }
        cs.parentElement.insertBefore(score, cs.parentElement.childNodes[0]);
    });

    getNextCards();
}

function updateBet() {
    document.getElementById('current-bet').innerText = bets[bet];
}
function colorValue(button) {
    if (button.innerText === 0) {
        button.setAttribute("style", "background-color:lightgray");
    } else if (button.innerText < 5) {
        button.setAttribute("style", "background-color:rgb(233, 233, 233)");
    } else if (button.innerText < 50) {
        button.setAttribute("style", "background-color:red");
    } else if (button.innerText < 100) {
        button.setAttribute("style", "background-color:green");
    } else if (button.innerText < 250) {
        button.setAttribute("style", "background-color:black");
    } else if (button.innerText < 500) {
        button.setAttribute("style", "background-color:blue");
    } else if (button.innerText < 1000) {
        button.setAttribute("style", "background-color:purple");
    } else {
        button.setAttribute("style", "background-color:maroon");
    }
}

function resetTable() {
    document.getElementById('bet-controls').setAttribute("style", "display:flex");
    document.getElementById('main-controls').setAttribute("style", "display:none");
    document.getElementById('deal').setAttribute("style", "display:block");

    colorValue(document.getElementById('current-bet'));

    document.getElementById('bet-label').innerText = "total bet";

    lastBet = [0,0,0,0,0];
    totalBet = 0;
    document.getElementById('total-bet').innerText = totalBet;

    var numSeats;

    var width = document.querySelector('body').offsetWidth;
    if (width < 600) {
        numSeats = 1;
    } else if (width >= 600 && width < 1500) {
        numSeats = 3;
    } else {
        numSeats = 5;
    }

    cards = null;
    dealerCard = null;
    seats = [0,0,0,0,0];
    document.querySelector('#dealer-table > .hand > .cards').innerHTML = '';
    document.querySelector('#dealer-table > .hand > .score').innerText = '';
    const table = document.getElementById('player-table');
    table.innerHTML = '';
    for (var i = 0; i < numSeats; i++) {
        const seat = document.createElement("div");
        seat.setAttribute("class", "seat");

        const hand = document.createElement("div");
        hand.setAttribute("class", "hand");

        const chip = document.createElement("button");
        chip.setAttribute("class", "chip");
        chip.setAttribute("id", i);
        chip.innerText = 0;

        hand.append(chip);
        seat.append(hand);
        table.append(seat);
    }
    document.querySelectorAll('#player-table > .seat > .hand > button').forEach((button) => {
        let index = button.id;
        button.addEventListener("click", async () => {

            if (bets[bet] > await house.getBalance()) {
                window.alert("Insufficient Balance");
                return;
            }
            
            seats[index] += bets[bet];

            document.getElementById('balance').innerText = await house.updateBalance(-1 * bets[bet]);
            totalBet += bets[bet];
        
            document.getElementById('total-bet').innerText = totalBet;

            let curr = eval(button.innerText);
            button.innerText = curr + bets[bet];
            colorValue(button);
        });
    });

    const betCount = document.createElement("div");
    betCount.classList.add("center-banner");
    betCount.setAttribute("id","betCount");
    betCount.innerText = "Place Bets";
    document.body.append(betCount);
}