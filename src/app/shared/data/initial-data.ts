export const users = [
  {
    name: 'Ajay Kumar',
    email: 'user@gmail.com',
    role: 'renter',
    password: 'user123',
    favourites: [2, 3],
  },
  {
    name: 'Sandeep Singh',
    email: 'admin@gmail.com',
    role: 'landlord',
    password: 'admin123',
    favourites: [],
  },
];

export const propertyList = [
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
    comments: [
      {
        user: {
          name: 'Sandeep Singh',
          email: 'admin@gmail.com',
          role: 'landlord',
          password: 'admin123',
          favourites: [],
        },
        comment: 'Exact Location?',
      },
    ],
  },
  {
    id: 2,
    userEmail: 'admin@gmail.com',
    propertyType: 'apartment',
    area: 100,
    leaseType: 'Long Term',
    isNegotiable: false,
    isFurnished: true,
    isSharedProperty: false,
    address: 'Geeta Colony',
    city: 'New Delhi',
    state: 'Delhi',
    title: '3 BHK Flat For Rent In Baverly Hills Apartment',
    description: 'Gated Society just opposite to Chacha Nehru Hospital',
    amenities: ['Car Park', 'Private Lawn', 'Elevator'],
    rentAmount: 45000,
    images: ['2f82b252c2d1c0015f26c1b5c70857a0-full.jpg'],
    comments: [
      {
        user: {
          name: 'Ajay Kumar',
          email: 'user@gmail.com',
          role: 'renter',
          password: 'user123',
          favourites: [2, 3],
        },
        comment: 'Is price Negotiable?',
      },
    ],
  },
  {
    id: 3,
    userEmail: 'test@gmail.com',
    propertyType: 'apartment',
    area: 100,
    leaseType: 'Long Term',
    isNegotiable: false,
    isFurnished: true,
    isSharedProperty: false,
    address: 'Sector 16 Noida',
    city: 'Noida',
    state: 'Uttar Pradesh',
    title: '2 BHK Flat For Rent In Sector 16, Noida',
    description: 'Standalone building in residential Area',
    rentAmount: 30000,
    images: ['Apartment1.jpg'],
    amenities: ['Private Lawn', 'Elevator', "Visitor's Parking"],
    comments: [],
  },
];
