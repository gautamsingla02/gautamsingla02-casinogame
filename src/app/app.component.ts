import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="container" style="text-align: center; padding: 20px; background-color: #000; color: #fff; border-radius: 10px; box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.3); max-width: 400px; margin: 0 auto;">
      <h1 style="font-size: 32px; margin-bottom: 20px;">🎰 Casino Number Game 🎰</h1>
      <p *ngIf="message" style="font-size: 20px; color: #ff5722; margin-top: 10px;">{{ message }}</p>
      <input #guessInput type="number" [(ngModel)]="userGuess" [disabled]="gameOver" style="padding: 10px; font-size: 16px; width: 100%; margin-bottom: 10px; border: 2px solid #ff5722; border-radius: 5px; color: #333; background-color: #fff;">
      <button (click)="checkGuess()" [disabled]="gameOver || attempts === 0" style="padding: 10px 20px; font-size: 18px; color: #fff; border: none; cursor: pointer; border-radius: 5px; margin: 5px; background-color: #007bff;">Check</button>
      <button (click)="revealNumber()" [disabled]="gameOver || attempts === 0" style="padding: 10px 20px; font-size: 18px; color: #fff; border: none; cursor: pointer; border-radius: 5px; margin: 5px; background-color: #ff5722;">Reveal Number</button>
      <button (click)="resetGame()" style="padding: 10px 20px; font-size: 18px; color: #fff; border: none; cursor: pointer; border-radius: 5px; margin: 5px; background-color: #555;">Restart</button>
      <p *ngIf="!gameOver && attempts > 0" style="font-size: 16px; color: #777; margin-top: 10px;">Attempts left: {{ attempts }}</p>
      <button (click)="giveHint()" [disabled]="gameOver || attempts === 0 || hintGiven" style="padding: 10px 20px; font-size: 18px; color: #fff; border: none; cursor: pointer; border-radius: 5px; margin: 5px; background-color: #6b38f7;">Hint</button>
      <p *ngIf="score > 0" style="font-size: 18px; color: #33cc33; margin-top: 10px;">Score: {{ score }}</p>
      <p *ngIf="winStreak > 0" style="font-size: 18px; color: #ff9933; margin-top: 10px;">Win Streak: {{ winStreak }}</p>
      <button (click)="newGamePlus()" [disabled]="!gameOver || winStreak === 0" style="padding: 10px 20px; font-size: 18px; color: #fff; border: none; cursor: pointer; border-radius: 5px; margin: 5px; background-color: #ff9933;">New Game+</button>
      <audio #correctAudio>
        <source src="assets/correct.mp3" type="audio/mpeg">
      </audio>
      <audio #incorrectAudio>
        <source src="assets/incorrect.mp3" type="audio/mpeg">
      </audio>
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('correctAudio')
  correctAudio!: ElementRef;
  @ViewChild('incorrectAudio')
  incorrectAudio!: ElementRef;
  
  targetNumber!: number;
  userGuess!: number | null;
  message!: string | null;
  gameOver!: boolean;
  numberRevealed!: boolean;
  attempts!: number;
  maxAttempts: number;
  hintGiven!: boolean;
  score!: number;
  winStreak!: number;

  constructor() {
    this.maxAttempts = 5; // Set the maximum number of attempts
    this.resetGame();
  }

  resetGame() {
    this.targetNumber = this.generateRandomNumber();
    this.userGuess = null;
    this.message = null;
    this.gameOver = false;
    this.numberRevealed = false;
    this.attempts = this.maxAttempts;
    this.hintGiven = false;
  }

  generateRandomNumber(): number {
    return Math.floor(Math.random() * 100) + 1; // Random number between 1 and 100
  }

  checkGuess() {
    if (this.userGuess === this.targetNumber) {
      this.message = '🎉 Congratulations! You guessed the correct number! 🎉';
      this.gameOver = true;
      this.playCorrectSound();
      this.score += this.attempts * 10;
      this.winStreak++;
    } else if (this.userGuess! < this.targetNumber!) {
      this.message = 'Try a higher number.';
      this.playIncorrectSound();
      this.attempts--;
    } else {
      this.message = 'Try a lower number.';
      this.playIncorrectSound();
      this.attempts--;
    }

    if (this.attempts === 0 && !this.gameOver) {
      this.message = '😞 You ran out of attempts. The correct number was ' + this.targetNumber + '.';
      this.gameOver = true;
      this.playIncorrectSound();
      this.winStreak = 0;
    }
  }

  revealNumber() {
    this.message = 'The randomly generated number was: ' + this.targetNumber;
    this.numberRevealed = true;
  }

  giveHint() {
    const hint = this.targetNumber % 2 === 0 ? 'The number is even.' : 'The number is odd.';
    this.message = `Hint: ${hint}`;
    this.hintGiven = true;
  }

  playCorrectSound() {
    this.correctAudio.nativeElement.play();
  }

  playIncorrectSound() {
    this.incorrectAudio.nativeElement.play();
  }

  newGamePlus() {
    
    this.resetGame();
    this.winStreak = 0;
    this.attempts = this.maxAttempts;
  }
}
