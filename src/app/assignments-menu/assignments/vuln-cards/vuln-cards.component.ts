import { Component, OnInit } from "@angular/core";
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
export class VulnCardsComponent implements OnInit {
  vulnListAll: any[] = [];
  vulnList: any[] = [];
  currentPage = 0;
  itemsPerPage = 20;
  hasMoreItems = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.vulnListAll = [...vulnList];
    
    for (let i = 0; i < 1000; i++) {
      let randomIndex = Math.floor(Math.random() * vulnList.length);
      let newItem = { ...vulnList[randomIndex] };
      newItem.id = `${newItem.id}-${i}`;
      
	  this.vulnListAll.push(newItem);
    }

    this.loadMoreItems();
  }


  onScroll(event: any): void {
    const container = event.target;

    if (!container || !this.hasMoreItems) return;

    let scrollTop = container.scrollTop;
    let scrollHeight = container.scrollHeight;
    let clientHeight = container.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - 100) this.loadMoreItems();
  }

  loadMoreItems(): void {
    if (!this.hasMoreItems) return;
    
    let startIndex = this.currentPage * this.itemsPerPage;
    let endIndex = startIndex + this.itemsPerPage;
    
    if (startIndex >= this.vulnListAll.length) {
      this.hasMoreItems = false;
      return;
    }

    let newItems = this.vulnListAll.slice(startIndex, endIndex);
    this.vulnList = [...this.vulnList, ...newItems];
    this.currentPage++;
    
    if (endIndex >= this.vulnListAll.length) {
      this.hasMoreItems = false;
    }
  }

  backToMain() {
    this.router.navigateByUrl("");
  }
}
