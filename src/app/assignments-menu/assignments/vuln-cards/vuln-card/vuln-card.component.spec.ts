import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VulnCardComponent } from './vuln-card.component';

describe('VulnCardsComponent', () => {
  let component: VulnCardComponent;
  let fixture: ComponentFixture<VulnCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VulnCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VulnCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
