import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PropertyDetailsComponent } from './property-details.component';
import { ActivatedRoute } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Property } from '../shared/models/property.model';
import { UserInfo } from '../shared/models/user-info.model';
import { AppConstants } from '../shared/const/app.constants';

describe('PropertyDetailsComponent', () => {
  let component: PropertyDetailsComponent;
  let fixture: ComponentFixture<PropertyDetailsComponent>;
  let store: Store;

  const mockActivatedRoute = {
    params: of({ id: '1' }),
  };

  const mockUser: UserInfo = {
    name: 'Ajay Kumar',
    email: 'user@gmail.com',
    role: 'renter',
    password: 'user123',
    favourites: [1],
  };

  const mockPropertyList: Property[] = [
    {
      id: 1,
      userEmail: 'admin@gmail.com',
      propertyType: 'apartment',
      area: 100,
      leaseType: 'Long Term',
      isNegotiable: false,
      isFurnished: true,
      isSharedProperty: false,
      address: 'Malviya Nagar',
      city: 'New Delhi',
      state: 'Delhi',
      title: '2 BHK Flat For Rent In Malviya Nagar',
      description:
        'Standalone building, near Max hospital. Luxurious flat with all facilities and essentials nearby',
      rentAmount: 40000,
      images: ['Apartment2.jpg'],
      amenities: ['Swimming Pool', 'Garbage Disposal', 'Laundry Service'],
      comments: [],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyDetailsComponent, FormsModule, StoreModule.forRoot({})],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        {
          provide: Store,
          useValue: {
            pipe: () => of(mockPropertyList),
            dispatch: jasmine.createSpy(),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyDetailsComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);

    // Mock sessionStorage
    spyOn(sessionStorage, 'getItem').and.callFake((key: string) => {
      if (key === AppConstants.SIGNED_IN_USER) {
        return JSON.stringify(mockUser);
      }
      if (key === AppConstants.USERS_LIST) {
        return JSON.stringify([mockUser]);
      }
      return null;
    });
    spyOn(sessionStorage, 'setItem').and.callThrough();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with the correct property data', () => {
    expect(component.id).toBe(1);
    expect(component.property).toEqual(mockPropertyList[0]);
    expect(component.user).toEqual(mockUser);
    expect(component.users).toEqual([mockUser]);
  });

  it('should correctly identify if a property is a favourite', () => {
    expect(component.isFavourite).toBe(true);
  });

  it('should allow submitting a comment', () => {
    component.newComment = 'Test comment';
    component.submit();
    expect(component.property?.comments.length).toBe(1);
    expect(component.property?.comments[0].comment).toBe('Test comment');
  });

  it('should toggle favourite status', () => {
    component.toggleFavourite();
    expect(component.user.favourites.includes(1)).toBe(false);

    component.toggleFavourite();
    expect(component.user.favourites.includes(1)).toBe(true);
  });

  it('should store user data when favourites are toggled', () => {
    component.toggleFavourite();
    expect(sessionStorage.setItem).toHaveBeenCalledWith(
      AppConstants.SIGNED_IN_USER,
      JSON.stringify(component.user)
    );
    expect(sessionStorage.setItem).toHaveBeenCalledWith(
      AppConstants.USERS_LIST,
      JSON.stringify([component.user])
    );
  });
});
