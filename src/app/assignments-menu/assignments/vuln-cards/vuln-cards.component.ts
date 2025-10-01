import { Component } from "@angular/core";
import { VulnCardComponent } from "./vuln-card/vuln-card.component";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { vulnList } from "./vuln-cards-mock-data";

@Component({
  selector: "app-vuln-cards",
  standalone: true,
  imports: [VulnCardComponent, CommonModule],
  templateUrl: "./vuln-cards.component.html",
  styleUrl: "./vuln-cards.component.scss",
})
export class VulnCardsComponent {
  vulnList = vulnList;
  constructor(private router: Router) {}

  backToMain() {
    this.router.navigateByUrl("");
  }
}
