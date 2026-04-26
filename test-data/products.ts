export interface Product {
  name: string;
  price: number;
}

export const products: Record<string, Product> = {
  backpack: {
    name: 'Sauce Labs Backpack',
    price: 29.99,
  },
  bikeLight: {
    name: 'Sauce Labs Bike Light',
    price: 9.99,
  },
  boltTShirt: {
    name: 'Sauce Labs Bolt T-Shirt',
    price: 15.99,
  },
  fleeceJacket: {
    name: 'Sauce Labs Fleece Jacket',
    price: 49.99,
  },
};

export const checkoutInfo = {
  firstName: 'John',
  lastName: 'Doe',
  zipCode: '12345',
};
