- This is a RentHub Application which has been developed as part of the Angular basic assignment.

- This is a role based application with the following 2 roles-

Renter- Renter can view all the properties and mark them as favourites if they want and can even comment on the properties if they want to enquire anything

Landlord- Landlord can view/edit their own published properties and can publish new properties. They can even reply on the queries which others are having on their properties through comments.

- Users data is being managed with the help of sessionStorage whereas properties data is being managed by NgRx store. Initially 2 users and 3 properties are taken and defined in initial-data.ts file

- Users-
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
  }

  - GitHub Link where code is kept-
    https://github.com/Saad9375/RentHub

  - Link for deployed Application-
    https://renthub2.netlify.app/
