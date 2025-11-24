# Walkthrough - Theme Update (Branch: outracoisa)

I have updated the "Shop" and "Cart" screens to use the application's theme colors instead of hardcoded red values.

## Changes Made

### 1. Screens
- **`src/components/screen/ShopScreen.js`**:
    - Replaced `#D00000` with `colors.primary` (from `useTheme`).
    - Replaced white backgrounds with `colors.background` and `colors.surface`.
    - Updated text colors to `colors.onSurface` and `colors.onPrimary`.
- **`src/components/screen/CartScreen.js`**:
    - Replaced `#D00000` with `colors.primary` for buttons and totals.
    - Replaced `#D00000` with `colors.error` for the delete icon.
    - Updated backgrounds and text colors to match the theme.

## Verification
- **Visual Consistency**: The "Loja" and "Carrinho" screens should now match the Dark Theme (purple/teal) defined in `App.js`, rather than the original red theme from `novo_projetoBoer`.
- **Functionality**: No logic changes were made, only styling updates.

## Next Steps for User
1.  Run the app: `npx expo start`
2.  Navigate to "Loja" and "Carrinho".
3.  Verify that the colors match the rest of the app (e.g., purple buttons instead of red).
