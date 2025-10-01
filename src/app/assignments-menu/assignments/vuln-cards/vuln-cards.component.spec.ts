import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VulnCardsComponent } from './vuln-cards.component';

describe('VulnCardsComponent', () => {
  let component: VulnCardsComponent;
  let fixture: ComponentFixture<VulnCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VulnCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VulnCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
