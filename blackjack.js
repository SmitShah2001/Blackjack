let blackjackGame={
    'you' : {'scoreSpan': '#your-blackjack-result','div': '#your-box' , 'score' : 0},
    'dealer' : {'scoreSpan': '#dealer-blackjack-result','div': '#dealer-box' , 'score' : 0},
    'cards' : ['images/2' ,'images/3','images/4','images/5','images/6','images/7','images/8','images/9','images/10','images/J','images/Q','images/K','images/A'],
    'cardMap' : {'images/2': 2 ,'images/3': 3 ,'images/4': 4 ,'images/5': 5 ,'images/6':6  ,'images/7': 7,'images/8': 8 ,'images/9': 9 ,'images/10' : 10, 'images/J': 10, 'images/Q' : 10, 'images/K' : 10, 'images/A': [1,11]},
    'wins' : 0,
    'losses' : 0,
    'drews' : 0,
    'isStand' : false,
    'turnsOver' : false,
};

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];

const hitsound = new Audio('swish.m4a');
const Winsound = new Audio('cash.mp3');
const losesound = new Audio('aww.mp3');

function blackjackHit(){
   if(blackjackGame['isStand'] === false){
       let card =randomCard();
       console.log(card);
       showCard(card, YOU);
       updateScore(card ,YOU);
       showScore(YOU);
   }
}
function randomCard(){
    let randomIndex = Math.floor(Math.random()*13);
    return blackjackGame['cards'][randomIndex];
}

function showCard(card,activeplayer){
    if(activeplayer['score'] <= 21){
    
        let cardImage = document.createElement('img');
        cardImage.src =`${card}.jpg`;
        document.querySelector(activeplayer['div']).appendChild(cardImage);
        hitsound.play();
    }
}

function blackjackDeal(){
    if( blackjackGame['turnsOver'] === true){

        
        
        blackjackGame['isStand'] = false;
        // showResult(computeWinner());
        // computeWinner();
        let yourImages = document.querySelector("#your-box").querySelectorAll('img');
        let dealerImages = document.querySelector("#dealer-box").querySelectorAll('img');
     
     
        for (let i = 0; i < yourImages.length; i++) {
          yourImages[i].remove();
        }
        for (let i = 0; i < dealerImages.length; i++) {
           dealerImages[i].remove();
        }

        YOU['score'] = 0;
        DEALER['score'] = 0;

        document.querySelector('#your-blackjack-result').textContent = 0;
        document.querySelector('#dealer-blackjack-result').textContent = 0;
    
        document.querySelector('#your-blackjack-result').style.color ='white';
        document.querySelector('#dealer-blackjack-result').style.color ='white';

        document.querySelector('#blackjack-result').textContent = "Let's Play"; 
        document.querySelector('#blackjack-result').style.color = 'black';

        blackjackGame['turnsOver'] === true;
    }
   
   
}

function updateScore(card,activeplayer){
     
    if(card=='images/A'){
    //If adding 11 keeps me below 21, and 11. otherwise , add 1.
          if(activeplayer['score'] + blackjackGame['cardMap'][card][1] <= 21 ){
                  
            activeplayer['score'] +=  blackjackGame['cardMap'][card][1];
          
          }else{
              
            activeplayer['score'] +=  blackjackGame['cardMap'][card][0];

          }
    
    }else{
    
    activeplayer['score'] += blackjackGame['cardMap'][card];
    }

}

function showScore(activeplayer){
    if(activeplayer['score'] > 21){
        document.querySelector(activeplayer['scoreSpan']).textContent = 'BUST!';
        document.querySelector(activeplayer['scoreSpan']).style.color = 'red';
    }else{
    document.querySelector(activeplayer['scoreSpan']).textContent =activeplayer['score'];
    }
}

function sleep(ms){
    return new Promise( resolve => setTimeout(resolve , ms));
}

async function dealerLogic(){
    blackjackGame['isStand'] = true;

    while( DEALER['score'] < 16  && blackjackGame['isStand'] === true ){
        let card = randomCard();
        showCard(card,DEALER);
        updateScore(card,DEALER);
        showScore(DEALER);
        await sleep(1000);
    }
    
    blackjackGame['turnsOver'] = true;
    let Winner = computeWinner();
    showResult(Winner);
        
    
}
 
// compute winner and retrun who just won 
// update the  wins, loses and drews
function computeWinner(){
    let Winner;

    if(YOU['score'] <= 21){
        //cond: higher score then dealer or when dealer busts but you are 21 or under
        if( YOU['score'] > DEALER['score'] || DEALER['score'] > 21 ){
            blackjackGame['wins']++;
            
            Winner = YOU;
        
        }else if  ( YOU['score'] < DEALER['score']){
            blackjackGame['losses']++;
            
            Winner = DEALER;

        }else if  (  YOU['score'] ===  DEALER['score'] ){
            blackjackGame['drews']++;


        }
        //cond : when user bust but dealer doesn't
    }else if  (YOU['score'] > 21 &&  DEALER['score'] <= 21){
        blackjackGame['losses']++;
        Winner = DEALER;


        // cond : when user and dealer both bust
    }else if  (YOU['score'] > 21  && DEALER['score'] > 21){
        blackjackGame['drews']++;
    }
   
    console.log(blackjackGame);
    return Winner;
}
function showResult(Winner){
    let message, messagecolor;

    if(blackjackGame['turnsOver'] === true){

    if(Winner === YOU) {
        document.querySelector('#wins').textContent = blackjackGame['wins'];
        message = 'You Won!';
        messagecolor = 'green';
        Winsound.play();

    } else if(Winner === DEALER) {
        document.querySelector('#losses').textContent = blackjackGame['losses'];
        message = 'You Lost!';
        messagecolor = 'red';
        losesound.play();

    } else {
        document.querySelector('#draws').textContent = blackjackGame['drews'];
        message ='You Drew';
        messagecolor = 'black';
    }

    document.querySelector('#blackjack-result').textContent = message;
    document.querySelector('#blackjack-result').style.color = messagecolor;
    }
}