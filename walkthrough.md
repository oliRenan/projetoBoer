# Walkthrough - Merge Features (Branch: outracoisa)

I have re-applied the merge of "Shop" and "Cart" features into the `outracoisa` branch, ensuring compatibility with the existing Dark Theme.

## Changes Made

### 1. Context
- Created `src/context/CartContext.js` to manage the shopping cart state.

### 2. Screens
- Created `src/components/screen/ShopScreen.js`:
    - Fetches products from the API.
    - Lists products with images and prices.
    - Allows adding items to the cart.
- Created `src/components/screen/CartScreen.js`:
    - Lists items in the cart.
    - Allows adjusting quantities or removing items.
    - Shows total price.

### 3. Navigation & App Structure
- **`App.js`**: Wrapped the application with `CartProvider`. **Preserved the existing Dark Theme configuration.**
- **`src/components/menu.js`**:
    - Imported `ShopScreen` and `CartScreen`.
    - Added "Loja" and "Carrinho" tabs to the Bottom Tab Navigator.
    - Added icons for the new tabs (`shopping-bag` and `shopping-cart`).

## Verification
- **Theme Consistency**: The new screens should inherit the dark theme styling where applicable, or at least not break the app's visual consistency.
- **Functionality**: The cart logic is identical to the previous implementation.

## Next Steps for User
1.  Run the app: `npx expo start`
2.  Login to the app.
3.  You should see new tabs "Loja" and "Carrinho".
4.  Test adding items to the cart and finalizing a purchase.
