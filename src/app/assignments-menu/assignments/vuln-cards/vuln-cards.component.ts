import { Component } from '@angular/core';
import { VulnCardComponent } from './vuln-card/vuln-card.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vuln-cards',
  standalone: true,
  imports: [VulnCardComponent],
  templateUrl: './vuln-cards.component.html',
  styleUrl: './vuln-cards.component.scss',
})
export class VulnCardsComponent {
  constructor(private router: Router) {}

  backToMain() {
    this.router.navigateByUrl('');
  }
}
