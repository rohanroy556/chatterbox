import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { CommonService } from 'src/app/service';
import { User } from '../../auth.model';

import { AuthComponent } from './auth.component';

const commonService = {
  showAppLoader: false,
  durationMessage: () => {}
}
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJhbmRvbUBleGFtcGxlLmNvbSIsIm5hbWUiOiJKb2huIERvZSJ9.h1rztIET9qhX61oMbq7Fd6pnvnKn7NnDrBNZftiIY28';
const mockUser: User = { _id: 'id', email: 'random@example.com', token, name: 'John Doe' };

const mockData = {
  login: () => of(mockUser),
  signup: () => of(mockUser)
}

const mockMatDialogRef = {
  close: () => {}
};

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthComponent ],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MaterialModule,
        ReactiveFormsModule
      ],
      providers:[
        { provide: CommonService, useValue: commonService },
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockData }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
