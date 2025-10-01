import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SeverityParams } from "../vuln-cards-mock-data";

@Component({
  selector: "app-vuln-card",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./vuln-card.component.html",
  styleUrl: "./vuln-card.component.scss",
})
export class VulnCardComponent {
  @Input() card: any;

  get severityColor() {
    // Use color from SeverityParams, fallback to #0f93bb
    return this.card && SeverityParams[this.card.severity]?.color
      ? SeverityParams[this.card.severity].color
      : "#0f93bb";
  }
  get severityAbbr() {
    // Use abbr from SeverityParams, fallback to first letter of severity (always uppercase)
    if (this.card && SeverityParams[this.card.severity]?.abbr) {
      return SeverityParams[this.card.severity].abbr;
    }
    if (this.card?.severity) {
      return this.card.severity[0].toUpperCase();
    }
    return "?";
  }
  get sourceIcon() {
    // Map source to icon path (example for 'nvd')
    const source = this.card?.mappingSources?.[0] || "nvd";
    if (source === "nvd") {
      return "assets/icons/nvd-icon-new.svg";
    }
    // Add more mappings as needed
    return "assets/icons/nvd-icon-new.svg";
  }
}
