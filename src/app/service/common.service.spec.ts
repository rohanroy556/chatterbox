import { TestBed, inject } from '@angular/core/testing';
import { OverlayContainer } from '@angular/cdk/overlay';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material/material.module';
import { CommonService } from './common.service';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('CommonService', () => {
  let service: CommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MaterialModule
      ]
    });
    service = TestBed.inject(CommonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should display duration message', inject([MatSnackBar, OverlayContainer],
    (snackBar: MatSnackBar, overlayContainer: OverlayContainer) => {
    const overlayContainerElement: HTMLElement = overlayContainer.getContainerElement();
    const message = "Test Message";
    service.durationMessage(message);
    const containerElement = overlayContainerElement.querySelector('simple-snack-bar'),
      buttonElement = containerElement?.querySelector('button');
    expect(containerElement?.textContent).toContain(message);
    expect(buttonElement?.textContent?.toLowerCase()).toBe('ok');
  }));
});
