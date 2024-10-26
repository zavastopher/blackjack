import api  from "./APIClient.js";
let user = null
try {
    user = await api.getCurrentUser();
} catch (e) {
    console.log("User is not logged in");
    document.location = "/";
}
const numDecks = 8;
const values = ['','A','2','3','4','5','6','7','8','9','10','J','Q','K'];
const suits = ['\u2660','\u2663','\u2666','\u2665'];
var deck;
var count;

createDeck();
shuffleDeck(deck);

function card(suit, value) {
    this.suit = suit;
    this.value = value;
}

function deal() {
    var card = deck.pop();

    let val = getValue(card);
    if (val < 7) {
        count++;
    } else if (val > 9) {
        count--;
    }

    if (deck.length < 30) {
        deck = [];
        createDeck();
        shuffleDeck(deck);
    }

    return card;
}
function createDeck() {
    deck = [];
    count = 0;
    var pos = 0;
    for (var n = 0; n < numDecks; n++) {
        for (var i = 1; i < 14; i++) {
            for (var j = 0; j < 4; j++) {
                const c = new card(j, i);
                deck.push(c);
            }
        }
    }
}
function shuffleDeck(deck) {
    let currentIndex = deck.length,  randomIndex;
    while (currentIndex > 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [deck[currentIndex], deck[randomIndex]] = [
        deck[randomIndex], deck[currentIndex]];
    }
    return deck;
}
function getValue(c) {
    var value;
    if (c.value == 1) {
        value = 11;
    } else if (c.value > 10) {
        value = 10;
    } else {
        value = c.value;
    }
    return value;
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

function getCount() {
    return count;
}

async function getBalance() {
    // SEND API REQUEST AND RETURN USER CURRENT BALANCE
    let getScore = await api.getScore();
    return getScore.score;
}

async function updateBalance(amount) {
    // SEND API REQUEST TO UPDATE USER BALANCE, RETURN NEW BALANCE
    let balance = await getBalance();
    await api.postScore(user.username, balance + amount);
    balance = await getBalance();
    return balance;
}











function evaluate(dealerCard, playerCards, input) {

    var dealerScore = evaluateCard(dealerCard);
    if (dealerScore === 1) {
        dealerScore = 11;
    }

    var playerScore = 0;
    var aces = 0;

    playerCards.querySelectorAll('card-body').forEach((c) => {
        var val = eval(evaluateCard(c));
        if (val == 1) {
            aces++;
            playerScore += 11;
        } else {
            playerScore += val;
        }
        while (playerScore > 21 && aces != 0) {
            playerScore -= 10;
            aces--;
        }
    });

    let soft;
    if (aces > 0) {
        soft = true;
    } else {
        soft = false;
    }

    let split;
    if (playerCards.querySelectorAll('card-body').length != 2 || evaluateCard(playerCards.querySelectorAll('card-body')[1]) !== evaluateCard(playerCards.querySelectorAll('card-body')[0])) {
        split = false;
    } else {
        split = true;
    }

    let double;
    if (playerCards.querySelectorAll('card-body').length != 2) {
        double = false;
    } else {
        double = true;
    }

    if (playerScore === 12 && soft) {
        return input === "split";
    } else if (soft) {
        if (playerScore < 18) {
            if (dealerScore > 3 && dealerScore < 7 && double) {
                return input === "double";
            } else {
                return input === "hit";
            }
        } else if (playerScore === 18) {
            if (dealerScore > 2 && dealerScore < 7 && double) {
                return input === "double";
            } else if (dealerScore > 8) {
                return input === "hit";
            } else {
                return input === "stand";
            }
        } else {
            return input === "stand";
        }
    } else if (playerScore === 21) {
        return input === "stand";
    } else if (playerScore === 20) {
        return input === "stand";
    } else if (playerScore === 18 && split) {
        if (dealerScore != 7 && dealerScore < 10) {
            return input === "split";
        } else {
            return input === "stand";
        }
    } else if (playerScore === 16 && split) {
        return input === "split";
    } else if (playerScore === 14 && split) {
        if (dealerScore < 8) {
            return input === "split";
        } else {
            return input === "hit";
        }
    } else if (playerScore === 12 && split) {
        if (dealerScore < 7) {
            return input === "split";
        } else {
            return input === "hit";
        }
    } else if (playerScore === 6 && split) {
        if (dealerScore > 3 && dealerScore < 8) {
            return input === "split";
        } else {
            return input === "hit";
        }
    } else if (playerScore === 4 && split) {
        if (dealerScore > 3 && dealerScore < 8) {
            return input === "split";
        } else {
            return input === "hit";
        }
    } else if (playerScore > 16 && playerScore < 21) {
        return input === "stand";
    } else if (playerScore > 12 && playerScore < 17) {
        if (dealerScore < 7) {
            return input === "stand";
        } else {
            return input === "hit";
        }
    } else if (playerScore === 12) {
        if (dealerScore > 3 && dealerScore < 7) {
            return input === "stand";
        } else {
            return input === "hit";
        }
    } else if (playerScore === 11) {
        if (double) {
            return input === "double";
        } else {
            return input === "hit";
        }
    } else if (playerScore === 10) {
        if (dealerScore < 10 && double) {
            return input === "double";
        } else {
            return input === "hit";
        }
    } else if (playerScore === 9) {
        if (dealerScore < 7 && dealerScore != 2 && double) {
            return input === "double";
        } else {
            return input === "hit";
        }
    } else {
        return input === "hit";
    }
}

export default { deal, getCount, getBalance, updateBalance, evaluate };