# Product Seeding Guide

This guide explains how to populate your Firestore database with products from Swati Herbal Cosmetics rate cards.

## Prerequisites

1. Firebase project is set up and configured
2. Firestore database is created
3. Firebase config is properly set in `src/firebase/config.js`

## Running the Seed Script

The seed script will add all products from both rate cards:
- **Healthcare Products** (Men's Wellness, Female's Wellness, Joint Care, Weight Loss, Piles Care, etc.)
- **Skin & Hair Care Products** (Soaps, Face Washes, Hair Products, Skin Care, etc.)

### Steps:

1. **Make sure Firebase is configured** - The script uses the same config as your app

2. **Run the seed script:**
   ```bash
   npm run seed
   ```

3. **Verify products in Firebase Console:**
   - Go to Firebase Console → Firestore Database
   - Check the `products` collection
   - You should see all products with their details

## Product Data Structure

Each product includes:
- `name` - Product name
- `description` - Product description with size/quantity
- `category` - Product category
- `retailPrice` - Retail price in ₹
- `bulkPrice` - Bulk/reseller price in ₹
- `minBulkQty` - Minimum quantity for bulk pricing
- `stock` - Initial stock count
- `bestseller` - Boolean flag for bestseller products
- `imageUrl` - Empty string (to be filled with product images later)
- `createdAt` - Timestamp

## Notes

- The script includes **120+ products** from both rate cards
- Products are marked as bestsellers based on popularity
- Bulk pricing is set with reasonable discounts (10-15% off retail)
- Stock levels are set to reasonable defaults
- You can modify the script to adjust prices, stock, or add more products

## Adding Product Images

After seeding, you'll need to:
1. Upload product images to Firebase Storage
2. Update each product's `imageUrl` field in Firestore with the storage URL

## Troubleshooting

If the script fails:
- Check Firebase config is correct
- Ensure Firestore is enabled in Firebase Console
- Check that you have write permissions
- Review console output for specific error messages
